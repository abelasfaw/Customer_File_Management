import * as types from "./messageTypes";
const initialState = {
  msgVisible: false,
  msg: "",
  msgTitle:"",
  msgType: "",
};
export const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_MESSAGE_ERROR:
      return {
        msgVisible: true,
        msg: action.payload,
        msgType: "error",
      };
    case types.SET_MESSAGE_SUCCESS:
      return {
        msgVisible: true,
        msg: action.payload,
        msgType: "success",
      };
    case types.SET_MESSAGE_INFO:
      return {
        msgVisible: true,
        msg: action.payload,
        msgTitle:action.title,
        msgType: "info",
      };
    case types.SET_MESSAGE_NULL:
      return {
        msgVisible: false,
        msg: "",
        msgType: "",
      };
    default:
      return state;
  }
};
