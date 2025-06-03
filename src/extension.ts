import { ExtensionContext, window } from "vscode";
import { ViewProvider } from "./providers/ViewProvider";

export function activate(context: ExtensionContext) {
  const provider = new ViewProvider(context, context.extensionUri);
  provider.setupStatusBar(context, context.extensionUri);
}
