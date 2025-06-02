import { ExtensionContext } from "vscode";
import { EventListener } from "./listener/EventListener";

export function activate(context: ExtensionContext) {
  const eventListener = new EventListener(context.extensionUri);
  eventListener.setStatusBerListener(context);
}
