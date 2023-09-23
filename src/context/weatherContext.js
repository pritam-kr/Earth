import { createContext, useContext, useReducer } from "react";
import { CONTEXT_ACTIONS } from "./contextActions";

const WeatherContext = createContext(null);

const initialState = {
  citiesList: [],
  citiesCoordinates: null,
};

const weatherReducer = (state, action) => {
  switch (action.type) {
    case CONTEXT_ACTIONS.GET_CITY_COORDINATES:
      return { ...state, citiesCoordinates: action.payload };

    default:
      return { ...state };
  }
};

const WeatherContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(weatherReducer, initialState);

  return (
    <WeatherContext.Provider value={{ state, dispatch }}>
      {children}
    </WeatherContext.Provider>
  );
};

const useWeatherContext = () => useContext(WeatherContext);

export { useWeatherContext, WeatherContextProvider };
