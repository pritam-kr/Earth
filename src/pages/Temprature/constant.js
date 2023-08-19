import axios from "axios";
import { openWeatherApiKey } from "../../apiData/APIKey";
import { apiKey } from "../../apiData/useMap";


export const findWeather = ({ lat, lon }) => {
  return axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  );
};
