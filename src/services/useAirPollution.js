import axios from "axios";
import { useMutation } from "react-query";
import { useErrorContext } from "../context/errorContext";
import { useApiKey } from "../customHookes/useApiKey";

export const useAirPollution = () => {
  // Custom hooks
  const { openWeatherApiKey } = useApiKey();
  const { setIsError } = useErrorContext();

  const airPollutionApi = ({ lon, lat }) => {
    if (lon && lat)
      return axios
        .get(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}`
        )
        .then((res) => res.data);
  };

  const {
    mutate: getAirPollution,
    isLoading: airPollutionLoading,
    isError,
    error: airPollutionError,
  } = useMutation(airPollutionApi, {
    onError: (error) => {
      if (
        error?.response?.data?.message
          .toLowerCase()
          .includes("Invalid API key".toLowerCase())
      ) {
        setIsError((prev) => ({ ...prev, openWeatherApi: true }));
      }
    },
  });

  return { getAirPollution, airPollutionLoading, airPollutionError };
};
