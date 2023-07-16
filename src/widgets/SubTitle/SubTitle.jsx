import React from "react";
import styles from "./SubTitle.module.scss";

const SubTitle = ({ text, className }) => {
  return (
    <h3 className={`${styles.subTitle} ${className ? className : ""}`}>
      {text ? text : null}
    </h3>
  );
};

export default SubTitle;
