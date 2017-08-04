import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { event, login } from './reducers';

const appReducer = combineReducers({
  event,
  login
});

const configureStore = () => {
  const middlewares = [thunk];
  return createStore(
  (state, action) => {
    if (action.type === 'USER_LOGOUT') state = undefined;
    return appReducer(state, action)
  }, applyMiddleware(...middlewares));
}

export default configureStore;
