import { MAP_ACTIONS } from "../actions/actions";

const initialState = {
  coordinates: { lan: 0, lat: 0 },
  locationList: [],
  isLoading: false,
  mapProperties: {},
  isError: "",
  currentLocationCoordinates: { lon: "", lat: "", loading: false },
};

const mapReducer = (state = initialState, action) => {
  switch (action.type) {
    case MAP_ACTIONS.GET_CURRENT_COORDINATE:
      console.log(action);
      return state;

    case MAP_ACTIONS.GET_LOCATION_LIST:
      
      return {...state, locationList: action.payload};
    default:
      return state;
  }
};

export default mapReducer;
