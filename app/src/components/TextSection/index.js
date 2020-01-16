import React from "react";
import styles from "./TextSection.module.css";

function TextSection({ text }) {
  return <div className={styles.wrapper}>{text}</div>;
}

export default TextSection;
