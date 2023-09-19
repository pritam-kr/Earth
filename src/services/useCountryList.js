import axios from "axios";
import { useMutation } from "react-query";

export const useCountryList = () => {
  const countryApi = () =>
    axios.get("https://restcountries.com/v3.1/all").then((res) => res.data);

  const {
    mutate: getCountry,
    isError,
    isLoading,
    error,
  } = useMutation(countryApi);

  return { getCountry, isError, isLoading, error };
};
