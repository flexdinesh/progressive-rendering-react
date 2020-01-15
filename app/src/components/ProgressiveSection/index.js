import React from "react";
import styles from "./ProgressiveSection.module.css";

function ProgressiveSection({ serverRenderId = "", text }) {
  return (
    <React.Fragment>
      <div id={serverRenderId} className={styles.progressiveSectionWrapper}>
        {text && <span>{text}</span>}
      </div>
    </React.Fragment>
  );
}

export default ProgressiveSection;
