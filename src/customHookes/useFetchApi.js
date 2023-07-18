import axios from "axios";
import { useEffect, useState } from "react";

const useFetchApi = (url) => {
  const [apiData, setApiData] = useState({
    data: [],
    isLoading: false,
    isError: "",
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    if (url)
      try {
        setApiData((prev) => ({ ...prev, isLoading: true, isError: ""}));
        const { data, status } = await axios(url);

        if (status === 200) {
          setApiData((prev) => ({
            ...prev,
            isLoading: false,
            isError: "",
            data: data,
          }));
        } else {
          setApiData((prev) => ({
            ...prev,
            isLoading: false,
            isError: "Error occured while fetching",
            data: [],
          }));
        }
      } catch (error) {
        setApiData((prev) => ({
          ...prev,
          isLoading: false,
          isError: error.message ?? "Error occured while fetching",
          data: [],
        }));
      }
  };

  return {
    data: apiData.data,
    loading: apiData.isLoading,
    error: apiData.isError,
  };
};

export default useFetchApi;
