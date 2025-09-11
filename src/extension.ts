import { ExtensionContext } from "vscode";
import { ViewProvider } from "./providers/TabProvider";
import { SidebarViewProvider } from "./providers/SidebarProvider";
import { getRandomShortcut } from "./utilities/getShortcut";
import * as vscode from "vscode";

let intervalTimer: NodeJS.Timeout | undefined;

export function activate(context: ExtensionContext) {
  const TabView = new ViewProvider(context, context.extensionUri);

  //ステータスバー
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBarItem.text = "ShortCutTips";
  statusBarItem.tooltip = "クリックするとメッセージを表示します";
  statusBarItem.command = "popup-button.showPopup";
  statusBarItem.show();

  context.subscriptions.push(statusBarItem);

  const disposable = vscode.commands.registerCommand("popup-button.showPopup", () => {
    const { shortcut } = getRandomShortcut();
    const message = `${shortcut.name}:${shortcut.command}`;
    vscode.window.showInformationMessage(message, "動きを確認する").then((selection) => {
      if (selection === "動きを確認する") {
        TabView.openTabView(shortcut);
      }
    });
  });

  context.subscriptions.push(disposable);

  //5分タイマー
  const intervalInMinutes = 5;

  intervalTimer = setInterval(() => {
    const { shortcut } = getRandomShortcut();
    const message = `${shortcut.name}:${shortcut.command}`;
    vscode.window.showInformationMessage(message, "動きを確認する").then((selection) => {
      if (selection === "動きを確認する") {
        TabView.openTabView(shortcut);
      }
    });
  }, intervalInMinutes * 60 * 1000);

  context.subscriptions.push({
    dispose: () => {
      if (intervalTimer) {
        clearInterval(intervalTimer);
      }
    },
  });

  //サイドバー
  const SidebarView = new SidebarViewProvider(context);

  context.subscriptions.push(vscode.window.registerWebviewViewProvider("sampleView", SidebarView));
}

export function deactivate() {
  if (intervalTimer) {
    clearInterval(intervalTimer);
  }
}
