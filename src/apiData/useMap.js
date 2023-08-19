import axios from "axios";
import { MAP_ACTIONS } from "../redux/actions/actions";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { openWeatherApiKey } from "./APIKey";
export const apiKey = "9b2e58c60f012123e45e4a40caeeba8e"; // Nehal API Key

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
        `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}`
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

      toast.error(`${error.message}`);
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

   

  return {

    getCurrentUserLocationInfo,
 
  };
};
