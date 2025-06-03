import { Webview, window, Uri } from "vscode";
import * as vscode from "vscode";
import { getNonce } from "../utilities/getNonce";
import { getUri } from "../utilities/getUri";

export class EventListener {
  constructor(private extensionUri: Uri) {}

  public setTabView() {
    const panel = window.createWebviewPanel(
      "shortcut-tips-WebviewPanel",
      "shortcut-tips",
      vscode.ViewColumn.One,
      { enableScripts: true }
    );

    panel.webview.html = getWebviewTabHtml(panel.webview, this.extensionUri);
  }
}

function getWebviewTabHtml(webview: Webview, extensionUri: Uri) {
  const webviewUri = getUri(webview, extensionUri, ["out", "webviewTab.js"]);
  const stylesUri = getUri(webview, extensionUri, ["out", "styles.css"]);
  const gifUri = getUri(webview, extensionUri, ["media", "shortcut-tips.gif"]);
  const nonce = getNonce();

  return /*html*/ `
    <!DOCTYPE html>
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
        <link rel="stylesheet" href="${stylesUri}" />
        <title>Sample</title>
      </head>
      <body>
        <div id="root" data-gif="${gifUri}"></div>
        <script type="module" nonce="${nonce}" src="${webviewUri}"></script>
      </body>
    </html>
  `;
}
