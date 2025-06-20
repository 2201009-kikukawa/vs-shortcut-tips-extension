import React from "react";
import ReactDOM from "react-dom/client";

const data = (window as any).shortcutData;
const Tab = () => {
  return (
    <>
      <div>
        <h1>キーボードショートカット詳細</h1>
        <hr></hr>
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
          <img src={data.gif} alt={data.gif} style={{ width: "550px" }} />
        </div>
      </div>
    </>
  );
};

export default Tab;

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(React.createElement(Tab));
