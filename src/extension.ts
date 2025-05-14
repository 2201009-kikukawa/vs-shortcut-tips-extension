import { ExtensionContext, window } from "vscode";
import { ViewProvider } from "./providers/ViewProvider";
import * as vscode from "vscode";

export function activate(context: ExtensionContext) {
  const provider = new ViewProvider(context.extensionUri);

  const sampleViewDisposable = window.registerWebviewViewProvider(ViewProvider.viewType, provider);

  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 10);
  statusBarItem.text = "ShortCutTips";
  statusBarItem.tooltip = "クリックするとメッセージを表示します";
  statusBarItem.command = "popup-button.showPopup";
  statusBarItem.show();

  const disposable = vscode.commands.registerCommand("popup-button.showPopup", () => {
    vscode.window
      .showInformationMessage("テキストやファイルを複製\nctrl + c , ctrl + v", "動きを確認する")
      .then((selection) => {
        if (selection === "動きを確認する") {
          vscode.window.showInformationMessage("ボタンを押したで");
        }
      });
  });

  context.subscriptions.push(statusBarItem);
  context.subscriptions.push(disposable);

  context.subscriptions.push(sampleViewDisposable);
}
