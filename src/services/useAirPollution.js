import axios from "axios";
import { useMutation } from "react-query";

export const useAirPollution = () => {
  const airPollutionApi = ({
    openWeatherAPIkey = "f4a78f3a238bb1393d8e39a33b9a4361",
    lon,
    lat,
  }) => {
    if (lon && lat)
      return axios
        .get(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${openWeatherAPIkey}`
        )
        .then((res) => res.data);
  };

  const {
    mutate: getAirPollution,
    isLoading: airPollutionLoading,
    isError,
    error: airPollutionError,
  } = useMutation(airPollutionApi);

  return { getAirPollution, airPollutionLoading, airPollutionError };
};
