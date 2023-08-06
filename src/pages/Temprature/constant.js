import axios from "axios";

export const findWeather = ({lat, lon}) => {
  return axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=ad09d41295facd76d3932305350f3282&units=metric`
  );
};
