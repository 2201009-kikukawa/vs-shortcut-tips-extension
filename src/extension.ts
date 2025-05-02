import { ExtensionContext, window } from "vscode";
import { ViewProvider } from "./providers/ViewProvider";
import * as vscode from "vscode";

export function activate(context: ExtensionContext) {
  const myViewProvider = new MyViewProvider(context.extensionUri);
  context.subscriptions.push(vscode.window.registerWebviewViewProvider("myView", myViewProvider));
  /*
  // コマンド登録（package.json で定義した ID）
  let disposable = vscode.commands.registerCommand("popup-button.showPopup", () => {
    // ポップアップを表示
    vscode.window
      .showInformationMessage("テキストやファイルを複製\nctrl + c , ctrl + v", "動きを確認する")
      .then((selection) => {
        if (selection === "動きを確認する") {
          vscode.window.showInformationMessage("ボタンを押したで");
        }
      });
  });

  context.subscriptions.push(disposable);
  */
}
export class MyViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly extensionUri: vscode.Uri) {}

  resolveWebviewView(
    view: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    view.webview.options = {
      enableScripts: true,
    };

    view.webview.html = `
      <html>
      <body>
        <button onclick="handleClick()">Click me!</button>
        <script>
          function handleClick() {
            const vscode = acquireVsCodeApi();
            vscode.postMessage({ command: 'hello' });
          }
        </script>
      </body>
      </html>
    `;
  }
}
