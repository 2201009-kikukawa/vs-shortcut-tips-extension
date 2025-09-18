import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { SHORT_CUT } from "../const";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";

declare const acquireVsCodeApi: any;
const vscode = acquireVsCodeApi();

const Tab = () => {
  const [os, setOs] = useState<"win32" | "darwin">("win32");

  // マウント時に OS を判定
  useEffect(() => {
    const platform = navigator.platform.toLowerCase();

    if (platform.includes("mac")) {
      setOs("darwin");
    } else if (platform.includes("win")) {
      setOs("win32");
    }
  }, []);

  return (
    <>
      {SHORT_CUT.map((shortcut, index) => {
        const command = os === "win32" ? shortcut.win32.command : shortcut.darwin.command;

        return (
          <div key={index} className="card">
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
      })}
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<Tab />);
