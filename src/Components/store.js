import {createStore,applyMiddleware} from 'redux';
import UserDetailsReducer from './reducer';
import thunk from 'redux-thunk';

export const getUserDetailsFromStore = createStore(UserDetailsReducer,applyMiddleware(thunk));
