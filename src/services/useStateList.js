import axios from "axios";
import { useMutation } from "react-query";
import { useApiKey } from "../customHookes/useApiKey";

export const useStateList = () => {
  const { stateCityApikey } = useApiKey();

  const stateListApi = ({ currentCountry }) => {
    const countryCode = currentCountry?.cca2;

    if (countryCode)
      return axios
        .get(
          `https://api.countrystatecity.in/v1/countries/${countryCode}/states`,
          {
            headers: {
              "X-CSCAPI-KEY": `${stateCityApikey}`,
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
