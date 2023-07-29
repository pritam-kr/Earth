import React from "react";
import styles from "./Footer.module.scss";
 

const Footer = ({children}) => {
  return (
    <footer>
      <label>{children}</label>
    </footer>
  );
};

export default Footer;
