import { ExtensionContext, WebviewView } from "vscode";
import { ViewProvider } from "../providers/TabProvider";
import { ShortcutProps } from "../const";

export class ShortcutListener {
  constructor(private readonly _context: ExtensionContext) {}

  public setWebviewMessageListener(webviewView: WebviewView) {
    webviewView.webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case "openShortcutTab":
          const shortcut: ShortcutProps = message.value;
          new ViewProvider(this._context, this._context.extensionUri).openTabView(shortcut);
          break;

        default:
          break;
      }
    });
  }
}
