import React, { useCallback, useEffect, useState, useRef } from "react";
import styles from "./Home.module.scss";
import { Title } from "../../widgets";
import { Map, Loader, AirPollutionStats } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { MAP_ACTIONS } from "../../redux/actions/actions";
import { debaunceFunction } from "../../utils/debaunceFunction";
import { useMap } from "../../apiData/useMap";
import * as BiIcons from "react-icons/bi";
import Toggle from "react-toggle";

const Home = ({ setModal }) => {
  const { getLocations, findAirPollutionForLocation } = useMap();

  const suggestionRef = useRef(null);
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const { locationList, currentUserLocationInfo, airPollutionInfo, isLoading } =
    useSelector((state) => state.mapReducer);
  const userCurrentInfoLoading = currentUserLocationInfo?.userInfoDataLoading;
  const airPollutionLoding = airPollutionInfo?.airPoluttionLoading;
  const [suggestionBox, setSuggestionBox] = useState(false);
  const [stats, setShowStats] = useState(false);
  const features = JSON.parse(localStorage.getItem("features"));

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

  const airPollutionHandler = (e) => {
    const locationInfo = JSON.parse(e.target.getAttribute("data"));
    if (locationInfo) {
      findAirPollutionForLocation(locationInfo.lon, locationInfo.lat);
      // Locate on map firstly
      inputRef.current.value = `${locationInfo?.name}${
        locationInfo?.state !== undefined && ", "
      }${locationInfo?.state ?? ""}`;
 
    }
  };

  const showStatsHandler = (e) => {
    setShowStats(e.target.checked);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div className={styles.left}>
          <Title text={"Air pollution"} />{" "}
          {(userCurrentInfoLoading || airPollutionLoding || isLoading) && (
            <Loader
              src={
                "https://res.cloudinary.com/dhqxln7zi/image/upload/v1679836774/FormalBewitchedIsabellinewheatear-max-1mb.gif"
              }
              width={30}
              height={30}
            />
          )}
        </div>
        <div className={styles.right}>
          {features?.["map_with_stats"] && (
            <label className={styles.toggleWrapper}>
              <Toggle
                defaultChecked={stats}
                icons={false}
                onChange={showStatsHandler}
                className={"statsToggle"}
              />
              <span>Pollution Stats</span>
            </label>
          )}

          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search city name"
              className={styles.input}
              onChange={debaunceSearchHandler}
              onFocus={() => setSuggestionBox(true)}
              ref={inputRef}
            />

            {inputRef?.current?.value && (
              <BiIcons.BiXCircle
                className={styles.btnXCircle}

                onClick={() => {

                  dispatch({
                    type: MAP_ACTIONS.GET_USER_CURRENT_LOCATION_IFNO,
                    payload: { data: null, isLoading: false },
                  });

                  dispatch({
                    type: MAP_ACTIONS.GET_AIR_POLLUTION,
                    payload: { isLoading: false, data: null },
                  });

                  inputRef.current.value = "";
                }}
              />
            )}

            {suggestionBox && (
              <div
                className={styles.searchSuggestion}
                onClick={(e) => airPollutionHandler(e)}
                ref={suggestionRef}
              >
                {locationList?.length ? (
                  locationList?.map((item, i) => (
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
      </div>
      {stats ? <AirPollutionStats /> : <Map />}
    </div>
  );
};

export default Home;

const LocationName = ({ location }) => {
  return (
    <p className={styles.locationOption} data={JSON.stringify(location)}>
      {location.name}
      {location.state && `, ${location.state}`}
    </p>
  );
};
