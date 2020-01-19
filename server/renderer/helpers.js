const ReactDOMServer = require("react-dom/server");

const renderProgressiveComponentToScript = (serverRenderId, Component) => {
  const compMarkup = ReactDOMServer.renderToStaticMarkup(Component);
  const hydrateFnName = "hydrate" + serverRenderId;
  const stitchingScript = `<script>document.querySelector("#${serverRenderId}").outerHTML = '${compMarkup}';
  if (window["${hydrateFnName}"]) {
    window["${hydrateFnName}"]();
    console.log('${serverRenderId} hydrated by chunked script')
  } else {
    window["${hydrateFnName}"] = () => {};
  }
  </script>`;
  // if need to render when js turned off
  // stitchingScript = stitchingScript + `<noscript>${compMarkup}</noscript>`;
  return stitchingScript;
};

const createStoreScript = (storeName = "GLOBAL_STORE") => {
  return `<script>window.${storeName} = ${JSON.stringify({})};</script>`;
};

const createStoreAssignerScript = (storeName = "GLOBAL_STORE", key, value) => {
  return `<script>if(window.${storeName}) window.${storeName}.${key} = ${JSON.stringify(
    value
  )};</script>`;
};

module.exports = {
  renderProgressiveComponentToScript,
  createStoreScript,
  createStoreAssignerScript
};
