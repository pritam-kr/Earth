import { useDispatch } from "react-redux";
import { MAP_ACTIONS } from "../redux/actions/actions";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useState } from "react";

export const useServices = () => {
  const dispatch = useDispatch();
  const [openWeatherAPIkey, setOpenWeatherApiKey] = useState(
    !localStorage.getItem("openWeatherAPIkey")
      ? "f4a78f3a238bb1393d8e39a33b9a4361"
      : localStorage.getItem("openWeatherAPIkey")
  );
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
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${openWeatherAPIkey}`
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
        payload: {
          isLoading: false,
          data: null,
          error:
            error?.response?.data?.message ??
            "Something went wrong, Please change your API key.",
        },
      });

      // toast.error(`${error.message}`);
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
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${openWeatherAPIkey}`
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
        payload: {
          data: null,
          isLoading: false,
          error:
            error?.response?.data?.message ??
            "Something went wrong, Please change your API key.",
        },
      });

      toast.error(
        error.response.data.message ??
          "Something went wrong, Please change your API key."
      );
    }
  };

  // // 3. Get all states by country code
  // const getAllState = (countryCode) => {
  //   try {
  //     return axios.get(
  //       `https://api.countrystatecity.in/v1/countries/${countryCode}/states`,
  //       {
  //         headers: {
  //           "X-CSCAPI-KEY": `${STATE_CITY_API_KEY}`,
  //         },
  //       }
  //     );
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };

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
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${openWeatherAPIkey}`
      );
    } catch (error) {
      dispatch({
        type: MAP_ACTIONS.GET_ERROR_OPENWEATHERAPI,
        payload:
          error.response.data.message ??
          "Something went wrong, Please change your API key.",
      });
    }
  };

  // 6. Get weather info by co-ordinates
  const getWeatherInfo = ({ lat, lon }) => {
    try {
      return axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherAPIkey}&units=metric`
      );
    } catch (error) {
      toast.error(
        error.response.data.message ??
          "Something went wrong, Please change your API key."
      );
      dispatch({
        type: MAP_ACTIONS.GET_ERROR_OPENWEATHERAPI,
        payload:
          error.response.data.message ??
          "Something went wrong, Please change your API key.",
      });
    }
  };

  // 7. Weather forcast API
  const getWeatherForcast = ({ lon, lat }) => {
    return axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m`
    );
  };

  return {
    findAirPollutionForLocation,
    getLocations,
    searchValue,
    setSearchValue,
    // getAllState,
    getAllCities,
    findCoordinates,
    getWeatherInfo,
    getWeatherForcast,
    setOpenWeatherApiKey,
  };
};
