import { MAP_ACTIONS } from "../actions/actions";

const initialState = {
  currentUserLocationInfo: null,
  coordinates: { lan: null, lat: null },
  locationList: [],
  isLoading: false,
  mapProperties: {},
  isError: "",

  airPollutionInfo: null,
};

const mapReducer = (state = initialState, action) => {
  switch (action.type) {
    case MAP_ACTIONS.RANDOM_LOADING:
      return { ...state, isLoading: action.payload };

    case MAP_ACTIONS.GET_LOCATION_LIST:
      return { ...state, locationList: action.payload };

    case MAP_ACTIONS.GET_AIR_POLLUTION:
      const { data, isLoading } = action.payload;
      return {
        ...state,
        airPollutionInfo: { ...data, airPoluttionLoading: isLoading },
      };

    case MAP_ACTIONS.GET_USER_CURRENT_LOCATION_IFNO:
      const { data: userInfoData, isLoading: userInfoDataLoading } =
        action.payload;

      return {
        ...state,

        currentUserLocationInfo: { userInfoData, userInfoDataLoading },
      };

    case MAP_ACTIONS.SET_LAT_LON_ON_MAP:
      const { lat, lon, location, state : cityState } = action.payload;
      return { ...state, coordinates: { lat, lon, location, cityState } };
    default:
      return state;
  }
};

export default mapReducer;
