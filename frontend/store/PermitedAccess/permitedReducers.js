import * as actionTypes from "./permitedTypes";

const initialState = {
  error: null,
  loading: false,
  permited: [],
  office_users:[],
  count: 0,
};

const allrequestStart = (state, action) => {
  return {
    ...state,
    error: null,
    loading: true,
  };
};
const allrequestSuccess = (state, action) => {
  return {
    ...state,

    permited: action.data,
    error: null,
    loading: false,
    count: action.count,
  };
};

const allrequestFail = (state, action) => {
  return {
    ...state,
    error: action.error,
    loading: false,
  };
};

const createrequestSuccess = (state, action) => {
  return {
    ...state,
    permited: [...state.permited, action.data],
    error: null,
    loading: false,
  };
};

const updaterequestSuccess = (state, action) => {
  return {
    ...state,
    permited: action.data,
    error: null,
    loading: false,
  };
};

const fetchOfficeUsersSuccess = (state, action) => {
  return {
    ...state,
    office_users: action.data,
    error: null,
    loading: false,
  };
};

const allpermitedreducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_REQUEST_PENDING:
      return allrequestStart(state, action);
    case actionTypes.SET_REQUEST_SUCCESS:
      return allrequestSuccess(state, action);
    case actionTypes.SET_REQUEST_ERROR:
      return allrequestFail(state, action);
    case actionTypes.CREATE_REQUEST_SUCCESS:
      return createrequestSuccess(state, action);
    case actionTypes.UPDATE_REQUEST_SUCCESS:
      return updaterequestSuccess(state, action);
    case actionTypes.FETCH_USERS_SUCCESS:
      return fetchOfficeUsersSuccess(state, action);
    default:
      return state;
  }
};

export default allpermitedreducer;
