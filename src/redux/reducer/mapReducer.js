import { MAP_ACTIONS } from "../actions/actions";

const initialState = {
  currentUserLocationInfo: null,
  coordinates: { lan: 0, lat: 0 },
  locationList: [],
  isLoading: false,
  mapProperties: {},
  isError: "",
  currentLocationCoordinates: { lon: "", lat: "", loading: false },
  airPollutionInfo: null,
};

const mapReducer = (state = initialState, action) => {
  switch (action.type) {
    case MAP_ACTIONS.GET_CURRENT_COORDINATE:
      console.log(action);
      return state;

    case MAP_ACTIONS.GET_LOCATION_LIST:
      return { ...state, locationList: action.payload };

    case MAP_ACTIONS.GET_AIR_POLLUTION:
      const { data, isLoading } = action.payload;
      return {
        ...state,
        isLoading: isLoading,
        airPollutionInfo: { ...data },
      };

    case MAP_ACTIONS.GET_USER_CURRENT_LOCATION_IFNO:
      const { data: userInfoData, isLoading: userInfoDataLoading } =
        action.payload;

      return {
        ...state,
        isLoading: userInfoDataLoading,
        currentUserLocationInfo: { userInfoData },
      };

    default:
      return state;
  }
};

export default mapReducer;
