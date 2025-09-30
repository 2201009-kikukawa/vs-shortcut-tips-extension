import React, { useState, useEffect, useMemo } from "react";
import ReactDOM from "react-dom/client";
import { SHORT_CUT } from "../const";
import { VSCodeButton, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";

declare const acquireVsCodeApi: any;
const vscode = acquireVsCodeApi();

const Tab = () => {
  const [os, setOs] = useState<"win32" | "darwin">("win32");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // マウント時に OS を判定
  useEffect(() => {
    const platform = navigator.platform.toLowerCase();

    if (platform.includes("mac")) {
      setOs("darwin");
    } else if (platform.includes("win")) {
      setOs("win32");
    }
  }, []);

  const handleCommandClick = (shortcut: any) => {
    vscode.postMessage({ command: "openShortcutTab", value: shortcut });
  };

  // 検索クエリに基づいてショートカットをフィルタリング
  const filteredShortcuts = useMemo(() => {
    if (!searchQuery.trim()) {
      return SHORT_CUT;
    }

    const query = searchQuery.toLowerCase();
    return SHORT_CUT.filter((shortcut) => {
      const name = shortcut.name.toLowerCase();
      const description = shortcut.description.toLowerCase();
      const win32Command = shortcut.win32.command.toLowerCase();
      const darwinCommand = shortcut.darwin.command.toLowerCase();

      return (
        name.includes(query) ||
        description.includes(query) ||
        win32Command.includes(query) ||
        darwinCommand.includes(query)
      );
    });
  }, [searchQuery]);

  const handleSearchChange = (event: any) => {
    setSearchQuery(event.target.value);
  };

  return (
    <>
      <div className="search-container">
        <VSCodeTextField
          placeholder="ショートカットを検索..."
          value={searchQuery}
          onInput={handleSearchChange}
          className="search-input"
        />
      </div>
      
      {filteredShortcuts.length === 0 ? (
        <div className="no-results">
          <p>検索結果が見つかりませんでした</p>
        </div>
      ) : (
        filteredShortcuts.map((shortcut, index) => {
          const command = os === "win32" ? shortcut.win32.command : shortcut.darwin.command;

          return (
            <div key={index} className="card" onClick={() => handleCommandClick(shortcut)}>
              <h3>{shortcut.name}</h3>
              <p>{shortcut.description}</p>
              <p>
                {command.split("+").map((key, i, array) => (
                  <span key={i}>
                    <kbd className="kbd-key">{key.trim()}</kbd>
                    {i < array.length - 1 && <span> + </span>}
                  </span>
                ))}
              </p>
            </div>
          );
        })
      )}
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<Tab />);
