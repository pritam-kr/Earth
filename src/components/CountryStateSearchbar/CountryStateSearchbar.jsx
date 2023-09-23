import React, { useEffect, useState } from "react";
import Select from "../Select/Select";
import { useStateList } from "../../services/useStateList";
import { useCountryList } from "../../services/useCountryList";
import { toast } from "react-hot-toast";
import { useWeatherContext } from "../../context/weatherContext";
import { CONTEXT_ACTIONS } from "../../context/contextActions";
import { getUniqueListBy } from "../../utils/getUniqueArray";
import { useCityList } from "../../services/useCityList";
import { useFindCoordinates } from "../../services/useFindCoordinates";
import { useErrorContext } from "../../context/errorContext";
import { sortingAtoB } from "../../utils/sortingAtoB";

const CountryStateSearchbar = ({ styles }) => {
  //Custom hooks
  const {
    getCountry: getCountryList,
    isLoading: countryListLoading,
    error: countryListError,
  } = useCountryList();
  const { getStateList, getStateListLoading } = useStateList();
  const { getCity: getCityList, getCityError, getCityLoading } = useCityList();
  const { findCoordinates } = useFindCoordinates();
  const { setIsError } = useErrorContext();

  // Context State
  const { dispatch } = useWeatherContext();

  //States
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [currentCountry, setCurrentCountry] = useState("");
  const [currentState, setCurrentState] = useState("");

  useEffect(() => {
    getCountryList(null, {
      onSuccess: (data) => {
        setCountryList(data);
      },

      onError: (error) => {
        toast.error("Countries not found, Please try again later");
      },
    });
  }, []);

  useEffect(() => {
    if (currentCountry) {
      // Storing country co-ordinate to make map in center
      let lat, lon;
      [lat, lon] = currentCountry.latlng;

      if (lat && lon)
        dispatch({
          type: CONTEXT_ACTIONS.GET_CURRENT_COUNTRY_COORDINATE,
          payload: { lat, lon },
        });

      getStateList(
        { currentCountry },
        {
          onSuccess: (data) => {
            if (!data.length) toast.error("No state found");
            setStateList(data);
          },

          onError: (error) => {
            toast.error("Something went wrong, No state found");
          },
        }
      );
    }
  }, [currentCountry]);

  const findCoordinatesHandler = async (data) => {
    dispatch({
      type: CONTEXT_ACTIONS.GET_CITY_COORDINATES,
      payload: { isLoading: true },
    });
    const responses = data.map((item) =>
      findCoordinates(item.name.toLowerCase().trim())
    );

    const response = await Promise.allSettled(responses);
    if (response.some((item) => item.status === "rejected")) {
      setIsError((prev) => ({ ...prev, openWeatherApi: true }));
      dispatch({
        type: CONTEXT_ACTIONS.GET_CITY_COORDINATES,
        payload: { isLoading: false },
      });
    } else {
      dispatch({
        type: CONTEXT_ACTIONS.GET_CITY_COORDINATES,
        payload: { isLoading: false },
      });
      const citiesCoordinates = getUniqueListBy(
        response
          ?.filter(
            (item) =>
              item?.value?.status === 200 && item?.value?.data?.length > 0
          )
          .map((item) => item.value.data)
          .flat(),
        "name"
      ).filter(
        (item) =>
          item.state &&
          item.country === currentCountry.cca2 &&
          item.state?.toLowerCase()?.includes(currentState?.name?.toLowerCase())
      );

      if (citiesCoordinates.length > 0) {
        dispatch({
          type: CONTEXT_ACTIONS.GET_CITY_COORDINATES,
          payload: {
            isLoading: false,
            citiesCoordinatesList: citiesCoordinates,
          },
        });
      } else {
        toast.error("No city found");
      }
    }
  };

  useEffect(() => {
    if (currentState && currentCountry) {
      getCityList(
        { countryCode: currentCountry?.cca2, stateCode: currentState.iso2 },
        {
          onSuccess: (data) => {
            if (!data?.length) {
              toast.error("No city found");
            } else {
              findCoordinatesHandler(data);
            }
          },
          onError: (error) => {
            toast.error("Something went wrong, No city found");
          },
        }
      );
    }
  }, [currentState]);

  return (
    <div className={styles.tempratureInputs}>
      <Select
        placeholder={"Select country name"}
        className={styles.selectCountryState}
        options={sortingAtoB(countryList).map((item) => ({
          ...item,
          label: `${item.name.common} ${item.flag}`,
        }))}
        value={currentCountry}
        setValue={setCurrentCountry}
        loading={countryListLoading}
      />
      <Select
        placeholder={"Select state name"}
        className={styles.selectCountryState}
        disabled={!stateList?.length}
        options={sortingAtoB(stateList).map((item) => ({
          ...item,
          label: item.name,
        }))}
        value={currentState}
        setValue={setCurrentState}
        loading={getStateListLoading || getCityLoading}
      />
    </div>
  );
};

export default CountryStateSearchbar;
