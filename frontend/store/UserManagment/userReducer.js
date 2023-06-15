import * as actionTypes from "./userActionTypes";

const initialState = {
  error: null,
  loading: false,
  users: [],
  user_detail: {},
  count: 0,
};

const userStart = (state, action) => {
  return {
    ...state,
    error: null,
    loading: true,
  };
};
const userSuccess = (state, action) => {
  return {
    ...state,

    users: action.data,
    error: null,
    loading: false,
    count: action.count,
  };
};

const userFail = (state, action) => {
  return {
    ...state,
    error: action.error,
    loading: false,
  };
};

const createUserSuccess = (state, action) => {
  return {
    ...state,
    users: [...state.users, action.data],
    error: null,
    loading: false,
  };
};

const updateUserSuccess = (state, action) => {
  return {
    ...state,

    users: action.data,
    error: null,
    loading: false,
  };
};


const usersreducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER_PENDING:
      return userStart(state, action);
    case actionTypes.GET_USER_SUCCESS:
      return userSuccess(state, action);
    case actionTypes.SET_USER_ERROR:
      return userFail(state, action);
    case actionTypes.CREATE_USER_SUCCESS:
      return createUserSuccess(state, action);
    case actionTypes.UPDATE_USER_SUCCESS:
      return updateUserSuccess(state, action);
    default:
      return state;
  }
};

export default usersreducer;
