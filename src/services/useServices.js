import axios from "axios";
import { toast } from "react-hot-toast";
import { useApiKey } from "../customHookes/useApiKey";
import { useErrorContext } from "../context/errorContext";

export const useServices = () => {
  const { openWeatherApiKey } = useApiKey();
  const { setIsError } = useErrorContext();

  // Get weather info by co-ordinates
  const getWeatherInfo = ({ lat, lon }) => {
    try {
      return axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=metric`
      );
    } catch (error) {
      if (
        error?.response?.data?.message
          .toLowerCase()
          .includes("Invalid API key".toLowerCase())
      ) {
        setIsError((prev) => ({
          ...prev,
          openWeatherApi: true,
          stateCityApi: false,
        }));
      } else {
        toast.error(
          error?.response?.data?.message ??
            "Something went wrong,, Try again later."
        );
      }
    }
  };

  // Weather forcast API
  const getWeatherForcast = ({ lon, lat }) => {
    return axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m`
    );
  };

  return {
    getWeatherInfo,
    getWeatherForcast,
  };
};
