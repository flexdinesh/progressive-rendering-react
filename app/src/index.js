import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";

// window.GLOBAL_STORE = {
//   sectionOneText: "The whole world is my oyester",
//   sectionTwoText: "And I will render it progressively from my server"
// };

ReactDOM.hydrate(
  <App store={window.GLOBAL_STORE} />,
  document.getElementById("root")
);

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
