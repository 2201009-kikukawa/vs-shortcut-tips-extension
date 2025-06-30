import { SHORT_CUT } from "../const";
import * as os from "os";

export function getRandomShortcut() {
  const randomShortcut = SHORT_CUT[Math.floor(Math.random() * SHORT_CUT.length)];
  const platform = os.platform();
  // TODO : mac, windows 以外の場合の対応を行う
  const platformShortcut = platform === "darwin" ? randomShortcut.darwin : randomShortcut.win32;
  const message = `${randomShortcut.name}: ${platformShortcut?.command}`;
  const shortcut = {
    name: randomShortcut.name,
    description: randomShortcut.description,
    command: platformShortcut?.command,
    gif: platformShortcut?.gif,
  };
  return { message, shortcut };
}
