import { MAP_ACTIONS } from "../actions/actions";

const initialState = {
  // Map loading
  mapLoading: false,

  //Oninitial render
  coordinates: { lon: null, lat: null, isLoading: false, isError: "" },
  locationsList: { data: [], isLoading: false, isError: "" },
  airPollutionInfo: null,

  // error for only open weather API
  openweatherError: "",
};

const mapReducer = (state = initialState, action) => {
  switch (action.type) {
    case MAP_ACTIONS.RANDOM_LOADING:
      return { ...state, mapLoading: action.payload };

    case MAP_ACTIONS.GET_INITIAL_LON_LAT:
      return { ...state, coordinates: action.payload };

    case MAP_ACTIONS.GET_AIR_POLLUTION:
      const { data, isLoading, isError } = action.payload;
      return {
        ...state,
        airPollutionInfo: {
          ...data,
          loading: isLoading,
          isError: isError,
        },
      };

    case MAP_ACTIONS.GET_LOCATION_LIST:
      return { ...state, locationsList: action.payload };

    case MAP_ACTIONS.GET_ERROR_OPENWEATHERAPI:
      return { ...state, openweatherError: action.payload };

    default:
      return state;
  }
};

export default mapReducer;
