import { MAP_ACTIONS } from "../actions/actions";

const initialState = {
  //Oninitial render
  countryCode: "",
  stateName: "",
  coordinates: { lon: null, lat: null, isLoading: false, error: "" },
  locationsList: { data: [], isLoading: false, error: "" },
  mapLoading: false,
  countries: { data: [], isLoading: false, error: "" },
  states: { data: [], isLoading: false, error: "" },
  cities: { data: [], isLoading: false, error: "" },
  countryCoordinate: { lat: null, lng: null },
  citiesCoordinates: { data: [], isLoading: false, error: "" },
  airPollutionInfo: null,

};

const mapReducer = (state = initialState, action) => {
  switch (action.type) {
    case MAP_ACTIONS.GET_CITIES_COORDINATS:
      return { ...state, citiesCoordinates: action.payload };

    case MAP_ACTIONS.GET_CITIES:
      return { ...state, cities: action.payload };

    case MAP_ACTIONS.GET_STATES:
      return {
        ...state,
        states: action.payload,
      };

    case MAP_ACTIONS.GET_COUNTRY_COORDINATS:
      return { ...state, countryCoordinate: action.payload };

    case MAP_ACTIONS.RANDOM_LOADING:
      return { ...state, mapLoading: action.payload };

    case MAP_ACTIONS.GET_INITIAL_LON_LAT:
      return { ...state, coordinates: action.payload };

    case MAP_ACTIONS.GET_AIR_POLLUTION:
      const { data, isLoading, error } = action.payload;
      return {
        ...state,
        airPollutionInfo: {
          ...data,
          loading: isLoading,
          error: error,
        },
      };

    case MAP_ACTIONS.GET_LOCATION_LIST:
      return { ...state, locationsList: action.payload, };

    default:
      return state;
  }
};

export default mapReducer;
