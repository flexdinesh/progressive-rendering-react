import React from "react";
import classnames from "classnames";
import styles from "./TextSection.module.css";

function TextSection(props) {
  const { text, store, storeKey } = props;
  const [isHydated, setHydrated] = React.useState(false);

  // 'cos text prop is not updated in suspense when the app re-renders with new store
  // probably a bug with concurrent mode or i'm doing closure wrong
  let textToRender = store && store[storeKey];

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  if (!textToRender) return null;

  return (
    <div
      className={classnames([
        styles.wrapper,
        { [styles.isHydrated]: isHydated }
      ])}
    >
      {textToRender}
    </div>
  );
}

export default TextSection;
