import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Nav.module.scss";
import {
  MENUS,
  airPollutionHandler,
  findCoordinates,
  getAllCities,
  getAllState,
} from "./constants";
import { SelectNav } from "./components/SelectNav";
import { debaunceFunction } from "../../utils/debaunceFunction";
import { useMap } from "../../apiData/useMap";
import * as BiIcons from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useFetchApi } from "../../customHookes";
import { useLocation } from "react-router-dom";
import { MAP_ACTIONS } from "../../redux/actions/actions";
import Select from "../Select/Select";
import { getUniqueListBy } from "../../utils/getUniqueArray";

const Nav = () => {
  const { getLocations, findAirPollutionForLocation } = useMap();
  const { data: countryList, loading: countryLoading } = useFetchApi(
    "https://restcountries.com/v3.1/all"
  );

  const { pathname } = useLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debaunceSearchHandler = useCallback(
    debaunceFunction(getLocations, 500),
    []
  );
  // Local states
  const [navLinks, setNavLinks] = useState("");
  const [dropdown, showDropdown] = useState(false);
  const [suggestionBox, setSuggestionBox] = useState(false);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");

  // Refs
  const navLinksRef = useRef(null);
  const inputRef = useRef(null);
  const suggestionRef = useRef(null);

  // Redux State
  const ReducerStates = useSelector((state) => state.mapReducer);
  const locationLists = ReducerStates.locationsList.data;
  const stateList = ReducerStates.states;

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

  useEffect(() => {
    (async () => {
      const countryCode = country?.cca2;

      let lat, lng;
      [lat, lng] = country.latlng || [0, 0];
      if (lat && lng) {
        dispatch({
          type: MAP_ACTIONS.GET_COUNTRY_COORDINATS,
          payload: { lat: lat, lng: lng },
        });
      }

      if (countryCode) {
        try {
          dispatch({
            type: MAP_ACTIONS.GET_STATES,
            payload: { data: [], isLoading: true, error: "" },
            countryCode: "",
          });

          const { data, status } = await getAllState(countryCode);

          if (status === 200) {
            dispatch({
              type: MAP_ACTIONS.GET_STATES,
              payload: { data: data, isLoading: false, error: "" },
              countryCode: countryCode,
            });
          }
        } catch (error) {
          dispatch({
            type: MAP_ACTIONS.GET_STATES,
            payload: { data: [], isLoading: false, error: error.message },
            countryCode: "",
          });
        }
      }
    })();
  }, [country]);

  useEffect(() => {
    (async () => {
      if (state) {
        try {
          dispatch({
            type: MAP_ACTIONS.GET_CITIES,
            payload: { data: [], isLoading: true, error: "" },
          });

          const { data, status } = await getAllCities(
            country?.cca2,
            state.iso2
          );

          if (status === 200) {
            dispatch({
              type: MAP_ACTIONS.GET_CITIES,
              payload: { data: data, isLoading: false, error: "" },
            });

            dispatch({
              type: MAP_ACTIONS.GET_CITIES_COORDINATS,
              payload: { data: [], isLoading: true, error: "" },
            });

            const responses = data.map((item) =>
              findCoordinates(item.name.toLowerCase().trim())
            );
            const response = await Promise.all(responses);

            const citiesCoordinates = getUniqueListBy(
              response
                .filter((item) => item.data.length && item.status === 200)
                .map((item) => item.data)
                .flat()
                .filter(
                  (item) =>
                    item.country === country.cca2 &&
                    item.state.toLowerCase() === state.name.toLowerCase()
                ),
              "name"
            );

            dispatch({
              type: MAP_ACTIONS.GET_CITIES_COORDINATS,
              payload: { data: citiesCoordinates, isLoading: false, error: "" },
            });
          }
        } catch (error) {
          dispatch({
            type: MAP_ACTIONS.GET_CITIES,
            payload: { data: [], isLoading: false, error: error.message },
          });
          dispatch({
            type: MAP_ACTIONS.GET_CITIES_COORDINATS,
            payload: { data: [], isLoading: false, error: "" },
          });
        }
      }
    })();
  }, [state]);

  const renderSelectComponents = () => {
    switch (pathname) {
      case "/temprature":
        return (
          <div className={styles.tempratureInputs}>
            <Select
              placeholder={"Select country name"}
              className={styles.selectCountryState}
              options={countryList
                .sort(function (a, b) {
                  if (a.name.common < b.name.common) {
                    return -1;
                  }
                  if (a.name.common > b.name.common) {
                    return 1;
                  }
                  return 0;
                })
                .map((item) => ({
                  ...item,
                  label: `${item.name.common} ${item.flag}`,
                }))}
              value={country}
              setValue={setCountry}
              loading={countryLoading}
            />
            <Select
              placeholder={"Select state name"}
              className={styles.selectCountryState}
              disabled={!stateList.data?.length}
              options={stateList?.data
                ?.sort(function (a, b) {
                  if (a.name < b.name) {
                    return -1;
                  }
                  if (a.name > b.name) {
                    return 1;
                  }
                  return 0;
                })
                .map((item) => ({ ...item, label: item.name }))}
              value={state}
              setValue={setState}
              loading={stateList.isLoading}
            />
          </div>
        );

      default:
        return (
          <div className={styles.searchBar}>
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
          </div>
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
      <div className={styles.right}>{renderSelectComponents()}</div>
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
