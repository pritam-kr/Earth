import { combineReducers, createStore } from "redux";
import {mapReducer} from "./reducer";
import weatherReducer from "./reducer/weatherReducer";


const allReducer = combineReducers({mapReducer, weatherReducer})
export const store = createStore(allReducer)
 