import { combineReducers } from 'redux';
import { addAdmin } from './admin';


const confessions = (state = [], action) => {
  switch (action.type) {
    case 'RECEIVE_CONFESSIONS':
      return action.confessions;
    default:
      return state;
  }
};

const info = (state = {}, action) => {
  switch (action.type) {
    case 'RECEIVE_EVENT':
      return action.event;
    default:
      return state;
  }
};

const form = (state = {
  first_name: '',
  last_name: '',
  text: '',
}, action) => {
  switch (action.type) {
    case 'FORM_CHANGE':
      let temp = JSON.parse(JSON.stringify(state));
      temp[action.field] = action.value;
      return temp;
    default:
      return state;
  }
};

const admins = (state = [], action) => {
  switch (action.type) {
    case 'RECEIVE_ADMINS':
      return action.admins;
    default:
      return state;
  }
};

export const event = combineReducers({
  info,
  confessions,
  form,
  admins,
  addAdmin
});

export * from './login';
export * from './create';
