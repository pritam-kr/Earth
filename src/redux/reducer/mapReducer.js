import { MAP_ACTIONS } from "../actions/actions";

const initialState = {
  //Oninitial render
  countryCode: "",
  stateName: "",
  coordinates: { lon: null, lat: null, isLoading: false, error: "" },
  locationsList: { data: [], isLoading: true, error: "" },
  mapLoading: false,
  countries: { data: [], isLoading: true, error: "" },
  states: { data: [], isLoading: false, error: "" },
  cities: { data: [], isLoading: true, error: "" },
  countryCoordinate: { lat: null, lng: null },
  citiesCoordinates: { data: [], isLoading: false, error: "" },

  mapProperties: {},
  airPollutionInfo: null,
  currentUserLocationInfo: null,
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
      const { data, isLoading } = action.payload;
      return {
        ...state,
        airPollutionInfo: { ...data, airPoluttionLoading: isLoading },
      };

    case MAP_ACTIONS.GET_LOCATION_LIST:
      return { ...state, locationsList: action.payload };

    case MAP_ACTIONS.GET_USER_CURRENT_LOCATION_IFNO:
      const { data: userInfoData, isLoading: userInfoDataLoading } =
        action.payload;

      return {
        ...state,

        currentUserLocationInfo: { userInfoData, userInfoDataLoading },
      };

    default:
      return state;
  }
};

export default mapReducer;
