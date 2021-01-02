import {NO_DEPLOYMENT, WEB3_NOT_FETCHED} from "../utils/constants";
import {
    SET_DEPLOYMENT_ADDRESS,
    SET_DEPLOYMENT_STATUS,
    SET_WEB3_INSTANCE,
    SET_WEB3_STATUS
} from "../actions/web3Actions";

const initialState = {
    connexionStatus : WEB3_NOT_FETCHED,
    web3 : undefined,
    deploymentStatus: NO_DEPLOYMENT,
    deployedAt: undefined
}

export const web3Reducer = (state = initialState, action) => {
    switch (action.type){
        case SET_WEB3_STATUS:
            return {
                ...state,
                connexionStatus: action.payload
            }
        case SET_WEB3_INSTANCE:
            return {
                ...state,
                web3: action.payload
            }
        case SET_DEPLOYMENT_STATUS:
            return {
                ...state,
                deploymentStatus: action.payload
            }
        case SET_DEPLOYMENT_ADDRESS:
            return {
                ...state,
                deployedAt: action.payload
            }
        default:
            return state
    }
}

export default web3Reducer