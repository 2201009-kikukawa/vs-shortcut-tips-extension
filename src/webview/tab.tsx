import React from "react";
import ReactDOM from "react-dom/client";

const Tab = () => {
  return (
    <>
      <h3>タブ</h3>
    </>
  );
};

export default Tab;

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(React.createElement(Tab));
