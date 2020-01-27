import React from "react";
import classnames from "classnames";
import styles from "./Nav.module.css";

function Nav() {
  return (
    <header className={classnames([styles.header, styles.cardP])}>
      <nav className={styles.wrapper}>
        <div>primary</div>
        <input className={styles.searchBar} placeholder="Search" />
        <div>primary</div>
      </nav>
    </header>
  );
}

export default Nav;
