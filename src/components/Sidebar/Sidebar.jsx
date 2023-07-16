import React from "react";
import styles from "./Sidebar.module.scss";
import { SubTitle } from "../../widgets";
import { MENUS } from "./constants";
// import * as BiIcons from "react-icons/bi";

const Sidebar = () => {
  return (
    <div className={styles.sideBar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.sidebarLogo}>
          <img
            className={styles.siteLogo}
            alt="earth-logo"
            src="https://res.cloudinary.com/dhqxln7zi/image/upload/v1689483981/Hello-World-earth_dpfm4x.svg"
          />
          <h1 className={styles.siteTitle}>Burnning Earth</h1>
        </div>
        {/* <div className={styles.closeSidebarBtn}>
          <BiIcons.BiLeftArrow className={styles.BiLeftArrow} />
        </div> */}
      </div>

      <div className={styles.sidebarMenus}>
        <SubTitle text={"Data we have."} className={styles.navMenuSubtitle}/>

        <div className={styles.menus}>
          {MENUS.map((item) => (
            <div className={styles.navLinks}>
              <h4>{item.label}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
