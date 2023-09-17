export const MAP_ACTIONS = {
  GET_CURRENT_COORDINATE: "get_current_coordinate",
  GET_LOCATION_LIST: "get_location_list",
  GET_AIR_POLLUTION: "get_air_pollution",
  MAP_LOADING: "map-loading",
  SET_LAT_LON_ON_MAP: "set_lan_lat",
  GET_INITIAL_LON_LAT: "set_initial_lon_lat",
  RANDOM_LOADING: "random_loading",
  GET_COUNTRIES: "get_countries",
  GET_CITIES: "get_cities",
  GET_STATES: "get_states",
  GET_COUNTRY_COORDINATS: "get_country_coordinate",
  GET_CITIES_COORDINATS: "get_cities_coordinate",
  GET_ERROR_OPENWEATHERAPI: "get_error_openweather",
};

export const PAYLOAD_LOADING_TRUE = { data: [], isLoading: true, isError: "" };
export const PAYLOAD_LOADING_FALSE = {
  data: [],
  isLoading: false,
  isError: "",
};
