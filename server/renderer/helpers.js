const ReactDOMServer = require("react-dom/server");

const renderProgressiveComponentToScript = (serverrenderid, Component) => {
  const compMarkup = ReactDOMServer.renderToStaticMarkup(Component);
  const hydrateFnName = "hydrate" + serverrenderid;
  const stitchingScript = `<script>if(!window.GLOBAL_STORE.hydrated) { document.querySelector("#${serverrenderid}").outerHTML = '${compMarkup}';}
  console.log('${serverrenderid} stiching script received')
  if (window["${hydrateFnName}"]) {
    window["${hydrateFnName}"]();
    console.log('${serverrenderid} hydrated by chunked script')
  } else {
    window["${hydrateFnName}"] = () => {};
  }
  </script>`;
  // if need to render when js turned off
  // stitchingScript = stitchingScript + `<noscript>${compMarkup}</noscript>`;
  return stitchingScript;
};

const createStoreAssignerScript = (storeName = "GLOBAL_STORE", key, value) => {
  return `<script>window.${storeName}.${key} = ${JSON.stringify(
    value
  )};</script>`;
};

module.exports = {
  renderProgressiveComponentToScript,
  createStoreAssignerScript
};
