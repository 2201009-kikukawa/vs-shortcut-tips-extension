import { ExtensionContext, window } from "vscode";
import { ViewProvider } from "./providers/ViewProvider";
import * as vscode from "vscode";

export function activate(context: ExtensionContext) {
  const provider = new ViewProvider(context.extensionUri);

  const sampleViewDisposable = window.registerWebviewViewProvider(ViewProvider.viewType, provider);

  const disposable = vscode.commands.registerCommand("myExtension.showGifPopup", () => {
    const panel = vscode.window.createWebviewPanel(
      "gifPopup",
      "GIFポップアップ",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
      }
    );

    // ここにGIFのURLを入れる（ローカル or ネット上のURL）
    const gifUrl = "https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif";

    panel.webview.html = `
      <!DOCTYPE html>
      <html lang="ja">
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #1e1e1e;
          }
          img {
            max-width: 100%;
            max-height: 80vh;
            border-radius: 12px;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
          }
        </style>
      </head>
      <body>
        <img src="${gifUrl}" alt="GIF" />
      </body>
      </html>
    `;
  });

  context.subscriptions.push(disposable);
  context.subscriptions.push(sampleViewDisposable);
}
