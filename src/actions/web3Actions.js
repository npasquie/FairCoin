import {
    DEPLOYED,
    DEPLOYMENT_FAILED, DEPLOYMENT_SIGNED, DEPLOYMENT_STARTED,
    WEB3_FETCH_FAILED,
    WEB3_FETCHING,
    WEB3_LOADED
} from "../utils/constants";
import fairCoinJsonInterface from "../solidity/build/FairCoin.json"
import Web3 from "web3";

export const SET_WEB3_STATUS = "SET WEB3 STATUS"
export const SET_WEB3_INSTANCE = "SET WEB3 INSTANCE"
export const SET_DEPLOYMENT_STATUS = "SET DEPLOYMENT STATUS"
export const SET_DEPLOYMENT_ADDRESS = "SET DEPLOYMENT ADDRESS"

export function fetchWeb3(){
    return async dispatch => {
        dispatch(setWeb3ConnexionStatus(WEB3_FETCHING))
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
                if (accounts[0]) {
                    dispatch(setWeb3ConnexionStatus(WEB3_LOADED))
                    const provider = await new Web3(window.ethereum)
                    dispatch(setWeb3Instance(provider))
                } else
                    dispatch(setWeb3ConnexionStatus(WEB3_FETCH_FAILED))
            } catch {
                dispatch(setWeb3ConnexionStatus(WEB3_FETCH_FAILED))
            }
        } else
            dispatch(setWeb3ConnexionStatus(WEB3_FETCH_FAILED))
    }
}

export function deployCurrency({
    name, symbol, recipients, _totalSupply, _redistributionRate,web3}){
    return async dispatch => {
        // arguments transformation
        let totalSupply = _totalSupply * 10**5
        let redistributionRate = _redistributionRate * 10

        dispatch(setDeploymentStatus(DEPLOYMENT_STARTED))
        let fairCoin = await new web3.eth.Contract(fairCoinJsonInterface.abi)
        const addresses = await web3.eth.getAccounts()
        fairCoin.deploy({
            data : fairCoinJsonInterface.bytecode,
            arguments: [name,symbol,recipients,totalSupply,redistributionRate]})
            .send({from:addresses[0]},()=>{
                setDeploymentStatus(DEPLOYMENT_SIGNED)
            })
            .on('error', error => {
                console.log(error)
                dispatch(setDeploymentStatus(DEPLOYMENT_FAILED))
            })
            .then(instance => {
                dispatch(setDeploymentAddress(instance.options.address))
                dispatch(setDeploymentStatus(DEPLOYED))
            })
    }
}

export const setWeb3ConnexionStatus = status => ({
    type: SET_WEB3_STATUS,
    payload: status
})

export const setWeb3Instance = web3 => ({
    type: SET_WEB3_INSTANCE,
    payload: web3
})

export const setDeploymentStatus = status => ({
    type: SET_DEPLOYMENT_STATUS,
    payload: status
})

export const setDeploymentAddress = address => ({
    type: SET_DEPLOYMENT_ADDRESS,
    payload: address
})