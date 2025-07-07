import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { ShortcutProps } from "../const";

const vscode = acquireVsCodeApi();

const Tab = () => {
  const [data, setData] = useState<ShortcutProps | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
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
          <button className="favorite-button" onClick={() => setIsFavorite((prev) => !prev)}>
            <span className={`favorite-star ${isFavorite ? "is-favorite" : ""}`}>
              {isFavorite ? "★" : "☆"}
            </span>
            <span className="favorite-text">ショートカットを保存</span>
          </button>
        </div>
      </div>
      <div className="gif-field">
        <img src={data.gif} alt="gif preview" className="gif-preview" />
      </div>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<Tab />);
