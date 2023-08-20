import { useDispatch } from "react-redux";
import { MAP_ACTIONS } from "../redux/actions/actions";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useState } from "react";

export const useServices = () => {
  const dispatch = useDispatch();
  const OPEN_WEATHER_API_KEY = process.env.REACT_APP_OPENWEATHERKEY;
  const STATE_CITY_API_KEY = process.env.REACT_APP_STATE_CITY_KEY;
  const [searchValue, setSearchValue] = useState("");

  // 1. To find air pollution a location
  const findAirPollutionForLocation = async (lon, lat) => {
    try {
      dispatch({
        type: MAP_ACTIONS.GET_AIR_POLLUTION,
        payload: { isLoading: true, data: null },
      });
      const { data, status } = await axios.get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_API_KEY}`
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

  // 2. Get Location list on search bar on Navigation
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
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${OPEN_WEATHER_API_KEY}`
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

      toast.error(`${error.message}`);
    }
  };

  // 3. Get all states by country code
  const getAllState = (countryCode) => {
    try {
      return axios.get(
        `https://api.countrystatecity.in/v1/countries/${countryCode}/states`,
        {
          headers: {
            "X-CSCAPI-KEY": `${STATE_CITY_API_KEY}`,
          },
        }
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 4. Get All cities by country and state code
  const getAllCities = (countryCode = "IN", stateCode = "JH") => {
    try {
      return axios.get(
        `https://api.countrystatecity.in/v1/countries/${countryCode}/states/${stateCode}/cities`,
        {
          headers: {
            "X-CSCAPI-KEY": `${STATE_CITY_API_KEY}`,
          },
        }
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 5. Find Co-ordinates by city name
  const findCoordinates = (city) => {
    try {
      return axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${OPEN_WEATHER_API_KEY}`
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 6. Get weather info by co-ordinates
  const getWeatherInfo = ({ lat, lon }) => {
    try {
      return axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_API_KEY}&units=metric`
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  return {
    findAirPollutionForLocation,
    getLocations,
    searchValue,
    setSearchValue,
    getAllState,
    getAllCities,
    findCoordinates,
    getWeatherInfo,
  };
};
