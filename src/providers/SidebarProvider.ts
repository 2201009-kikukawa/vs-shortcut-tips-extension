import { window, Uri, Webview, WebviewViewProvider } from "vscode";
import * as vscode from "vscode";
import { getUri } from "../utilities/getUri";
import { getNonce } from "../utilities/getNonce";
import { ShortcutProps } from "../const";

export class SidebarViewProvider implements vscode.WebviewViewProvider {
  constructor(private context: vscode.ExtensionContext) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = {
      enableScripts: true,
    };

    webviewView.webview.html = this.getHtml();
  }

  private getHtml() {
    return /*html*/ `
      <!DOCTYPE html>
      <html lang="ja">
      <body>
        <button id="myButton">Click me!</button>
        <script>
          const vscode = acquireVsCodeApi();
          document.getElementById("myButton").addEventListener("click", () => {
            vscode.postMessage({ command: "buttonClick" });
          });
        </script>
      </body>
      </html>
    `;
  }
}
