import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { ShortcutProps } from "../const";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";

const vscode = acquireVsCodeApi();

const Tab = () => {
  const [data, setData] = useState<ShortcutProps | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const buttonRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // VS Code 拡張へ「準備完了」を送信
    vscode.postMessage({ type: "ready" });

    const listener = (event: MessageEvent) => {
      if (event.data?.type === "shortcutData") {
        setData(event.data.payload);
      }
    };

    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, []);

  if (!data) return <>p読み込み中...</>;

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  return (
    <>
      <div className="box">
        <div className="field">
          <div>
            <h3>{data.name}</h3>
            <p>{data.description}</p>
            <p>
              {data.command.split("+").map((key, index, array) => (
                <span key={index}>
                  <kbd className="kbd-key">{key.trim()}</kbd>
                  {index < array.length - 1 && <span> + </span>}
                </span>
              ))}
            </p>
          </div>
          <div>
            <VSCodeButton className="vscode-button" onClick={toggleFavorite} appearance="secondary">
              {isFavorite ? "★ 保存済み" : "☆ ショートカットを保存"}
            </VSCodeButton>
          </div>
        </div>
        <div className="gif-field">
          <img src={data.gif} alt="gif preview" className="gif-preview" />
        </div>
      </div>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<Tab />);
