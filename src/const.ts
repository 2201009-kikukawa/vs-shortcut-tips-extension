// 個々のOSごとの情報
type ShortcutPlatformInfo = {
  command: string;
  gif: string;
};

// ショートカット全体の型
type Shortcut = {
  name: string;
  description: string;
  win32: ShortcutPlatformInfo;
  darwin: ShortcutPlatformInfo;
};

// 配列全体
export const SHORT_CUT: Shortcut[] = [
  {
    name: "コマンドパレットの表示",
    description: "全コマンドの検索・実行",
    win32: {
      command: "Ctrl+Shift+P",
      gif: "https://storage.googleapis.com/sample-win.gif",
    },
    darwin: {
      command: "Cmd+Shift+P",
      gif: "https://storage.googleapis.com/sample-mac.gif",
    },
  },
];
