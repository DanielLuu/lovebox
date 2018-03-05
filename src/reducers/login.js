import { combineReducers } from 'redux';

const signup = (state = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
}, action) => {
  switch (action.type) {
    case 'SIGNUP_CHANGE':
      let temp = JSON.parse(JSON.stringify(state));
      temp[action.field] = action.value;
      return temp;
    default:
      return state;
  }
};

const signin = (state = {
  email: '',
  password: '',
}, action) => {
  switch (action.type) {
    case 'SIGNIN_CHANGE':
      let temp = JSON.parse(JSON.stringify(state));
      temp[action.field] = action.value;
      return temp;
    default:
      return state;
  }
};

const user = (state = {}, action) => {
  switch (action.type) {
    case 'RECEIVE_USER':
      return action.user;
    default:
      return state;
  }
};

const signedIn = (state = false, action) => {
  switch (action.type) {
    case 'SIGNIN':
      return action.signin;
    default:
      return state;
  }
};

const admin = (state = false, action) => {
  switch (action.type) {
    case 'SET_ADMIN':
      return action.admin;
    default:
      return state;
  }
};

const adminLoaded = (state = false, action) => {
  switch (action.type) {
    case 'LOAD_ADMIN':
      return action.admin;
    default:
      return state;
  }
};

const events = (state = [], action) => {
  switch (action.type) {
    case 'RECEIVE_PROFILE_EVENTS':
      return action.events;
    default:
      return state;
  }
};

export const login = combineReducers({
  signup,
  signin,
  user,
  signedIn,
  admin,
  adminLoaded,
  events
});
