import React from "react";
import styles from "./Title.module.scss";

const Title = ({ text, className }) => {
  return (
    <h1 className={`${styles.title} ${className ? className : ""}`}>
      {text ? text : null}
    </h1>
  );
};

export default Title;
