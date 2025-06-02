import { Uri } from "vscode";
import * as vscode from "vscode";
import { TabProvider } from "../providers/TabProvider";
import { StatusBarProvider } from "../providers/StatusBarProvider";

export class EventListener {
  private statusBarItem: StatusBarProvider;
  private tabProvider: TabProvider;

  constructor(private extensionUri: Uri) {
    this.statusBarItem = new StatusBarProvider();
    this.tabProvider = new TabProvider(extensionUri);
  }
  public setStatusBerListener(context: vscode.ExtensionContext) {
    this.statusBarItem.setupStatusBar(context);
    vscode.ViewColumn.One, { enableScripts: true };

    this.statusBarItem.registerCommand(context, () => {
      vscode.window
        .showInformationMessage("テキストやファイルを複製\nctrl + c , ctrl + v", "動きを確認する")
        .then((selection) => {
          if (selection === "動きを確認する") {
            this.tabProvider.openTabView();
          }
        });
    });
  }
}
