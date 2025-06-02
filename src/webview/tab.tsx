import React from "react";
import ReactDOM from "react-dom/client";

const Tab = () => {
  return (
    <>
      <img
        src="https://storage.googleapis.com/short-cut-tips-bucket/short-cut-sample.gif"
        alt="GCS画像"
      />
    </>
  );
};

export default Tab;

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(React.createElement(Tab));
