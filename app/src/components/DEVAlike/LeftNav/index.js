import React from "react";
import classnames from "classnames";
import styles from "./LeftNav.module.css";

function LeftNav({ store, serverrenderid }) {
  let showLoader = false;

  if (store.hydrated) {
    showLoader = false;
  } else if (store.renderMode === "SSR") {
    showLoader = true;
  } else if (store.renderMode === "PSSR") {
    if (store.renderfrom === "SERVER") {
      showLoader = false;
    } else if (store.renderfrom === "SERVER_PLACEHOLDER") {
      showLoader = true;
    }
  }

  if (showLoader) {
    return (
      <div
        className={classnames([styles.wrapper, styles.cardS, "loading"])}
      ></div>
    );
  }

  return (
    <div className={classnames([styles.wrapper, styles.cardS])}>secondary</div>
  );
}

export default LeftNav;
