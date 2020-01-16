const ReactDOMServer = require("react-dom/server");

const renderProgressiveComponentToScript = (serverRenderId, Component) => {
  const compMarkup = ReactDOMServer.renderToStaticMarkup(Component);
  const stitchingScript = `<script>document.querySelector("#${serverRenderId}").outerHTML = '${compMarkup}';</script>`;
  return stitchingScript;
};

const createStoreScript = (store, storeName = "GLOBAL_STORE") => {
  return `<script>window.${storeName} = ${JSON.stringify(store)};</script>`;
};

module.exports = { renderProgressiveComponentToScript, createStoreScript };
