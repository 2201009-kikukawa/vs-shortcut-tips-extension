import React, { useState, useEffect, useMemo } from "react";
import ReactDOM from "react-dom/client";
import { SHORT_CUT } from "../const";
import { VSCodeButton, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";

declare const acquireVsCodeApi: any;
const vscode = acquireVsCodeApi();

const Tab = () => {
  const [os, setOs] = useState<"win32" | "darwin">("win32");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [history, setHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"shortcuts" | "history">("shortcuts");

  useEffect(() => {
    const platform = navigator.platform.toLowerCase();
    setOs(platform.includes("mac") ? "darwin" : "win32");

    // 履歴をリクエスト
    vscode.postMessage({ command: "requestHistory" });

    // メッセージ受信イベント
    const handleMessage = (event: any) => {
      const { command, value } = event.data;
      if (command === "loadHistory") {
        setHistory(value);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleCommandClick = (shortcut: any) => {
    vscode.postMessage({ command: "openShortcutTab", value: shortcut });
  };

  const handleClearHistory = () => {
    vscode.postMessage({ command: "clearHistory" });
    setHistory([]);
  };

  const filteredShortcuts = useMemo(() => {
    if (!searchQuery.trim()) return SHORT_CUT;
    const q = searchQuery.toLowerCase();
    return SHORT_CUT.filter((s) =>
      [s.name, s.description, s.win32.command, s.darwin.command].some((t) =>
        t.toLowerCase().includes(q)
      )
    );
  }, [searchQuery]);

  return (
    <div>
      <div className="tab-header">
        <button
          className={`tab-header-btn ${activeTab === "shortcuts" ? "active" : ""}`}
          onClick={() => setActiveTab("shortcuts")}>
          一覧
        </button>

        <button
          className={`tab-header-btn ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}>
          履歴
        </button>
      </div>

      {activeTab === "shortcuts" && (
        <div className="tab-content">
          <div className="search-container">
            <VSCodeTextField
              placeholder="ショートカットを検索..."
              value={searchQuery}
              onInput={(e: any) => setSearchQuery(e.target.value)}
            />
          </div>

          {filteredShortcuts.map((s, i) => (
            <div key={i} className="card" onClick={() => handleCommandClick(s)}>
              <h3>{s.name}</h3>
              <p>{s.description}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "history" && (
        <div className="tab-content">
          <VSCodeButton className="clear-history" onClick={handleClearHistory}>
            履歴をクリア
          </VSCodeButton>

          {history.length === 0 ? (
            <p>履歴はありません</p>
          ) : (
            history.map((s, i) => (
              <div key={i} className="card" onClick={() => handleCommandClick(s)}>
                <h3>{s.name}</h3>
                <p>{s.description}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<Tab />);
