import React, { useState } from "react";
import styles from "./Nav.module.scss";
import { SelectNav } from "./components/SelectNav";
import { useLocation } from "react-router-dom";
import { LOGO, MENUS } from "../../globalConstant/constants";
import LocationSearchbar from "../LocationSearchbar/LocationSearchbar";
import CountryStateSearchbar from "../CountryStateSearchbar/CountryStateSearchbar";

const Nav = () => {
  // Custom hooks
  const { pathname } = useLocation();

  // States
  const [navLinks, setNavLinks] = useState("");
  const [dropdown, showDropdown] = useState(false);

  return (
    <nav className={styles.nav}>
      <div className={styles.left}>
        <img src={LOGO} alt="logo" className={styles.logo} />

        <SelectNav
          value={navLinks}
          setValue={setNavLinks}
          options={MENUS}
          styles={styles}
          dropdown={dropdown}
          showDropdown={showDropdown}
        />
      </div>

      <div className={styles.right}>
        {pathname === "/" ? (
          <LocationSearchbar styles={styles} />
        ) : pathname === "/weather" ? (
          <CountryStateSearchbar styles={styles} />
        ) : null}
      </div>
    </nav>
  );
};

export default Nav;
