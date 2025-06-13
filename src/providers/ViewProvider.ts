import { window, Uri, Webview, WebviewViewProvider } from "vscode";
import * as vscode from "vscode";
import { getUri } from "../utilities/getUri";
import { getNonce } from "../utilities/getNonce";
import { SHORT_CUT } from "../const";
import * as os from "os";

export class ViewProvider implements WebviewViewProvider {
  public static readonly viewType = "shortcut-tips";
  private statusBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  constructor(
    private readonly _context: vscode.ExtensionContext,
    private readonly extensionUri: Uri
  ) {}

  public setupStatusBar(context: vscode.ExtensionContext, extensionUri: vscode.Uri) {
    this.statusBarItem.text = "ShortCutTips";
    this.statusBarItem.tooltip = "クリックするとメッセージを表示します";
    this.statusBarItem.command = "popup-button.showPopup";
    this.statusBarItem.show();

    context.subscriptions.push(this.statusBarItem);

    const platform = os.platform();
    const randomIndex = Math.floor(Math.random() * SHORT_CUT.length);
    const Shortcut = SHORT_CUT[randomIndex];

    let platformInfo;
    if (platform === "darwin") {
      platformInfo = Shortcut.darwin;
    } else {
      platformInfo = Shortcut.win32;
    }

    const disposable = vscode.commands.registerCommand("popup-button.showPopup", () => {
      const message = `${Shortcut.name}: ${platformInfo.command}`;
      vscode.window.showInformationMessage(message, "動きを確認する").then((selection) => {
        if (selection === "動きを確認する") {
          this.openTabView(Shortcut, platformInfo);
        }
      });
    });
    context.subscriptions.push(disposable);
  }

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

  public openTabView(
    Shortcut: {
      name: string;
      description: string;
      win32?: { command: string; gif: string };
      darwin?: { command: string; gif: string };
    },
    platformInfo: { command: string; gif: string }
  ) {
    const webviewView = window.createWebviewPanel(
      "shortcut-tips-WebviewView",
      "shortcut-tips",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [Uri.joinPath(this.extensionUri, "out")],
      }
    );
    webviewView.webview.html = this._getWebviewContent(webviewView.webview, this.extensionUri, {
      name: Shortcut.name,
      description: Shortcut.description,
      command: platformInfo.command,
      gif: platformInfo.gif,
    });
  }

  private _getWebviewContent(
    webview: Webview,
    extensionUri: Uri,
    shortcutData: { name: string; description: string; command: string; gif: string }
  ) {
    const webviewUri = getUri(webview, extensionUri, ["out", "webviewTab.js"]);
    const stylesUri = getUri(webview, extensionUri, ["out", "styles.css"]);
    const nonce = getNonce();

    const dataScript = `
      window.shortcutData = ${JSON.stringify(shortcutData)};
    `;

    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}'; img-src https://storage.googleapis.com;">
          <link rel="stylesheet" href="${stylesUri}" />
          <title>Sample</title>
        </head>
        <body>
          <div id="root"></div>
          <script nonce="${nonce}">
            ${dataScript}
          </script>
          <script type="module" nonce="${nonce}" src="${webviewUri}"></script>
        </body>
      </html>
    `;
  }
}
