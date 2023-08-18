import axios from "axios";
import { MAP_ACTIONS } from "../redux/actions/actions";
import { useDispatch } from "react-redux";
import { useState } from "react";
export const apiKey = "a78a5f9307b4a570b54118d91f3b0d9d";

export const useMap = () => {
  // Find current air pollution data

  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const findAirPollutionForLocation = async (lon, lat) => {
    try {
      dispatch({
        type: MAP_ACTIONS.GET_AIR_POLLUTION,
        payload: { isLoading: true, data: null },
      });
      const { data, status } = await axios.get(
        `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
      );

      if (status === 200)
        dispatch({
          type: MAP_ACTIONS.GET_AIR_POLLUTION,
          payload: {
            isLoading: false,
            data: {
              ...data,
            },
          },
        });
    } catch (error) {
      dispatch({
        type: MAP_ACTIONS.GET_AIR_POLLUTION,
        payload: { isLoading: false, data: null },
      });
      console.log(`Something went wrong ${error.message}`);
    }
  };

  //Dont use this for now
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
      findAirPollutionForLocation(
        locationInfo?.longitude,
        locationInfo?.latitude
      );
    } catch (error) {
      dispatch({
        type: MAP_ACTIONS.GET_USER_CURRENT_LOCATION_IFNO,
        payload: { data: null, isLoading: false },
      });
      console.log(`Something error occured ${error.message}`);
    }
  };

  // Get Location list on search bar
  const getLocations = async (event) => {
    let query = event.target.value;
    setSearchValue(query);
    if (!query) return;
    try {
      dispatch({
        type: MAP_ACTIONS.GET_LOCATION_LIST,
        payload: { data: [], isLoading: true, error: "" },
      });

      const { data, status } = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
      );

      if (status === 200) {
        dispatch({
          type: MAP_ACTIONS.GET_LOCATION_LIST,
          payload: { data: data, isLoading: false, error: "" },
        });
      }
    } catch (error) {
      dispatch({
        type: MAP_ACTIONS.GET_LOCATION_LIST,
        payload: { data: null, isLoading: false, error: "" },
      });
      console.log(`Something error occured ${error.message}`);
    }
  };

  return {
    findAirPollutionForLocation,
    getCurrentUserLocationInfo,
    getLocations,
    searchValue,
    setSearchValue,
  };
};
