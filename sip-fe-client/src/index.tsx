import React from 'react';
import { render } from 'react-dom';
import App from './views/App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { createReduxStore } from './config/store.config';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faComment, faPlusCircle, faCheckCircle,
    faInfoCircle, faPhotoVideo, faUser, faRocket,
    faMinusCircle, faFire, faArrowRight, faBirthdayCake, faStar
} from '@fortawesome/free-solid-svg-icons';

library.add(
    faComment, faPlusCircle, faCheckCircle,
    faInfoCircle, faPhotoVideo, faUser, faRocket,
    faMinusCircle, faFire, faArrowRight, faBirthdayCake,
    faStar
);

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
