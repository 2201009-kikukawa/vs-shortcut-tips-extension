// 個々のOSごとの情報
type ShortcutPlatformInfo = {
  command: string;
  gif: string;
};

// ショートカット全体の型
export type Shortcut = {
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
    name: "コマンドパレットを開く",
    description:
      "VS Code で実行可能なすべてのコマンドを検索・実行できるコマンドパレットを開きます。拡張機能や設定の操作もここから行えます。",
    win32: {
      command: "Ctrl+Shift+P",
      gif: "https://storage.googleapis.com/short-cut-tips-bucket/short-cut-command-palette-win.gif",
    },
    darwin: {
      command: "Cmd+Shift+P",
      gif: "",
    },
  },
  {
    name: "クイックオープンを開く",
    description:
      "ファイル名の一部を入力するだけで、現在のワークスペース内のファイルをすばやく検索・開くことができます。",
    win32: {
      command: "Ctrl+P",
      gif: "https://storage.googleapis.com/short-cut-tips-bucket/short-cut-quick-open-win.gif",
    },
    darwin: {
      command: "Cmd+P",
      gif: "",
    },
  },
  {
    name: "新しいウィンドウを開く",
    description:
      "新しい VS Code ウィンドウを起動します。別のプロジェクトを同時に開きたいときに便利です。",
    win32: {
      command: "Ctrl+Shift+N",
      gif: "https://storage.googleapis.com/short-cut-tips-bucket/short-cut-new-window-win.gif",
    },
    darwin: {
      command: "Cmd+Shift+N",
      gif: "",
    },
  },
  {
    name: "ウィンドウを閉じる",
    description:
      "現在開いている VS Code のウィンドウを閉じます。複数ウィンドウを開いている場合は、そのうちの1つだけが閉じられます。",
    win32: {
      command: "Ctrl+Shift+W",
      gif: "https://storage.googleapis.com/short-cut-tips-bucket/short-cut-close-window-win.gif",
    },
    darwin: {
      command: "Cmd+Shift+W",
      gif: "",
    },
  },
  {
    name: "ユーザー設定を開く",
    description:
      "VS Code の設定画面を開きます。エディタのテーマ、フォント、拡張機能の挙動などを変更できます。",
    win32: {
      command: "Ctrl+,",
      gif: "https://storage.googleapis.com/short-cut-tips-bucket/short-cut-open-settings-win.gif",
    },
    darwin: {
      command: "Cmd+,",
      gif: "",
    },
  },
  {
    name: "キーボードショートカットを開く",
    description:
      "VS Code のすべてのキーボードショートカットを一覧表示します。各ショートカットの検索やカスタマイズ、JSON での編集も可能です。",
    win32: {
      command: "Ctrl+K + Ctrl+S",
      gif: "https://storage.googleapis.com/short-cut-tips-bucket/short-cut-keyboard-shortcuts-win.gif",
    },
    darwin: {
      command: "Cmd+K + Cmd+S",
      gif: "",
    },
  },
  {
    name: "行を切り取り",
    description:
      "テキストを選択していない状態で使うと、カーソルがある行全体を切り取ります。選択中の場合は、選択範囲を切り取ります。",
    win32: {
      command: "Ctrl+X",
      gif: "https://storage.googleapis.com/short-cut-tips-bucket/row-copy.gif",
    },
    darwin: {
      command: "Cmd+X",
      gif: "",
    },
  },
];
