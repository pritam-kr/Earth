import axios from "axios";
import { useMutation } from "react-query";
import { useApiKey } from "../customHookes/useApiKey";

export const useCityList = () => {
  const { stateCityApikey } = useApiKey();

  const getCityApi = ({ countryCode = "IN", stateCode = "JH" }) => {
    if (countryCode && stateCode)
      return axios
        .get(
          `https://api.countrystatecity.in/v1/countries/${countryCode}/states/${stateCode}/cities`,
          {
            headers: {
              "X-CSCAPI-KEY": `${stateCityApikey}`,
            },
          }
        )
        .then((res) => res.data);
  };

  const {
    mutate: getCity,
    isLoading: getCityLoading,
    isError,
    error: getCityError,
  } = useMutation(getCityApi);

  return { getCity, getCityLoading, getCityError };
};
