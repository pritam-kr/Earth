import { createContext, useContext, useState } from "react";

const ErrorContext = createContext(null);

const ErrorContextProvider = ({ children }) => {
  const [isError, setIsError] = useState({
    openWeatherApi: false,
    stateCityApi: false,
  });

  return (
    <ErrorContext.Provider value={{ isError, setIsError }}>
      {children}
    </ErrorContext.Provider>
  );
};

const useErrorContext = () => useContext(ErrorContext);

export { useErrorContext, ErrorContextProvider };
