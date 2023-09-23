import { useState } from "react";

const useApiKey = () => {
  const [openWeatherApiKey, setOpenWeatherApiKey] = useState(
    !localStorage.getItem("openWeatherAPIkey")
      ? process.env.REACT_APP_OPENWEATHERKEY
      : localStorage.getItem("openWeatherAPIkey")
  );

  const [stateCityApikey, setStateCityApikey] = useState(
    !localStorage.getItem("stateCityAPIKey")
      ? process.env.REACT_APP_STATE_CITY_KEY
      : localStorage.getItem("stateCityAPIKey")
  );

  return {
    openWeatherApiKey,
    setOpenWeatherApiKey,
    stateCityApikey,
    setStateCityApikey,
  };
};

export { useApiKey };
