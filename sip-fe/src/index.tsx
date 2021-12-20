import React from 'react';
import { render } from 'react-dom';
import './index.css';
import App from './views/App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { createReduxStore } from './config/store.config';

render(
    <React.Fragment>
        <Provider store={createReduxStore()}>
            <App />
        </Provider>
    </React.Fragment>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
