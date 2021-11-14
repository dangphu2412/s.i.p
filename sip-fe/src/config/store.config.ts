import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import createReducer from './root-reducer.config';
import rootSaga from './root-saga.config';

declare global {
    interface Window {
      __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}


export function configAndGetStore() {
	const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
	const sagaMiddleware = createSagaMiddleware();

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

