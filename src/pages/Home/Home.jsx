import React, { useCallback, useEffect, useState } from "react";
import styles from "./Home.module.scss";
import { Title } from "../../widgets";
import { Map } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { MAP_ACTIONS } from "../../redux/actions/actions";
import { debaunceFunction } from "../../utils/debaunceFunction";
import { apiKey } from "../../apiData/useMap";

const Home = () => {
  const [searchValue, setSearchValue] = useState("");
  const [suggestionBox, setSuggestionBox] = useState(true);
  const dispatch = useDispatch();
  const { locationList } = useSelector((state) => state.mapReducer);

  const getCurrentUserLocationInfo = async () => {
    try {
      dispatch({
        type: MAP_ACTIONS.GET_USER_CURRENT_LOCATION_IFNO,
        payload: { data: null, isLoading: true },
      });

      const { data: locationInfo, status: locationInfoStatus } =
        await axios.get("https://geolocation-db.com/json/");

      if (locationInfoStatus === 200)
        dispatch({
          type: MAP_ACTIONS.GET_USER_CURRENT_LOCATION_IFNO,
          payload: { data: locationInfo, isLoading: false },
        });
    } catch (error) {
      dispatch({
        type: MAP_ACTIONS.GET_USER_CURRENT_LOCATION_IFNO,
        payload: { data: null, isLoading: false },
      });
      console.log(`Something error occured ${error.message}`);
    }
  };

  useEffect(() => {
    getCurrentUserLocationInfo();
  }, []);

  const getLocations = async (event) => {
    let query = event.target.value;
    if (!query) return;
    try {
      const { data, status } = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
      );

      if (status === 200) {
        dispatch({ type: MAP_ACTIONS.GET_LOCATION_LIST, payload: data });
      }
    } catch (error) {
      dispatch({ type: MAP_ACTIONS.GET_LOCATION_LIST, payload: [] });
      console.log(`Something error occured ${error.message}`);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debaunceSearchHandler = useCallback(
    debaunceFunction(getLocations, 2000),
    []
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div className={styles.left}>
          <Title text={"Air pollution"} />
        </div>
        <div className={styles.right}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search"
              className={styles.input}
              onChange={debaunceSearchHandler}
            />

            {locationList?.length > 1 && (
              <div className={styles.searchSuggestion}>
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
    <p className={styles.locationOption}>
      {location.name}
      {location.state && `, ${location.state}`}
    </p>
  );
};
