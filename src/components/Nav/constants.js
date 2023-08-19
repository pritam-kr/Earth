import axios from "axios";
import { MAP_ACTIONS } from "../../redux/actions/actions";
import { apiKey } from "../../apiData/useMap";


export const MENUS = [
  { label: "Air Pollution", value: "air pollution", path: "/" },
  { label: "Temprature", value: "temprature", path: "/temprature" },
  // { label: "Water Pollution", value: "water pollution", path: "/2" },
  // { label: "Heat Wave", value: "head wave", path: "/3" },
];


export const findCoordinates = (city) => {
  try {
    return axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
    );
  } catch (error) {
    console.log(error.message);
    return null;
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

