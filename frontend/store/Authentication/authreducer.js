import * as actionTypes from "./authactionTypes";

const initialState = {
  token: null,
  error: null,
  successMes: null,
  loading: false,
  data: {},
};

const authStart = (state, action) => {
  return {
    ...state,
    error: null,
    successMes: null,
    loading: true,
  };
};

const authSuccess = (state, action) => {
  return {
    ...state,
    token: action.token,
    data: action.data,
    error: null,
    loading: false,
  };
};

const forgotSuccess = (state, action) => {
  return {
    ...state,
    successMes: action.mes,
    loading: false,
  };
};

const authFail = (state, action) => {
  return {
    ...state,
    error: action.error,
    loading: false,
  };
};

const authLogout = (state, action) => {
  localStorage.clear();
  return { ...state, token: null, error: null, data: {} };
};

const auth_reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_FAIL:
      return authFail(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);
    case actionTypes.FORGOT_SUCCESS:
      return forgotSuccess(state, action);
    default:
      return state;
  }
};

export default auth_reducer;
