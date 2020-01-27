import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";

window.GLOBAL_STORE = window.GLOBAL_STORE || {};
window.GLOBAL_STORE.renderfrom = "CLIENT";
window.GLOBAL_STORE.renderMode = window.renderMode;
window.GLOBAL_STORE.clientDevOnly = window.clientDevOnly || false;
window.GLOBAL_STORE.hydrated = false;

// when devving in client-only mode without server
// window.clientDevOnly = window.clientDevOnly || false;
// window.clientDevOnly = window.clientDevOnly || false;
// window.GLOBAL_STORE = {
//   sectionOneText: "The whole world is my oyester",
//   sectionTwoText: "And I will render it progressively from my server",
//   renderfrom: "CLIENT"
// };

const rootElement = document.getElementById("root");

if (window.clientDevOnly || window.GLOBAL_STORE.renderMode === "CSR") {
  console.log("CSR only");
  ReactDOM.render(<App store={window.GLOBAL_STORE} />, rootElement);
} else {
  console.log("SSR/PSSR hydrating");
  // this executes only on the client
  ReactDOM.createRoot(rootElement, {
    hydrate: true
  }).render(<App store={window.GLOBAL_STORE} />);
}

// Hot Module Replacement - haven't figured out yet
if (module.hot) {
  module.hot.accept();
}
