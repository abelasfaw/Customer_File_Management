import * as types from "./messageTypes";
import { logout } from "../index";


export const authErrorHandler = (msg, status = 0) => {
  return (dispatch) => {
    if (status == "401" || msg == "The User no longer exists") {
      dispatch(logout());
      dispatch(setErrorMessage(msg, 401));
    }
  };
};

export const successMessage = (msg) => {
  return (dispatch) => {
    dispatch(setSuccessMessage(msg));
    setTimeout(() => {
      dispatch(setMessageNull());
    }, 5000);
  };
};

export const infoMessage = (title,msg) => {
  return (dispatch) => {
    dispatch(setInfoMessage(title,msg));
    setTimeout(() => {
      dispatch(setMessageNull());
    }, 3000);
  };
};

export const messageNull = () => {
  return (dispatch) => {
    dispatch(setMessageNull());
  };
};


export const errorMessage = (msg) => {
  return (dispatch) => {
    dispatch(setErrorMessage(msg));
    setTimeout(() => {
      dispatch(setMessageNull());
    }, 4000);
  };
};


export const setErrorMessage = (msg) => {
  return {
    type: types.SET_MESSAGE_ERROR,
    payload: msg,
  };
};

export const setSuccessMessage = (msg) => {
  return {
    type: types.SET_MESSAGE_SUCCESS,
    payload: msg,
  };
};

export const setInfoMessage = (title,msg) => {
  return {
    type: types.SET_MESSAGE_INFO,
    payload: msg,
    title:title

  };
};

export const setMessageNull = () => {
  return {
    type: types.SET_MESSAGE_NULL,
  };
};


