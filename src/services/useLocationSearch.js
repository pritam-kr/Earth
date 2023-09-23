import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useMutation } from "react-query";
import { useErrorContext } from "../context/errorContext";
import { useApiKey } from "../customHookes/useApiKey";

export const useLocationSearch = () => {
  // Custom hooks
  const { openWeatherApiKey } = useApiKey();
  const { setIsError } = useErrorContext();

  // States
  const [data, setData] = useState([]);

  const locationSearchApi = (event) => {
    let query = event.target.value;

    if (query)
      return axios
        .get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${openWeatherApiKey}`
        )
        .then((res) => res.data);
  };

  const {
    mutate: getLocationNames,
    isLoading: getLocationNamesLoading,
    isError: getLocationNamesError,
  } = useMutation(locationSearchApi, {
    onSuccess: (data) => {
      setData(data);
    },

    onError: (error) => {
      if (
        error?.response?.data?.message
          .toLowerCase()
          .includes("Invalid API key".toLowerCase())
      ) {
        setIsError((prev) => ({ ...prev, openWeatherApi: true }));
      } else {
        toast.error(
          error?.response?.data?.message ??
            "No location found, Try again later."
        );
      }
    },
  });

  // 5. Find Co-ordinates by city name
  const findCoordinates = (
    city,
    openWeatherAPIkey = "f4a78f3a238bb1393d8e39a33b9a4361"
  ) => {
    try {
      return axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${openWeatherAPIkey}`
      );
    } catch (error) {}
  };

  return {
    getLocationNames,
    getLocationNamesLoading,
    getLocationNamesError,
    locationLists: data,

    //findCoordinates
    findCoordinates,
  };
};