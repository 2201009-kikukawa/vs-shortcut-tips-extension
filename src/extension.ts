import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { ExtensionContext } from "vscode";
import { ViewProvider } from "./providers/TabProvider";
import { SidebarViewProvider } from "./providers/SidebarProvider";
import { getRandomShortcut } from "./utilities/getShortcut";

let intervalTimer: NodeJS.Timeout | undefined;

// 履歴ファイルのパスを取得
function getHistoryFilePath(context: vscode.ExtensionContext) {
  return path.join(context.globalStorageUri.fsPath, "history.json");
}

// 履歴を追加
async function addShortcutHistoryFile(context: vscode.ExtensionContext, shortcut: any) {
  const filePath = getHistoryFilePath(context);

  await vscode.workspace.fs.createDirectory(context.globalStorageUri);

  let history: any[] = [];

  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, "utf8");
      history = JSON.parse(data);
    } catch (err) {
      console.error("履歴ファイルの読み込みエラー:", err);
    }
  }

  history = history.filter((item) => item.command !== shortcut.command);

  history.unshift({
    name: shortcut.name,
    command: shortcut.command,
    date: new Date().toISOString(),
  });

  try {
    fs.writeFileSync(filePath, JSON.stringify(history, null, 2), "utf8");
  } catch (err) {
    console.error("履歴ファイルの書き込みエラー:", err);
  }
}

// メイン処理
export function activate(context: ExtensionContext) {
  const TabView = new ViewProvider(context, context.extensionUri);
  const SidebarView = new SidebarViewProvider(context, context.extensionUri);

  context.subscriptions.push(vscode.window.registerWebviewViewProvider("sidebarView", SidebarView));

  async function addAndRefreshHistory(shortcut: any) {
    await addShortcutHistoryFile(context, shortcut);
    SidebarView.refreshHistory();
  }

  // ステータスバー
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBarItem.text = "ShortCutTips";
  statusBarItem.tooltip = "クリックするとメッセージを表示します";
  statusBarItem.command = "popup-button.showPopup";
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  // ポップアップコマンド
  const disposable = vscode.commands.registerCommand("popup-button.showPopup", async () => {
    const { shortcut } = getRandomShortcut();
    const message = `${shortcut.name}: ${shortcut.command}`;

    await addAndRefreshHistory(shortcut);

    vscode.window.showInformationMessage(message, "動きを確認する").then((selection) => {
      if (selection === "動きを確認する") {
        TabView.openTabView(shortcut);
        addAndRefreshHistory(shortcut);
      }
    });
  });
  context.subscriptions.push(disposable);

  // 5分タイマー
  const intervalInMinutes = 5;
  intervalTimer = setInterval(async () => {
    const { shortcut } = getRandomShortcut();
    const message = `${shortcut.name}: ${shortcut.command}`;

    await addAndRefreshHistory(shortcut);

    vscode.window.showInformationMessage(message, "動きを確認する").then((selection) => {
      if (selection === "動きを確認する") {
        TabView.openTabView(shortcut);
        addAndRefreshHistory(shortcut);
      }
    });
  }, intervalInMinutes * 60 * 1000);

  context.subscriptions.push({
    dispose: () => {
      if (intervalTimer) clearInterval(intervalTimer);
    },
  });
}

export function deactivate() {
  if (intervalTimer) clearInterval(intervalTimer);
}
