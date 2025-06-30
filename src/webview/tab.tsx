import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { ShortcutProps } from "../const";

const vscode = acquireVsCodeApi();

const Tab = () => {
  const [data, setData] = useState<ShortcutProps | null>(null);

  useEffect(() => {
    //VS Code 拡張へ「準備完了」を送信
    vscode.postMessage({ type: "ready" });

    const listener = (event: MessageEvent) => {
      if (event.data?.type === "shortcutData") {
        setData(event.data.payload);
      }
    };

    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, []);

  if (!data) return <p>読み込み中...</p>;

  return (
    <>
      <div>
        <h1>キーボードショートカット詳細</h1>
        <hr />
      </div>
      <div className="field">
        <div>
          <h3>ショートカット名</h3>
          <p>{data.name}</p>
          <h3>概要</h3>
          <p>{data.description}</p>
          <h3>コマンド</h3>
          <p>{data.command}</p>
        </div>
        <div>
          <img src={data.gif} alt="gif preview" style={{ width: "550px" }} />
        </div>
      </div>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<Tab />);
