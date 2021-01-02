import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import web3Reducer from "./reducers/web3Reducer";

export default createStore(web3Reducer, applyMiddleware(thunk))

