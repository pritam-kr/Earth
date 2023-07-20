const initialState = {
  coordinates: { lan: 0, lat: 0 },
  locationList: [],
  isLoading: false,
  mapProperties: {},
  isError: "",
  currentLocationCoordinates: { lon: "", lat: "", loading: false},
};

export const MAP_ACTIONS = {
  GET_CURRENT_COORDINATE: "get_current_coordinate",
};

const mapReducer = (state = initialState, action) => {
  switch (action.type) {
    case MAP_ACTIONS.GET_CURRENT_COORDINATE:
      console.log(action);
      return state
      
    default:
      return state;
  }
};

export default mapReducer;
