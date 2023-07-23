import { combineReducers, createStore } from "redux";
import {mapReducer} from "./reducer";

const allReducer = combineReducers({mapReducer})
export const store = createStore(allReducer)
 