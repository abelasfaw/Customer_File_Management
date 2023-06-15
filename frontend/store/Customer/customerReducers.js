import * as actionTypes from "./customerTypes";

const initialState = {
  error: null,
  loading: false,
  customer: [],
  count: 0,
  all_customers:[]
};

const allcustomerStart = (state, action) => {
  return {
    ...state,
    error: null,
    loading: true,
  };
};

const getallcustomerSuccess = (state, action) => {
  return {
    ...state,

    all_customers: action.data,
    error: null,
    loading: false,
    count: action.count,
  };
};


const allcustomerSuccess = (state, action) => {
  return {
    ...state,

    customer: action.data,
    error: null,
    loading: false,
    count: action.count,
  };
};

const allcustomerFail = (state, action) => {
  return {
    ...state,
    error: action.error,
    loading: false,
  };
};

const createcustomerSuccess = (state, action) => {
  return {
    ...state,
    customer: [...state.customer, action.data],
    error: null,
    loading: false,
  };
};

const updatecustomerSuccess = (state, action) => {
  return {
    ...state,
    customer: action.data,
    error: null,
    loading: false,
  };
};

const allcustomersreducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_CUSTOMER_PENDING:
      return allcustomerStart(state, action);
    case actionTypes.SET_CUSTOMER_SUCCESS:
      return allcustomerSuccess(state, action);
    case actionTypes.SET_CUSTOMER_ERROR:
      return allcustomerFail(state, action);
    case actionTypes.CREATE_CUSTOMER_SUCCESS:
      return createcustomerSuccess(state, action);
    case actionTypes.UPDATE_CUSTOMER_SUCCESS:
      return updatecustomerSuccess(state, action);
    case actionTypes.FETCH_ALL_CUSTOMERS_SUCCESS:
      return getallcustomerSuccess(state, action);
    default:
      return state;
  }
};

export default allcustomersreducer;
