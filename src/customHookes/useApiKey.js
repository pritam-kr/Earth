import { useState } from "react";

const useApiKey = () => {
  const [openWeatherApiKey, setOpenWeatherApiKey] = useState(
    !localStorage.getItem("openWeatherAPIkey")
      ? "f4a78f3a238bb1393d8e39a33b9a4362"
      : localStorage.getItem("openWeatherAPIkey")
  );


  return { openWeatherApiKey, setOpenWeatherApiKey };
};

export { useApiKey };
