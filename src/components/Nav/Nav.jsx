import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Nav.module.scss";
import { renderSelectComponents } from "./constants";
import { SelectNav } from "./components/SelectNav";
import { debaunceFunction } from "../../utils/debaunceFunction";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useLocationSearch } from "../../services/useLocationSearch";
import { useCountryList } from "../../services/useCountryList";
import { toast } from "react-hot-toast";
import { useStateList } from "../../services/useStateList";
import { useCityList } from "../../services/useCityList";
import { useAirPollution } from "../../services/useAirPollution";
import { useMapContext } from "../../context/mapContext";
import { LOGO, MENUS } from "../../globalConstant/constants";

const Nav = ({ setApikeyModal }) => {
  const { pathname } = useLocation();

  // New
  const { getLocationNames, locationLists, getLocationNamesLoading } =
    useLocationSearch();
  const { getStateList, getStateListLoading } = useStateList();
  const {
    getCountry,
    isLoading: countryDataLoading,
    error: countryDataError,
  } = useCountryList();

  const { getCity, getCityError, getCityLoading } = useCityList();
  const { getAirPollution, airPollutionLoading } = useAirPollution();

  // Context State
  const { dispatch } = useMapContext();

  // Redux States
  const { weatherReducer } = useSelector((state) => state);

  const { isLoading: citiesLoading } = weatherReducer.cities;

  //Refs
  const inputRef = useRef(null);
  const suggestionRef = useRef(null);

  // States
  const [navLinks, setNavLinks] = useState("");
  const [dropdown, showDropdown] = useState(false);
  const [suggestionBox, setSuggestionBox] = useState(false);

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");

  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [coordinatesList, setCoordinates] = useState([])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debaunceSearchHandler = useCallback(
    debaunceFunction(getLocationNames, 500),
    []
  );

  useEffect(() => {
    getCountry(null, {
      onSuccess: (data) => {
        setCountries(data);
      },

      onError: (error) => {
        toast.error("Countries not found, Please try again later");
      },
    });
  }, []);

  useEffect(() => {
    if (country) {
      getStateList(
        { country },
        {
          onSuccess: (data) => {
            if (!data.length) toast.error("No state found");
            setStateList(data);
          },

          onError: (error) => {
            toast.error("Something went wrong, No state found");
          },
        }
      );
    }
  }, [country]);

  useEffect(() => {
    if (state && country) {
      getCity(
        { countryCode: country?.cca2, stateCode: state.iso2 },
        {
          onSuccess: (data) => {
            if (!data?.length) {
              toast.error("No city found");
            } else {
              setCityList(data);
            }
          },
          onError: (error) => {
            toast.error("Something went wrong, No city found");
          },
        }
      );
    }
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
          getLocationNamesLoading,
          getAirPollution,
          airPollutionLoading,
          setSuggestionBox,
          inputRef,
          dispatch,
          suggestionBox,
          pathname,
          styles,
          countries,
          country,
          setCountry,
          state,
          setState,
          stateListLoading: getStateListLoading,
          stateList,
          LocationName,
          debaunceSearchHandler,
          citiesLoading,
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
