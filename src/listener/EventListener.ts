import * as vscode from "vscode";
import { ViewProvider } from "../providers/ViewProvider";

export class Listener {
  private viewProvider: ViewProvider;

  constructor(private context: vscode.ExtensionContext, private extensionUri: vscode.Uri) {
    this.viewProvider = new ViewProvider(this.context, this.extensionUri);
  }

  public setStatusBar(context: vscode.ExtensionContext) {
    this.viewProvider.registerCommand(context, () => {
      this.viewProvider.openTabView();
    });
  }
}
