import React, { useCallback, useEffect, useRef, useState } from "react";
import * as BiIcons from "react-icons/bi";
import Loader from "../Loader/Loader";
import { useLocationSearch } from "../../services/useLocationSearch";
import { debaunceFunction } from "../../utils/debaunceFunction";
import { useAirPollution } from "../../services/useAirPollution";
import { CONTEXT_ACTIONS } from "../../context/contextActions";
import { useMapContext } from "../../context/mapContext";

const LocationSearchbar = ({ styles }) => {
  // Custom hooks
  const { getLocationNames, locationLists, getLocationNamesLoading } =
    useLocationSearch();
  const { getAirPollution, airPollutionLoading } = useAirPollution();
  const { dispatch } = useMapContext();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debaunceSearchHandler = useCallback(
    debaunceFunction(getLocationNames, 500),
    []
  );

  //Refs
  const inputRef = useRef(null);
  const suggestionRef = useRef(null);
  //States
  const [suggestionBox, setSuggestionBox] = useState(false);

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

  // function
  const airPollutionHandler = (
    e,
    dispatch,
    getAirPollution,
    airPollutionLoading,
    inputRef
  ) => {
    const locationInfo = JSON.parse(e.target.getAttribute("data"));
    if (locationInfo) {
      inputRef.current.value = `${locationInfo?.name}${
        typeof locationInfo?.state === "string"
          ? ", " + locationInfo?.state
          : ""
      } `;

      getAirPollution(
        { lon: locationInfo.lon, lat: locationInfo.lat },
        {
          onSuccess: (data) => {
            dispatch({
              type: CONTEXT_ACTIONS.GET_AIRPOLLUTION,
              payload: { ...data, isLoading: airPollutionLoading },
            });
          },
        }
      );

      // Storing searched location coordinate
      dispatch({
        type: CONTEXT_ACTIONS.GET_LOCATION_COORDINATE,
        payload: { lon: locationInfo.lon, lat: locationInfo.lat },
      });
    }
  };

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
      {getLocationNamesLoading || airPollutionLoading ? (
        <Loader width={20} height={20} />
      ) : (
        inputRef?.current?.value && (
          <BiIcons.BiXCircle
            className={styles.btnXCircle}
            onClick={() => (inputRef.current.value = "")}
          />
        )
      )}
      {suggestionBox && (
        <div
          className={styles.searchSuggestion}
          onClick={(e) =>
            airPollutionHandler(
              e,
              dispatch,
              getAirPollution,
              airPollutionLoading,
              inputRef
            )
          }
          ref={suggestionRef}
        >
          {locationLists?.length ? (
            locationLists?.map((item, i) => (
              <LocationName location={item} key={i} styles={styles} />
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
};

export default LocationSearchbar;

const LocationName = ({ location, styles }) => {
  return (
    <p className={styles.locationOption} data={JSON.stringify(location)}>
      {location.name}
      {location.state && `, ${location.state}`}
    </p>
  );
};
