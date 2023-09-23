import { combineReducers, createStore } from "redux";
import weatherReducer from "./reducer/weatherReducer";


const allReducer = combineReducers({ weatherReducer})
export const store = createStore(allReducer)
 