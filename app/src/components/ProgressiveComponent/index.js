import React from "react";

function ProgressiveComponent({ serverRenderId = "", Tag = "div", children }) {
  return <Tag id={serverRenderId}>{children}</Tag>;
}

export default ProgressiveComponent;
