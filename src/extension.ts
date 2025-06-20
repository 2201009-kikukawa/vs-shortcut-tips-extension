import * as vscode from "vscode";
import { ViewProvider } from "./providers/TabProvider";

export function activate(context: vscode.ExtensionContext) {
  const provider = new ViewProvider(context, context.extensionUri);
  provider.setupStatusBar(context, context.extensionUri);
}
