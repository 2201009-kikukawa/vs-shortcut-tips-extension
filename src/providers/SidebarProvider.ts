import { window, Uri, Webview, WebviewViewProvider } from "vscode";
import * as vscode from "vscode";
import { getUri } from "../utilities/getUri";
import { getNonce } from "../utilities/getNonce";
import { ShortcutProps } from "../const";

export class SidebarViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "Sidebar";

  constructor(private context: vscode.ExtensionContext, private readonly extensionUri: Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [Uri.joinPath(this.extensionUri, "out")],
    };

    webviewView.webview.html = this._getWebviewContent(
      webviewView.webview,
      this.context.extensionUri
    );
  }

  private _getWebviewContent(webview: Webview, extensionUri: Uri) {
    const webviewUri = getUri(webview, extensionUri, ["out", "Sidebar.js"]);
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
