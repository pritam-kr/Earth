import { toast } from "react-hot-toast";
import {
  PAYLOAD_LOADING_TRUE,
  MAP_ACTIONS,
  PAYLOAD_LOADING_FALSE,
} from "../../redux/actions/actions";
import { getUniqueListBy } from "../../utils/getUniqueArray";
import Select from "../Select/Select";
import * as BiIcons from "react-icons/bi";

export const MENUS = [
  { label: "Air Quality", value: "air pollution", path: "/" },
  { label: "Weather info", value: "temprature", path: "/temprature" },
  // { label: "Water Pollution", value: "water pollution", path: "/2" },
  // { label: "Heat Wave", value: "head wave", path: "/3" },
];

export const LOGO =
  "https://i.pinimg.com/originals/f3/7e/bb/f37ebbea1f4318dec775a4d705bd7cca.gif";

export const COUNTRY_API = "https://restcountries.com/v3.1/all";

export const airPollutionHandler = (
  e,
  dispatch,
  findAirPollutionForLocation,
  inputRef
) => {
  const locationInfo = JSON.parse(e.target.getAttribute("data"));
  if (locationInfo) {
    findAirPollutionForLocation(locationInfo.lon, locationInfo.lat);

    inputRef.current.value = `${locationInfo?.name}${
      typeof locationInfo?.state === "string" ? ", " + locationInfo?.state : ""
    } `;

    dispatch({
      type: MAP_ACTIONS.GET_INITIAL_LON_LAT,
      payload: {
        lon: locationInfo.lon,
        lat: locationInfo.lat,
        isLoading: false,
        error: "",
      },
    });
  }
};

export const navLinks = (pathname) => {
  if (pathname === "/") {
    return "Air Quality";
  } else if (pathname === "/temprature") {
    return "Weather info";
  } else {
    return "Not found";
  }
};

// Function to get Countries and states
export const getCountryStatesLists = async ({
  country,
  dispatch,
  getAllState,
}) => {
  const countryCode = country?.cca2;

  let lat, lng;
  [lat, lng] = country.latlng || [0, 0];

  // First country needs to select
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
        payload: PAYLOAD_LOADING_TRUE,
        countryCode: "",
      });

      const { data, status } = await getAllState(countryCode);

      if (status === 200) {
        if (!data.length) {
          dispatch({
            type: MAP_ACTIONS.GET_STATES,
            payload: PAYLOAD_LOADING_FALSE,
          });
          toast.error("No states found");
        } else {
          dispatch({
            type: MAP_ACTIONS.GET_STATES,
            payload: { data: data, isLoading: false, isError: "" },
            countryCode: countryCode,
          });
        }
      }
    } catch (error) {
      dispatch({
        type: MAP_ACTIONS.GET_STATES,
        payload: { data: [], isLoading: false, isError: error.message },
        countryCode: "",
      });
    }
  }
};

export const getCitiesOfStates = async ({
  state,
  dispatch,
  getAllCities,
  findCoordinates,
  setApikeyModal,
  country,
}) => {
  if (state) {
    try {
      dispatch({
        type: MAP_ACTIONS.GET_CITIES,
        payload: PAYLOAD_LOADING_TRUE,
      });

      const { data, status } = await getAllCities(country?.cca2, state.iso2);
      console.log(data, "data")

      if (status === 200) {
        if (!data?.length) {
          toast.error("No cities found");
          dispatch({
            type: MAP_ACTIONS.GET_CITIES,
            payload: PAYLOAD_LOADING_FALSE,
          });
        } else {
          dispatch({
            type: MAP_ACTIONS.GET_CITIES,
            payload: { data: data, isLoading: false, isError: "" },
          });

          dispatch({
            type: MAP_ACTIONS.GET_CITIES_COORDINATS,
            payload: PAYLOAD_LOADING_TRUE,
          });

          const responses = data.map((item) =>
            findCoordinates(item.name.toLowerCase().trim())
          );

          const response = await Promise.allSettled(responses);

          if (response.some((item) => item.status === "rejected")) {
            setApikeyModal(true);
          } else {
            const citiesCoordinates = getUniqueListBy(
              response
                .filter(
                  (item) =>
                    item?.value?.data?.length > 0 && item.status === "fulfilled"
                )
                .map((item) => item.value.data)
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
              payload: {
                data: citiesCoordinates,
                isLoading: false,
                error: "",
              },
            });
          }
        }
      }
    } catch (error) {
      dispatch({
        type: MAP_ACTIONS.GET_CITIES,
        payload: { data: [], isLoading: false, isError: error.message },
      });
      dispatch({
        type: MAP_ACTIONS.GET_CITIES_COORDINATS,
        payload: PAYLOAD_LOADING_FALSE,
      });
    }
  }
};

export const renderSelectComponents = ({
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
}) => {
  switch (pathname) {
    case "/temprature":
      return (
        <div className={styles.tempratureInputs}>
          <Select
            placeholder={"Select country name"}
            className={styles.selectCountryState}
            options={countries
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
            disabled={!stateList?.length}
            options={stateList
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
            loading={stateListLoading}
          />
        </div>
      );

    default:
      return (
        pathname === "/" && (
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
        )
      );
  }
};
