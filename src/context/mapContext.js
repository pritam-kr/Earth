import { createContext, useContext, useReducer } from "react";
import { CONTEXT_ACTIONS } from "./contextActions";

const MapContext = createContext(null);

const initialState = {
  currentLocationCoordinate: { lon: null, lat: null },
  locationCoordinate: { lon: null, lat: null },
  airPollutionInfo: null,
};

const mapReducer = (state, action) => {
  switch (action.type) {
    case CONTEXT_ACTIONS.GET_AIRPOLLUTION:
      return { ...state, airPollutionInfo: action.payload };

    case CONTEXT_ACTIONS.GET_CURRENT_LOCATION_COORDINATE:
      return { ...state, currentLocationCoordinate: action.payload };

    case CONTEXT_ACTIONS.GET_LOCATION_COORDINATE:
      return { ...state, locationCoordinate: action.payload };

    default:
      return { ...state };
  }
};

const MapContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(mapReducer, initialState);

  return (
    <MapContext.Provider value={{ state, dispatch }}>
      {children}
    </MapContext.Provider>
  );
};

const useMapContext = () => useContext(MapContext);

export { useMapContext, MapContextProvider };
