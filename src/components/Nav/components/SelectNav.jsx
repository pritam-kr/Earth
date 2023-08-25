import { NavLink, useLocation } from "react-router-dom";
import * as IoIcons from "react-icons/io";
import { useEffect, useRef } from "react";
import { useOutSideClick } from "../../../customHookes";

export const SelectNav = ({
  value,
  setValue,
  className,
  options,
  styles,
  dropdown,
  showDropdown,
}) => {
  const location = useLocation();

  const navLinks = (pathname) => {
    if (pathname === "/") {
      return "Air Quality";
    } else if (pathname === "/temprature") {
      return "Weather info";
    }
  };

  return (
    <div
      className={styles.optionWrapper}
      onClick={() => showDropdown((prev) => !prev)}
    >
      <div className={styles.selectedValue}>
        {
          <label className={value ? styles.active : styles.placeholder}>
            {navLinks(location.pathname)}
          </label>
        }

        {dropdown ? <IoIcons.IoIosArrowUp /> : <IoIcons.IoIosArrowDown />}
      </div>

      {dropdown && (
        <div className={styles.options}>
          {options?.map((item) => (
            <NavLink
              className={({ isActive }) =>
                isActive ? styles.activeNavlink : styles.navLinks
              }
              onClick={(e) => {
                e.stopPropagation();
                showDropdown(false);
                setValue(item.label);
              }}
              to={item.path}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};
