import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useMutation } from "react-query";

export const useLocationSearch = () => {
  const [data, setData] = useState([]);

  const locationSearchApi = (
    event,
    openWeatherAPIkey = "f4a78f3a238bb1393d8e39a33b9a4361"
  ) => {
    let query = event.target.value;

    if (query)
      return axios
        .get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${openWeatherAPIkey}`
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
      toast.error(
        error?.response?.data?.message ?? "No location found, Try again later."
      );
    },
  });

  return {
    getLocationNames,
    getLocationNamesLoading,
    getLocationNamesError,
    locationLists: data,
  };
};
