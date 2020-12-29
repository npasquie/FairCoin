import {WEB3_NOT_FETCHED} from "../utils/constants";
import {SET_WEB3_STATUS} from "../actions/web3Actions";

const initialState = {
    connexionStatus : WEB3_NOT_FETCHED
}

export const web3Reducer = (state = initialState, action) => {
    switch (action.type){
        case SET_WEB3_STATUS:
            return{
                ...state,
                connexionStatus: action.payload
            }
        default:
            return state
    }
}

export default web3Reducer