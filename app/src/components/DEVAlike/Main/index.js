import React from "react";
import styles from "./Main.module.css";

function Main({ children }) {
  return <main className={styles.wrapper}>{children}</main>;
}

export default Main;
