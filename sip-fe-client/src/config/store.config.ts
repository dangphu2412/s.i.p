import { applyMiddleware, compose, createStore, Store } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { fireError } from '../modules/error/error.action';
import createReducer from './root-reducer.config';
import rootSaga from './root-saga.config';

declare global {
    interface Window {
      __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}


export function createReduxStore(): Store {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const sagaMiddleware = createSagaMiddleware({
        onError: (error: Error) => {
            if (error.name === 'HTTP') {
                store.dispatch(fireError({message: error.message }));
            }
        }
    });

    const middlewares = [sagaMiddleware];
    const enhancers = [applyMiddleware(...middlewares)];

    const store = createStore(
        createReducer(),
        {},
        composeEnhancers(...enhancers),
    );
    sagaMiddleware.run(rootSaga);
    return store;
}

