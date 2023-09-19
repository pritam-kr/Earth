import axios from "axios";
import { useMutation } from "react-query";

export const useCityList = () => {
  const STATE_CITY_API_KEY = process.env.REACT_APP_STATE_CITY_KEY;

  const getCityApi = ({ countryCode = "IN", stateCode = "JH" }) => {
    if (countryCode && stateCode)
      return axios.get(
        `https://api.countrystatecity.in/v1/countries/${countryCode}/states/${stateCode}/cities`,
        {
          headers: {
            "X-CSCAPI-KEY": `${STATE_CITY_API_KEY}`,
          },
        }
      ).then(res => res.data);
  };

  const {
    mutate: getCity,
    isLoading: getCityLoading,
    isError,
    error: getCityError,
  } = useMutation(getCityApi);

  return { getCity, getCityLoading, getCityError };
};
