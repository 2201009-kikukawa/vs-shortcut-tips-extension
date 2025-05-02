import { ExtensionContext, window } from "vscode";
import { ViewProvider } from "./providers/ViewProvider";
import * as vscode from "vscode";

export function activate(context: ExtensionContext) {
  // コマンド登録（package.json で定義した ID）
  let disposable = vscode.commands.registerCommand("popup-button.showPopup", () => {
    // ポップアップを表示
    vscode.window.showInformationMessage("テキストやファイルを複製");
    vscode.window.showInformationMessage("ctrl + c , ctrl + v");
  });

  context.subscriptions.push(disposable);
}
