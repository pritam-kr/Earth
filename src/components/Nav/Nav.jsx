import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Nav.module.scss";
import { MENUS, airPollutionHandler } from "./constants";
import { SelectNav } from "./components/SelectNav";
import { debaunceFunction } from "../../utils/debaunceFunction";
import { useMap } from "../../apiData/useMap";
import * as BiIcons from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import * as IoIcons from "react-icons/io";
import { useFetchApi } from "../../customHookes";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { MAP_ACTIONS } from "../../redux/actions/actions";

const Nav = () => {
  const { getLocations, findAirPollutionForLocation } = useMap();
  const { data: countryList, loading } = useFetchApi(
    "https://restcountries.com/v3.1/all"
  );

  const { pathname } = useLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debaunceSearchHandler = useCallback(
    debaunceFunction(getLocations, 500),
    []
  );
  // Local states
  const [navLinks, setNavLinks] = useState("Air Pollution");
  const [dropdown, showDropdown] = useState(false);
  const [suggestionBox, setSuggestionBox] = useState(false);
  const [searchValue, setSearchValue] = useState({ country: "" });

  // Refs
  const navLinksRef = useRef(null);
  const inputRef = useRef(null);
  const suggestionRef = useRef(null);

  // Redux State
  const ReducerStates = useSelector((state) => state.mapReducer);
  const locationLists = ReducerStates.locationsList.data;
  const dispatch = useDispatch();

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

  const tempratureHandler = async ({ e, dispatch }) => {
    const countryInfo = JSON.parse(e.target.getAttribute("data"));
    let lat, lng;
    [lat, lng] = countryInfo.latlng;
    if (lat && lng)
      dispatch({
        type: MAP_ACTIONS.GET_COUNTRY_COORDINATS,
        payload: { lat: lat, lng: lng },
      });
  };

  const renderSelectComponents = () => {
    switch (pathname) {
      case "/temprature":
        return (
          <>
            {" "}
            <input
              type="text"
              placeholder="Search country name"
              className={styles.input}
              value={searchValue.country}
              onChange={(e) =>
                setSearchValue((prev) => ({ ...prev, country: e.target.value }))
              }
            />
            {searchValue.country.trim() && (
              <div
                className={styles.searchSuggestion}
                onClick={(e) =>
                  tempratureHandler({
                    e,
                    dispatch,
                    findAirPollutionForLocation,
                    inputRef,
                  })
                }
              >
                {countryList?.length ? (
                  countryList
                    ?.sort(function (a, b) {
                      if (a.name.common < b.name.common) {
                        return -1;
                      }
                      if (a.name.common > b.name.common) {
                        return 1;
                      }
                      return 0;
                    })
                    ?.filter((item) =>
                      item.name.common
                        .toLowerCase()
                        .includes(searchValue.country.toLowerCase())
                    )
                    .map((item, i) => <CountryName country={item} key={i} />)
                ) : (
                  <div className={styles.noLocation}>
                    <BiIcons.BiLocationPlus className={styles.locationIcon} />
                    <h4>No country found</h4>
                  </div>
                )}
              </div>
            )}
          </>
        );

      default:
        return (
          <>
            {" "}
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
          </>
        );
    }
  };

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
        <div className={styles.searchBar}>{renderSelectComponents()}</div>
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

const CountryName = ({ country }) => {
  return (
    <p className={styles.locationOption} data={JSON.stringify(country)}>
      {country?.name?.common} {country?.flag}
    </p>
  );
};
