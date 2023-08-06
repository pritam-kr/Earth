import axios from "axios";
import { MAP_ACTIONS } from "../../redux/actions/actions";

export const MENUS = [
  { label: "Air Pollution", value: "air pollution", path: "/" },
  { label: "Temprature", value: "temprature", path: "/temprature" },
  { label: "Water Pollution", value: "water pollution", path: "/2" },
  { label: "Heat Wave", value: "head wave", path: "/3" },
];


export const findCoordinates = (city) => {
  try {
    return axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=ad09d41295facd76d3932305350f3282`
    );
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

export const getAllState = (countryCode) => {
  try {
    return axios.get(
      `https://api.countrystatecity.in/v1/countries/${countryCode}/states`,
      {
        headers: {
          "X-CSCAPI-KEY":
            "RkZLNmp1QnNNeXZIN094RjhvY25Hd3pQNHN0d0pvdk1xWVlidUpEaA==",
        },
      }
    );
  } catch (error) {
    console.log(error.message);
  }
};

export const getAllCities = (countryCode = "IN", stateCode = "JH") => {
  try {
    return axios.get(
      `https://api.countrystatecity.in/v1/countries/${countryCode}/states/${stateCode}/cities`,
      {
        headers: {
          "X-CSCAPI-KEY":
            "RkZLNmp1QnNNeXZIN094RjhvY25Hd3pQNHN0d0pvdk1xWVlidUpEaA==",
        },
      }
    );
  } catch (error) {
    console.log(error.message);
  }
};

export const airPollutionHandler = (
  e,
  dispatch,
  findAirPollutionForLocation,
  inputRef
) => {
  const locationInfo = JSON.parse(e.target.getAttribute("data"));
  if (locationInfo) {
    findAirPollutionForLocation(locationInfo.lon, locationInfo.lat);
    // Locate on map firstly
    inputRef.current.value = `${locationInfo?.name}${
      locationInfo?.state !== undefined && ", "
    }${locationInfo?.state ?? ""}`;

    dispatch({
      type: MAP_ACTIONS.GET_INITIAL_LON_LAT,
      payload: {
        lon: locationInfo.lon,
        lat: locationInfo.lat,
        isLoading: false,
        error: "",
      },
    });
  }
};
