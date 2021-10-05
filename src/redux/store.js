import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from "redux-thunk";
import thunkMiddleware from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import appReducer from './reducers';

const rootReducer = combineReducers({
  appReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  // blacklist: [], // to be not persisted
};

const persistReducers = persistReducer(persistConfig, rootReducer);

const enhancers = [
  applyMiddleware(
    thunkMiddleware
  ),
];

/* eslint-disable no-undef */
const composeEnhancers =
  (__DEV__ &&
    typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;
/* eslint-enable no-undef */

const enhancer = composeEnhancers(...enhancers);

export const store = createStore(persistReducers, {}, enhancer);
export const persistor = persistStore(store);