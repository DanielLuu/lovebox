import { combineReducers } from 'redux';

const form = (state = {
  name: '',
  code: '',
}, action) => {
  switch (action.type) {
    case 'CREATE_CHANGE':
      let temp = JSON.parse(JSON.stringify(state));
      temp[action.field] = action.value;
      return temp;
    default:
      return state;
  }
};

const done = (state = false, action) => {
  switch (action.type) {
    case 'CREATE_DONE':
      return action.done;
    default:
      return state;
  }
};

export const create = combineReducers({
  form,
  done
});
