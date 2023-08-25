import { MAP_ACTIONS } from "../../redux/actions/actions";

export const MENUS = [
  { label: "Air Quality", value: "air pollution", path: "/" },
  // { label: "Weather info", value: "temprature", path: "/temprature" },
  // { label: "Water Pollution", value: "water pollution", path: "/2" },
  // { label: "Heat Wave", value: "head wave", path: "/3" },
];

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

export const navLinks = (pathname) => {
  if (pathname === "/") {
    return "Air Quality";
  } else if (pathname === "/temprature") {
    return "Weather info";
  } else {
    return "Not found";
  }
};
