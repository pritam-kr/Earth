import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Nav.module.scss";
import { MENUS, airPollutionHandler } from "./constants";
import { SelectNav } from "./components/SelectNav";
import { debaunceFunction } from "../../utils/debaunceFunction";
import { useMap } from "../../apiData/useMap";
import * as BiIcons from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import * as IoIcons from "react-icons/io";

const Nav = () => {
  const { getLocations, findAirPollutionForLocation } = useMap();

  // Local states
  const [navLinks, setNavLinks] = useState("Air Pollution");
  const [dropdown, showDropdown] = useState(false);
  const [suggestionBox, setSuggestionBox] = useState(false);
  // Refs
  const navLinksRef = useRef(null);
  const inputRef = useRef(null);
  const suggestionRef = useRef(null);

  // Redux State
  const ReducerStates = useSelector((state) => state.mapReducer);
  const locationLists = ReducerStates.locationsList.data;
  const dispatch = useDispatch();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debaunceSearchHandler = useCallback(
    debaunceFunction(getLocations, 500),
    []
  );

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if (e.target !== suggestionRef.current && e.target !== inputRef.current) {
        setSuggestionBox(false);
      }
    });

    return () => {
      window.removeEventListener("click", () => {});
    };
  });

  return (
    <nav className={styles.nav}>
      <div className={styles.left}>
        <img
          src={
            "https://i.pinimg.com/originals/f3/7e/bb/f37ebbea1f4318dec775a4d705bd7cca.gif"
          }
          alt="logo"
          className={styles.logo}
        />

        <SelectNav
          value={navLinks}
          setValue={setNavLinks}
          options={MENUS}
          styles={styles}
          dropdown={dropdown}
          showDropdown={showDropdown}
          navLinksRef={navLinksRef}
        />
      </div>
      <div className={styles.right}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search location name"
            className={styles.input}
            onChange={debaunceSearchHandler}
            onFocus={() => setSuggestionBox(true)}
            ref={inputRef}
          />

          {inputRef?.current?.value && (
            <BiIcons.BiXCircle
              className={styles.btnXCircle}
              onClick={() => (inputRef.current.value = "")}
            />
          )}

          {suggestionBox && (
            <div
              className={styles.searchSuggestion}
              onClick={(e) =>
                airPollutionHandler(
                  e,
                  dispatch,
                  findAirPollutionForLocation,
                  inputRef
                )
              }
              ref={suggestionRef}
            >
              {locationLists?.length ? (
                locationLists?.map((item, i) => (
                  <LocationName location={item} key={i} />
                ))
              ) : (
                <div className={styles.noLocation}>
                  <BiIcons.BiLocationPlus className={styles.locationIcon} />
                  <h4>No location found</h4>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;

const LocationName = ({ location }) => {
  return (
    <p className={styles.locationOption} data={JSON.stringify(location)}>
      {location.name}
      {location.state && `, ${location.state}`}
    </p>
  );
};
