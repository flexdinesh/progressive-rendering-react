import React from "react";

const renderfrom_TYPES = ["SERVER_PLACEHOLDER", "SERVER", "CLIENT"];

const Component = props => {
  const { serverrenderid = "", Tag = "div", renderfrom, children } = props;
  const childrenWithNewProps = React.Children.map(children, child =>
    React.cloneElement(child, { ...props, renderfrom })
  );

  return <Tag id={serverrenderid}>{childrenWithNewProps}</Tag>;
};

// need to pass id, React.lazy doesn't take id directly
// so we wrap it into a util
const getProgressiveClientComponent = serverrenderid => {
  return React.lazy(() => {
    if (window && window.clientDevOnly) {
      return new Promise(resolve => {
        resolve({
          default: Component
        });
      });
    } else {
      return new Promise(resolve => {
        const hydrateFnName = "hydrate" + serverrenderid;
        // if server sent the chunk before bundle is loaded on the client
        // this method will be available in global namespace
        // so we know the content is already in DOM and we just resolve the lazy promise
        if (window[hydrateFnName]) {
          console.log(`${serverrenderid} hydrated by suspense`);
          resolve({
            default: Component
          });
        } else {
          // if this method is not in global namespace
          // then bundle loaded before server sent the chunk
          // so we let the server chunk invoke this method to hydrate the component
          window[hydrateFnName] = () => {
            resolve({
              default: Component
            });
          };
        }
      });
    }
  });
};

const ProgressiveServerComponent = Component;

const getProgressiveComponent = ({ renderfrom, serverrenderid }) => {
  if (renderfrom === "CLIENT")
    return getProgressiveClientComponent(serverrenderid);

  return ProgressiveServerComponent;
};
export { getProgressiveComponent };
