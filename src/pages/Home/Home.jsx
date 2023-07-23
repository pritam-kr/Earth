import React, { useCallback, useEffect, useState } from "react";
import styles from "./Home.module.scss";
import { Title } from "../../widgets";
import { Map, Loader } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { MAP_ACTIONS } from "../../redux/actions/actions";
import { debaunceFunction } from "../../utils/debaunceFunction";
import { apiKey, useMap } from "../../apiData/useMap";

const Home = () => {
  const {
    getCurrentUserLocationInfo,
    getLocations,
    findAirPollutionForLocation,
  } = useMap();

  const [searchValue, setSearchValue] = useState("");
  const [suggestionBox, setSuggestionBox] = useState(true);

  const dispatch = useDispatch();

  const { locationList, currentUserLocationInfo, airPollutionInfo, isLoading } =
    useSelector((state) => state.mapReducer);
  const userCurrentInfoLoading = currentUserLocationInfo?.userInfoDataLoading;
  const airPollutionLoding = airPollutionInfo?.airPoluttionLoading;

  useEffect(() => {
    getCurrentUserLocationInfo();
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debaunceSearchHandler = useCallback(
    debaunceFunction(getLocations, 2000),
    []
  );

  const airPollutionHandler = (e) => {
    const locationInfo = JSON.parse(e.target.getAttribute("data"));
    if (locationInfo) {
      findAirPollutionForLocation(locationInfo.lon, locationInfo.lat);
      // Locate on map firstly
      console.log(locationInfo);
      dispatch({
        type: MAP_ACTIONS.SET_LAT_LON_ON_MAP,
        payload: {
          lat: locationInfo.lat,
          lon: locationInfo.lon,
          location: locationInfo?.name,
          state: locationInfo?.state,
        },
      });
    }
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
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search city name"
              className={styles.input}
              onChange={debaunceSearchHandler}
            />

            {locationList?.length > 0 && (
              <div
                className={styles.searchSuggestion}
                onClick={(e) => airPollutionHandler(e)}
              >
                {locationList?.length
                  ? locationList?.map((item, i) => (
                      <LocationName location={item} key={i} />
                    ))
                  : ""}
              </div>
            )}
          </div>
        </div>
      </div>
      <Map searchValue={searchValue} />
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
