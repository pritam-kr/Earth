import axios from "axios";
import { useErrorContext } from "../context/errorContext";
import { useApiKey } from "../customHookes/useApiKey";
import { useMutation } from "react-query";
import { toast } from "react-hot-toast";

export const useFindCoordinates = () => {
  // Custom hooks
  const { openWeatherApiKey } = useApiKey();
  const { setIsError } = useErrorContext();

  const findCoordinateApi = ({ city }) =>
    axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${openWeatherApiKey}`
    );

  const {
    mutate: getLocationCoordinate,
    isLoading: getLocationCoordinateLoading,
  } = useMutation(findCoordinateApi, {
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
            "Something went wrong, Not able to find coordinate"
        );
      }
    },
  });

  const findCoordinates = (city) => {
    try {
      return axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${openWeatherApiKey}`
      );
    } catch (error) {
      if (
        error?.response?.data?.message
          .toLowerCase()
          .includes("Invalid API key".toLowerCase())
      ) {
        setIsError((prev) => ({ ...prev, openWeatherApi: true }));
      } else {
        toast.error(
          error?.response?.data?.message ??
            "Something went wrong, Not able to find coordinate"
        );
      }
    }
  };

  return {
    getLocationCoordinate,
    getLocationCoordinateLoading,
    findCoordinates,
  };
};
