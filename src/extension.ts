import { ExtensionContext } from "vscode";
import { ViewProvider } from "./providers/TabProvider";
import { getRandomShortcut } from "./utilities/getShortcut";
import * as vscode from "vscode";

export function activate(context: ExtensionContext) {
  const provider = new ViewProvider(context, context.extensionUri);

  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBarItem.text = "ShortCutTips";
  statusBarItem.tooltip = "クリックするとメッセージを表示します";
  statusBarItem.command = "popup-button.showPopup";
  statusBarItem.show();

  context.subscriptions.push(statusBarItem);

  const disposable = vscode.commands.registerCommand("popup-button.showPopup", () => {
    const { message, shortcut } = getRandomShortcut();
    vscode.window.showInformationMessage(message, "動きを確認する").then((selection) => {
      if (selection === "動きを確認する") {
        provider.openTabView(shortcut);
      }
    });
  });

  context.subscriptions.push(disposable);
}
