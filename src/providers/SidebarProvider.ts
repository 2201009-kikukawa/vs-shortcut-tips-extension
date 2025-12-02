import * as vscode from "vscode";
import { Uri, Webview, WebviewViewProvider } from "vscode";
import { getUri } from "../utilities/getUri";
import { getNonce } from "../utilities/getNonce";
import { ShortcutProps, Shortcut, SHORT_CUT } from "../const";
import { ViewProvider } from "./TabProvider";
import * as os from "os";
import * as fs from "fs";
import * as path from "path";

export class SidebarViewProvider implements WebviewViewProvider {
  public static readonly viewType = "Sidebar";
  private webviewView: vscode.WebviewView | undefined;

  constructor(private context: vscode.ExtensionContext, private readonly extensionUri: Uri) {}

  private get historyFilePath() {
    return path.join(this.context.globalStorageUri.fsPath, "history.json");
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this.webviewView = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [Uri.joinPath(this.extensionUri, "out")],
    };

    webviewView.webview.html = this._getWebviewContent(
      webviewView.webview,
      this.context.extensionUri
    );

    // メッセージ受信
    webviewView.webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case "openShortcutTab": {
          const shortcut: Shortcut = message.value;
          const converted = this.convertShortcutForTab(shortcut);

          new ViewProvider(this.context, this.extensionUri).openTabView(converted);

          this.addHistory({
            name: converted.name,
            description: converted.description,
            command: converted.command,
            gif: converted.gif,
          });
          break;
        }

        case "requestHistory": {
          this.refreshHistory();
          break;
        }

        case "clearHistory": {
          fs.writeFileSync(this.historyFilePath, JSON.stringify([]), "utf8");
          this.refreshHistory();
          vscode.window.showInformationMessage("履歴をクリアしました。");
          break;
        }

        default:
          break;
      }
    });
  }

  // 履歴の読み込み
  private readHistory(): any[] {
    const dir = path.dirname(this.historyFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    if (!fs.existsSync(this.historyFilePath)) return [];
    try {
      const data = fs.readFileSync(this.historyFilePath, "utf8");
      return JSON.parse(data);
    } catch (err) {
      console.error("履歴ファイル読み込みエラー:", err);
      return [];
    }
  }

  // 履歴の追加
  public addHistory(newItem: any) {
    let history = this.readHistory();

    // 同じ command の履歴を削除
    history = history.filter((item) => item.command !== newItem.command);

    // 日付を追加して先頭に追加
    newItem.date = new Date().toISOString();
    history.unshift(newItem);

    // 保存
    fs.writeFileSync(this.historyFilePath, JSON.stringify(history.slice(0, 50)), "utf8");

    // Webview が開いている場合は即反映
    this.refreshHistory();
  }

  // 履歴をサイドバーに送信
  public refreshHistory() {
    if (!this.webviewView) return;
    const history = this.readHistory();

    const enrichedHistory = history.map((item) => {
      const matched = SHORT_CUT.find(
        (shortcut) =>
          shortcut.win32.command === item.command || shortcut.darwin.command === item.command
      );

      if (matched) {
        const platform = os.platform();
        const platformShortcut = platform === "darwin" ? matched.darwin : matched.win32;
        return {
          ...item,
          name: matched.name,
          description: matched.description,
          command: platformShortcut.command,
          gif: platformShortcut.gif,
        };
      }

      return item;
    });

    // 新しい履歴をWebviewに送信
    this.webviewView.webview.postMessage({
      command: "loadHistory",
      value: enrichedHistory.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    });
  }

  private convertShortcutForTab(shortcut: Shortcut | ShortcutProps): ShortcutProps {
    if (!("win32" in shortcut)) {
      const matched = SHORT_CUT.find((item) => {
        return item.win32.command === shortcut.command || item.darwin.command === shortcut.command;
      });

      if (matched) {
        const platform = os.platform();
        const platformShortcut = platform === "darwin" ? matched.darwin : matched.win32;

        return {
          name: matched.name,
          description: matched.description,
          command: platformShortcut.command,
          gif: platformShortcut.gif,
        };
      }

      return {
        name: shortcut.name ?? "不明なショートカット",
        description: shortcut.description ?? "",
        command: shortcut.command,
        gif: shortcut.gif ?? "",
      };
    }

    const platform = os.platform();
    const platformShortcut = platform === "darwin" ? shortcut.darwin : shortcut.win32;
    return {
      name: shortcut.name,
      description: shortcut.description,
      command: platformShortcut.command,
      gif: platformShortcut.gif,
    };
  }

  private _getWebviewContent(webview: Webview, extensionUri: Uri) {
    const webviewUri = getUri(webview, extensionUri, ["out", "Sidebar.js"]);
    const stylesUri = getUri(webview, extensionUri, ["out", "styles.css"]);
    const nonce = getNonce();

    return `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Security-Policy"
            content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}'; img-src https:;">
      <link rel="stylesheet" href="${stylesUri}" />
      <title>Shortcut History</title>
    </head>
    <body>
      <div id="root"></div>
      <script type="module" nonce="${nonce}" src="${webviewUri}"></script>
    </body>
    </html>
    `;
  }
}
