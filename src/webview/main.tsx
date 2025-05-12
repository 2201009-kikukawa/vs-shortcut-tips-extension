import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import * as vscode from "vscode";

const main = () => {
  const [text, setText] = useState<string>("");

  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);

  statusBarItem.text = "ShortCutTips";
  statusBarItem.tooltip = "クリックするとメッセージを表示します";
  statusBarItem.command = "demo-status-bar-item.helloWorld";

  statusBarItem.show();

  return (
    <>
      <VSCodeButton onClick={(e) => setText("ボタンがクリックされました")}>ボタン</VSCodeButton>
      <div>{text}</div>
    </>
  );
};

export default main;

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(React.createElement(main));
