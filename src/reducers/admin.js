export const addAdmin = (state = "", action) => {
  switch (action.type) {
    case 'EDIT_ADD_ADMIN':
      return action.email;
    default:
      return state;
  }
};