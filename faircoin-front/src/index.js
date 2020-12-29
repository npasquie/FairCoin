import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import web3Reducer from "./reducers/web3Reducer";
import {Provider} from "react-redux";

const store = createStore(web3Reducer, applyMiddleware(thunk))

ReactDOM.render(
    <Provider store={store}>
        <React.StrictMode>
            <App/>
        </React.StrictMode>
    </Provider>,
    document.getElementById('root')
);
