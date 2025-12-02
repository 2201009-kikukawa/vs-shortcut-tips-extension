import { window, Uri, Webview, WebviewViewProvider } from "vscode";
import * as vscode from "vscode";
import { getUri } from "../utilities/getUri";
import { getNonce } from "../utilities/getNonce";
import { ShortcutProps } from "../const";
import * as fs from "fs";
import * as path from "path";

export class ViewProvider implements WebviewViewProvider {
  public static readonly viewType = "shortcut-tips";

  constructor(
    private readonly _context: vscode.ExtensionContext,
    private readonly extensionUri: Uri
  ) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [Uri.joinPath(this.extensionUri, "out")],
    };
  }

  // タブを開いた時に履歴を追加
  public async openTabView(shortcut: ShortcutProps) {
    await this.addShortcutHistoryFile(shortcut);

    const webviewPanel = window.createWebviewPanel(
      "shortcut-tips-WebviewView",
      "shortcut-tips",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [Uri.joinPath(this.extensionUri, "out")],
      }
    );

    webviewPanel.webview.html = this._getWebviewContent(webviewPanel.webview, this.extensionUri);

    webviewPanel.webview.onDidReceiveMessage((message) => {
      if (message.type === "ready") {
        webviewPanel.webview.postMessage({
          type: "shortcutData",
          payload: shortcut,
        });
      }
    });
  }

  // 履歴追加処理
  private async addShortcutHistoryFile(shortcut: ShortcutProps) {
    const context = this._context;
    const filePath = path.join(context.globalStorageUri.fsPath, "history.json");
    const HISTORY_LIMIT = 50;

    await vscode.workspace.fs.createDirectory(context.globalStorageUri);

    let history: { name: string; command: string; date: string }[] = [];

    // 履歴ファイルの読み込み
    if (fs.existsSync(filePath)) {
      try {
        const data = fs.readFileSync(filePath, "utf8");
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          history = parsed;
        } else {
          console.warn("履歴ファイルの形式が不正です。新規作成します。");
        }
      } catch (err) {
        console.error("履歴ファイル読み込みエラー:", err);
      }
    }

    // 同じコマンドの履歴を削除
    const beforeLength = history.length;
    history = history.filter((item) => item.command !== shortcut.command);
    const removedCount = beforeLength - history.length;

    if (removedCount > 0) {
      console.log(`重複履歴を ${removedCount} 件削除しました。`);
    }

    // 新しい履歴を先頭に追加
    const newEntry = {
      name: shortcut.name,
      command: shortcut.command,
      date: new Date().toISOString(),
    };
    history.unshift(newEntry);

    if (history.length > HISTORY_LIMIT) {
      const removed = history.splice(HISTORY_LIMIT);
      console.log(`履歴上限 (${HISTORY_LIMIT}) 超過: ${removed.length} 件削除`);
    }

    // 履歴を保存
    try {
      fs.writeFileSync(filePath, JSON.stringify(history, null, 2), "utf8");
    } catch (err) {
      console.error("履歴ファイル書き込みエラー:", err);
    }
  }

  private _getWebviewContent(webview: Webview, extensionUri: Uri) {
    const webviewUri = getUri(webview, extensionUri, ["out", "webviewTab.js"]);
    const stylesUri = getUri(webview, extensionUri, ["out", "styles.css"]);
    const nonce = getNonce();

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}'; img-src https:;">
      <link rel="stylesheet" href="${stylesUri}" />
      <title>Shortcut Viewer</title>
    </head>
    <body>
      <div id="root"></div>
      <script type="module" nonce="${nonce}" src="${webviewUri}"></script>
    </body>
    </html>
  `;
  }
}
