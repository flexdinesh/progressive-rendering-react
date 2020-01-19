import React from "react";

const RENDER_FROM_TYPES = ["SERVER_PLACEHOLDER", "SERVER", "CLIENT"];

const Component = props => {
  const { serverRenderId = "", Tag = "div", RENDER_FROM, children } = props;
  const childrenWithNewProps = React.Children.map(children, child =>
    React.cloneElement(child, { ...props, RENDER_FROM })
  );

  return <Tag id={serverRenderId}>{childrenWithNewProps}</Tag>;
};

// need to pass id, React.lazy doesn't take id directly
// so we wrap it into a util
const getProgressiveClientComponent = serverRenderId => {
  return React.lazy(
    () =>
      new Promise(resolve => {
        const hydrateFnName = "hydrate" + serverRenderId;
        // if server sent the chunk before bundle is loaded on the client
        // this method will be available in global namespace
        // so we know the content is already in DOM and we just resolve the lazy promise
        if (window[hydrateFnName]) {
          console.log(`${serverRenderId} hydrated by suspense`);
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
      })
  );
};

const ProgressiveServerComponent = Component;

const getProgressiveComponent = ({ RENDER_FROM, serverRenderId }) => {
  if (RENDER_FROM === "CLIENT")
    return getProgressiveClientComponent(serverRenderId);

  return ProgressiveServerComponent;
};
export { getProgressiveComponent };
