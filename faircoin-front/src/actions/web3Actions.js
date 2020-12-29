import {
    WEB3_FETCH_FAILED,
    WEB3_FETCHING,
    WEB3_LOADED
} from "../utils/constants";

export const SET_WEB3_STATUS = "SET WEB3 STATUS"

export function fetchWeb3(){
    return async dispatch => {
        dispatch(setWeb3ConnexionStatus(WEB3_FETCHING))
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
                if (accounts[0]) {
                    dispatch(setWeb3ConnexionStatus(WEB3_LOADED))
                } else
                    dispatch(setWeb3ConnexionStatus(WEB3_FETCH_FAILED))
            } catch {
                dispatch(setWeb3ConnexionStatus(WEB3_FETCH_FAILED))
            }
        } else
            dispatch(setWeb3ConnexionStatus(WEB3_FETCH_FAILED))
    }
}

export const setWeb3ConnexionStatus = status => ({
    type: SET_WEB3_STATUS,
    payload: status
})