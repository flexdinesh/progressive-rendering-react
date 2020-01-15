import React from "react";

function HelloWorld({ text }) {
  // const scriptTag = `alert("Boom!");`;
  return (
    <React.Fragment>
      <div id="boom">{text && <span>Hello World, {text}!</span>}</div>
      {/* <script dangerouslySetInnerHTML={{ __html: scriptTag }} /> */}
    </React.Fragment>
  );
}

export default HelloWorld;
