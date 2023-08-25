import React from "react";
import styles from "./NotFound.module.scss";

const NotFound = () => {
  return (
    <div className={styles.pageContainer}>
      <div>
        <h1>404</h1>
        <h2>Page not Found</h2>
      </div>
    </div>
  );
};

export default NotFound;
