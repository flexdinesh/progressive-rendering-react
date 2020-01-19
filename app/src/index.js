import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";

// when devving in client-only mode without server
// window.GLOBAL_STORE = {
//   sectionOneText: "The whole world is my oyester",
//   sectionTwoText: "And I will render it progressively from my server",
//   RENDER_FROM: "CLIENT"
// };

window.GLOBAL_STORE = window.GLOBAL_STORE || {};
window.GLOBAL_STORE.RENDER_FROM = "CLIENT";

const rootElement = document.getElementById("root");

// this executes only on the client
ReactDOM.createRoot(rootElement, {
  hydrate: true
}).render(<App store={window.GLOBAL_STORE} />);

// Hot Module Replacement - haven't figured out yet
if (module.hot) {
  module.hot.accept();
}
