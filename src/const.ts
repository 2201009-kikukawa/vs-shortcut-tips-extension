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

export type ShortcutProps = {
  name: string;
  description: string;
  command: string;
  gif: string;
};

// 配列全体
export const SHORT_CUT: Shortcut[] = [
  {
    name: "コマンドパレットの表示",
    description: "全コマンドの検索・実行",
    win32: {
      command: "Ctrl+Shift+P",
      gif: "https://storage.googleapis.com/short-cut-tips-bucket/row-copy.gif",
    },
    darwin: {
      command: "Cmd+Shift+P",
      gif: "https://storage.googleapis.com/short-cut-tips-bucket/row-copy.gif",
    },
  },
];
