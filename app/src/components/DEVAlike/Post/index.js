import React from "react";
import classnames from "classnames";
import styles from "./Post.module.css";

function Post() {
  return <div className={classnames([styles.wrapper, styles.cardP])}>primary</div>;
}

export default Post;
