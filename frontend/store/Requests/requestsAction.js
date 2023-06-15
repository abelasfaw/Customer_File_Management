/** @format */

import axios from "axios";
import { URLst, handle401 } from "../../utils/constants";
import * as actionTypes from "./requestsTypes";
import { successMessage, errorMessage } from "../index";

// var token = localStorage.getItem("token");
// const token =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MWVjYThkMTk0N2I1ZmM2NzY1NmQ1MSIsInR5cGUiOiJBRE1JTiIsInN0YXR1cyI6IkFDVElWRSIsImlhdCI6MTY3OTczOTU5OX0.PQTOdls29L6vMyYgua4VzoFou_zSOTK5Fgzk5kAqq7g";

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
    count: data.totalFileRequests,
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

export const allrequestFail = (error) => {
  return {
    type: actionTypes.SET_REQUEST_ERROR,
    error: error,
    isPending: false,
  };
};

export const getAllrequestSuccess = (
  status = "PENDING",
  page = 1,
  limit = 10
) => {
  var token = localStorage.getItem("token");
  return (dispatch) => {
    dispatch(allrequestPending());

    axios({
      method: "get",
      url: URLst + `v1/file-request/${status}?page=${page}&limit=${limit}`,
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

export const requestCreate = (formData) => {
  var token = localStorage.getItem("token");
  return (dispatch) => {
    dispatch(allrequestPending());
    console.log(formData);
    axios
      .post(URLst + "v1/file-request", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        dispatch(successMessage("Requested Successfully"));
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

export const acceptORdenyrequest = (id, type, data) => {
  var token = localStorage.getItem("token");
  return (dispatch) => {
    dispatch(allrequestPending());

    axios({
      method: "put",
      url: URLst + `v1/file-request/${id}/${type}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log(data);
        let filtereddata = data.filter((item) => item._id !== id);
        console.log(filtereddata);
        console.log(res.data);
        dispatch(
          allrequestSuccess({
            data: filtereddata,
            totalFileRequests: filtereddata.length
          })
        );
        dispatch(successMessage("Action Successful."));
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
