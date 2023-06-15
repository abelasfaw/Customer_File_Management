import * as actionTypes from "./ProfileactionTypes";

const initialState = {
  error: null,
  successMes: null,
  loading: false,
  data: {},
};

const profileStart = (state, action) => {
  return {
    ...state,
    error: null,
    successMes: null,
    loading: true,
  };
};

const profileSuccess = (state, action) => {
  return {
    ...state,
    data: action.data,
    error: null,
    loading: false,
  };
};


const profileFail = (state, action) => {
  return {
    ...state,
    error: action.error,
    loading: false,
  };
};


const profile_reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PROFILE_START:
      return profileStart(state, action);
    case actionTypes.PROFILE_SUCCESS:
      return profileSuccess(state, action);
    case actionTypes.PROFILE_FAIL:
      return profileFail(state, action);
    default:
      return state;
  }
};

export default profile_reducer;
