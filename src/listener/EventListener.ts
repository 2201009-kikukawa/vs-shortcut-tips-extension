import { Uri } from "vscode";
import * as vscode from "vscode";
import { TabProvider } from "../providers/TabProvider";

let statusBarItem: vscode.StatusBarItem;
let context: Uri;

export class EventListener {
  constructor(private extensionUri: Uri) {
    context = extensionUri;
  }
  public setStatusBerView(context: vscode.ExtensionContext) {
    const tabProvider = new TabProvider(this.extensionUri, context);
    vscode.ViewColumn.One, { enableScripts: true };
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 10);
    statusBarItem.text = "ShortCutTips";
    statusBarItem.tooltip = "クリックするとメッセージを表示します";
    statusBarItem.command = "popup-button.showPopup";
    statusBarItem.show();

    const disposable = vscode.commands.registerCommand("popup-button.showPopup", () => {
      vscode.window
        .showInformationMessage("テキストやファイルを複製\nctrl + c , ctrl + v", "動きを確認する")
        .then((selection) => {
          if (selection === "動きを確認する") {
            tabProvider.openTabView();
          }
        });
    });

    context.subscriptions.push(disposable);
    context.subscriptions.push(statusBarItem);
  }
}
