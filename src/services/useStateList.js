import axios from "axios";
import { useMutation } from "react-query";

export const useStateList = () => {
  const STATE_CITY_API_KEY = process.env.REACT_APP_STATE_CITY_KEY;

  const stateListApi = ({ currentCountry }) => {
    const countryCode = currentCountry?.cca2;

    if (countryCode)
      return axios
        .get(
          `https://api.countrystatecity.in/v1/countries/${countryCode}/states`,
          {
            headers: {
              "X-CSCAPI-KEY": `${STATE_CITY_API_KEY}`,
            },
          }
        )
        .then((res) => res.data);
  };

  const {
    mutate: getStateList,
    isError,
    isLoading,
    error,
  } = useMutation(stateListApi);

  return {
    getStateList,
    isError,
    getStateListLoading: isLoading,
    getStateListError: error,
  };
};
