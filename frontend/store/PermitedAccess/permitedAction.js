/** @format */

import axios from "axios";
import { URLst, handle401 } from "../../utils/constants";
import * as actionTypes from "./permitedTypes";
import { successMessage, errorMessage } from "../index";

export const allrequestPending = () => {
  return {
    type: actionTypes.SET_REQUEST_PENDING,
    isPending: true,
  };
};
export const allrequestSuccess = (data) => {
  return {
    type: actionTypes.SET_REQUEST_SUCCESS,
    isPending: false,
    data: data.data,
    count: data.totalFileAccess,
  };
};

export const requestCreateSuccess = (data) => {
  return {
    type: actionTypes.CREATE_REQUEST_SUCCESS,
    data: data,
  };
};

export const updaterequestSuccess = (data) => {
  return {
    type: actionTypes.UPDATE_REQUEST_SUCCESS,
    isPending: false,
    data: data,
  };
};

export const fetchUsersSuccess = (data) => {
  return {
    type: actionTypes.FETCH_USERS_SUCCESS,
    isPending: false,
    data: data.data,
  };
};

export const allrequestFail = (error) => {
  return {
    type: actionTypes.SET_REQUEST_ERROR,
    error: error,
    isPending: false,
  };
};

export const getAllpermitedSuccess = (page = 1, limit = 10) => {
  var token = localStorage.getItem("token");
  return (dispatch) => {
    dispatch(allrequestPending());

    axios({
      method: "get",
      url: URLst + `v1/file-access?limit=${limit}&page=${page}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log(res.data);
        dispatch(allrequestSuccess(res.data));
      })
      .catch((err) => {
        var errorData;

        if (err.response != null) {
         
          errorData = err.response.data.err.message;
        } else {
          errorData = err.message;
        }
        console.log(errorData);
        dispatch(allrequestFail(errorData));
        dispatch(errorMessage(errorData));
      });
  };
};

export const deleteExpiredFileAccesses = (formData) => {
  var token = localStorage.getItem("token");
  return (dispatch) => {
    dispatch(allrequestPending());

    axios({
      method: "patch",
      url: URLst + `v1/file-access`,
      data: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log(res.data);
        dispatch(allrequestFail(""));
      })
      .catch((err) => {
        var errorData;

        if (err.response != null) {
       
          errorData = err.response.data.err.message;
        } else {
          errorData = err.message;
        }
        console.log(errorData);
        dispatch(allrequestFail(errorData));
        dispatch(errorMessage(errorData));
      });
  };
};

export const forwardFileAccess = (file_access_id, user_id, access_list) => {
  var token = localStorage.getItem("token");
  return (dispatch,getState) => {
    dispatch(allrequestPending());
    const {count}= getState().allpermitedreducer

    axios({
      method: "patch",
      url: URLst + `v1/file-access/${file_access_id}`,
      data: { id: user_id },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        let filtered = access_list.filter(
          (item) => item._id !== file_access_id
        );
        console.log(res.data);
        dispatch(successMessage("Successfully Transfered Message."));
        dispatch(allrequestSuccess({data:filtered,totalFileAccess:count-1}));
      })
      .catch((err) => {
        var errorData;

        if (err.response != null) {
    
          errorData = err.response.data.err.message;
        } else {
          errorData = err.message;
        }
        console.log(errorData);
        dispatch(allrequestFail(errorData));
        dispatch(errorMessage(errorData));
      });
  };
};

export const getOfficePeople = (office_type) => {
  var token = localStorage.getItem("token");
  return (dispatch) => {
    dispatch(allrequestPending());

    axios({
      method: "get",
      url: URLst + `v1/user/${office_type}?limit=100`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log(res.data);
        dispatch(fetchUsersSuccess(res.data));
      })
      .catch((err) => {
        var errorData;

        if (err.response != null) {
       
          errorData = err.response.data.err.message;
        } else {
          errorData = err.message;
        }
        console.log(errorData);
        dispatch(allrequestFail(errorData));
        dispatch(errorMessage(errorData));
      });
  };
};
