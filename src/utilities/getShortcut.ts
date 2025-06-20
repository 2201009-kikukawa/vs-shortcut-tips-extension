import { registerCommand, executeCommand } from "../utilities/getRandom";
import { SHORT_CUT } from "../const";
import * as os from "os";

export function getRandomShortcut() {
  registerCommand("getRandomShortcut", SHORT_CUT);
  const shortcut = executeCommand("getRandomShortcut");
  const platform = os.platform();
  let message;
  let ShortcutProp;
  if (platform === "darwin") {
    message = `${shortcut.name}: ${shortcut.darwin?.command}`;
    ShortcutProp = {
      name: shortcut.name,
      description: shortcut.description,
      command: shortcut.darwin?.command,
      gif: shortcut.darwin?.gif,
    };
  } else {
    message = `${shortcut.name}: ${shortcut.win32?.command}`;
    ShortcutProp = {
      name: shortcut.name,
      description: shortcut.description,
      command: shortcut.win32?.command,
      gif: shortcut.win32?.gif,
    };
  }
  return { message, ShortcutProp };
}
