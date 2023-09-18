import { MAP_ACTIONS } from "../actions/actions";

const initialState = {
  states: { data: [], isLoading: false, isError: "" },
  cities: { data: [], isLoading: false, isError: "" },

  countryCoordinate: { lat: null, lng: null },
  citiesCoordinates: { data: [], isLoading: false, error: "" },

  // States for Loader
  mapLoading: false,
};

const weatherReducer = (state = initialState, action) => {
  switch (action.type) {
    case MAP_ACTIONS.RANDOM_LOADING:
      return { ...state, mapLoading: action.payload };

    case MAP_ACTIONS.GET_STATES:
      return {
        ...state,
        states: action.payload,
      };

    case MAP_ACTIONS.GET_CITIES:
      return { ...state, cities: action.payload };

    case MAP_ACTIONS.GET_CITIES_COORDINATS:
      return { ...state, citiesCoordinates: action.payload };

    case MAP_ACTIONS.GET_COUNTRY_COORDINATS:
      return { ...state, countryCoordinate: action.payload };

    default:
      return state;
  }
};
export default weatherReducer;
