import React from "react";
import ReactDOM from "react-dom/client";

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
          <p>行の入れ替え</p>
          <h3>概要</h3>
          <p>選択中の行またはカーソルのある行を上下に移動させる機能です。</p>
          <p>行のコピーではなく、実際に行を入れ替えるため、コードの並び替えや整理に便利です。</p>
          <p>複数行選択中でもそのまま一括で移動できます。</p>
          <h3>コマンド</h3>
          <p>Option + ↑ or Option + ↓</p>
        </div>
        <img
          src="https://storage.googleapis.com/short-cut-tips-bucket/short-cut-sample.gif"
          alt="GCS画像"
          style={{ width: "550px" }}
        />
      </div>
    </>
  );
};

export default Tab;

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(React.createElement(Tab));
