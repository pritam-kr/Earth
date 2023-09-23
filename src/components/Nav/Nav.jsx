import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Nav.module.scss";
import { renderSelectComponents } from "./constants";
import { SelectNav } from "./components/SelectNav";
import { debaunceFunction } from "../../utils/debaunceFunction";
import { useLocation } from "react-router-dom";
import { useLocationSearch } from "../../services/useLocationSearch";
import { useCountryList } from "../../services/useCountryList";
import { toast } from "react-hot-toast";
import { useStateList } from "../../services/useStateList";
import { useCityList } from "../../services/useCityList";
import { useAirPollution } from "../../services/useAirPollution";
import { useMapContext } from "../../context/mapContext";
import { LOGO, MENUS } from "../../globalConstant/constants";
import { getUniqueListBy } from "../../utils/getUniqueArray";
import { CONTEXT_ACTIONS } from "../../context/contextActions";
import { useWeatherContext } from "../../context/weatherContext";

const Nav = () => {
  // Custom hooks
  const { pathname } = useLocation();
  const {
    getLocationNames,
    locationLists,
    getLocationNamesLoading,
    findCoordinates,
  } = useLocationSearch();
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
  const { state: weatherContextState, dispatch: weatherContextDispath } =
    useWeatherContext();

  //Refs
  const inputRef = useRef(null);
  const suggestionRef = useRef(null);

  // States
  const [navLinks, setNavLinks] = useState("");
  const [dropdown, showDropdown] = useState(false);
  const [suggestionBox, setSuggestionBox] = useState(false);
  const [countryList, setCountryList] = useState([]);
  // Currest State, Current Country -- States
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [stateList, setStateList] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debaunceSearchHandler = useCallback(
    debaunceFunction(getLocationNames, 500),
    []
  );

  useEffect(() => {
    getCountry(null, {
      onSuccess: (data) => {
        setCountryList(data);
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

  const findCoordinatesHandler = async (data) => {
    weatherContextDispath({
      type: CONTEXT_ACTIONS.GET_CITY_COORDINATES,
      payload: { isLoading: true },
    });

    const responses = data.map((item) =>
      findCoordinates(item.name.toLowerCase().trim())
    );

    const response = await Promise.allSettled(responses);

    weatherContextDispath({
      type: CONTEXT_ACTIONS.GET_CITY_COORDINATES,
      payload: { isLoading: false },
    });

    const citiesCoordinates = getUniqueListBy(
      response
        .filter(
          (item) => item?.value?.data?.length > 0 && item.status === "fulfilled"
        )
        .map((item) => item.value.data)
        .flat()
        .filter(
          (item) =>
            item.country === country.cca2 &&
            item.state.toLowerCase().includes(state.name.toLowerCase())
        ),
      "name"
    );

    if (citiesCoordinates.length > 0) {
      weatherContextDispath({
        type: CONTEXT_ACTIONS.GET_CITY_COORDINATES,
        payload: { isLoading: false, citiesCoordinatesList: citiesCoordinates },
      });
    }
  };

  useEffect(() => {
    if (state && country) {
      getCity(
        { countryCode: country?.cca2, stateCode: state.iso2 },
        {
          onSuccess: (data) => {
            console.log(data, "data");
            if (!data?.length) {
              toast.error("No city found");
            } else {
              findCoordinatesHandler(data);
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
          countries: countryList,
          country,
          setCountry,
          state,
          setState,
          stateListLoading: getStateListLoading,
          stateList,
          LocationName,
          debaunceSearchHandler,
          citiesLoading: weatherContextState?.citiesCoordinates?.isLoading,
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
