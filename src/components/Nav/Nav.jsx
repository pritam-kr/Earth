import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Nav.module.scss";
import {
  COUNTRY_API,
  LOGO,
  MENUS,
  getCitiesOfStates,
  getCountryStatesLists,
  renderSelectComponents,
} from "./constants";
import { SelectNav } from "./components/SelectNav";
import { debaunceFunction } from "../../utils/debaunceFunction";
import { useDispatch, useSelector } from "react-redux";
import { useFetchApi } from "../../customHookes";
import { useLocation } from "react-router-dom";
import { useServices } from "../../services/useServices";

const Nav = ({ setApikeyModal }) => {
  // Hooks
  const {
    findAirPollutionForLocation,
    getLocations,
    getAllState,
    getAllCities,
    findCoordinates,
  } = useServices();

  const { data: countryList, loading: countryLoading } =
    useFetchApi(COUNTRY_API);

  const { pathname } = useLocation();
  const dispatch = useDispatch();

  // Redux States
  const { mapReducer, weatherReducer } = useSelector((state) => state);
  const locationLists = mapReducer.locationsList.data;
  const { data: stateList, isLoading: stateListLoading } =
    weatherReducer.states;

  //Refs
  const inputRef = useRef(null);
  const suggestionRef = useRef(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debaunceSearchHandler = useCallback(
    debaunceFunction(getLocations, 500),
    []
  );

  // States
  const [navLinks, setNavLinks] = useState("");
  const [dropdown, showDropdown] = useState(false);
  const [suggestionBox, setSuggestionBox] = useState(false);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    setCountries(countryList);
  }, [countryList]);

  useEffect(() => {
    getCountryStatesLists({ country, dispatch, getAllState });
  }, [country]);

  useEffect(() => {
    getCitiesOfStates({
      state,
      dispatch,
      getAllCities,
      findCoordinates,
      setApikeyModal,
      country,
    });
  }, [state]);

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
        {renderSelectComponents({
          suggestionRef,
          locationLists,
          findAirPollutionForLocation,
          setSuggestionBox,
          inputRef,
          dispatch,
          suggestionBox,
          pathname,
          styles,
          countries,
          country,
          setCountry,
          countryLoading,
          state,
          setState,
          stateListLoading,
          stateList,
          LocationName,
          debaunceSearchHandler,
        })}
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
