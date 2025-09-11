import { ExtensionContext } from "vscode";
import { ViewProvider } from "./providers/TabProvider";
import { getRandomShortcut } from "./utilities/getShortcut";
import * as vscode from "vscode";

let intervalTimer: NodeJS.Timeout | undefined;

export function activate(context: ExtensionContext) {
  const TabProvider = new ViewProvider(context, context.extensionUri);

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
        TabProvider.openTabView(shortcut);
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
        TabProvider.openTabView(shortcut);
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
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("sampleView", new SampleViewProvider(context))
  );
}

export function deactivate() {
  if (intervalTimer) {
    clearInterval(intervalTimer);
  }
}

class SampleViewProvider implements vscode.WebviewViewProvider {
  constructor(private context: vscode.ExtensionContext) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = {
      enableScripts: true,
    };

    webviewView.webview.html = this.getHtml();

    // Webview → Extension へのメッセージ受信
    webviewView.webview.onDidReceiveMessage((message) => {
      if (message.command === "buttonClick") {
        vscode.window.showInformationMessage("ボタンが押されました！");
      }
    });
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
