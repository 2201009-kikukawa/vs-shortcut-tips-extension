import React from "react";
import ReactDOM from "react-dom/client";

const Tab = () => {
  const rootEl = document.getElementById("root");
  const gifSrc = rootEl?.getAttribute("data-gif");

  return (
    <div>
      {gifSrc ? (
        <img src={gifSrc} alt="GIF" style={{ width: "300px" }} />
      ) : (
        <p>GIFが見つかりません</p>
      )}
    </div>
  );
};

export default Tab;

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<Tab />);
