import * as vscode from "vscode";

export class StatusBarProvider {
  private statusBarItem: vscode.StatusBarItem;

  constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 10);
  }

  public setupStatusBar(context: vscode.ExtensionContext) {
    this.statusBarItem.text = "ShortCutTips";
    this.statusBarItem.tooltip = "クリックするとメッセージを表示します";
    this.statusBarItem.command = "popup-button.showPopup";
    this.statusBarItem.show();

    context.subscriptions.push(this.statusBarItem);
  }

  public registerCommand(context: vscode.ExtensionContext, callback: () => void) {
    const disposable = vscode.commands.registerCommand("popup-button.showPopup", callback);
    context.subscriptions.push(disposable);
  }
}
