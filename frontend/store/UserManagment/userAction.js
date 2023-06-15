import * as actionTypes from "./userActionTypes";
import { URLst, handle401, replaceObject } from "../../utils/constants";
import axios from "axios";
import { successMessage, errorMessage } from "../index";

export const userPending = () => {
  return {
    type: actionTypes.SET_USER_PENDING,
    isPending: true,
  };
};
export const alluserSuccess = (data) => {
  return {
    type: actionTypes.GET_USER_SUCCESS,
    isPending: false,
    data: data.data,
    count:data.totalUsers
  };
};
export const userCreateSuccess = (data) => {
  return {
    type: actionTypes.CREATE_USER_SUCCESS,
    data: data,
  };
};

export const userUpdateSuccess = (data) => {
  return {
    type: actionTypes.UPDATE_USER_SUCCESS,
    data: data,
  };
};

export const userFail = (error) => {
  return {
    type: actionTypes.SET_USER_ERROR,
    error: error,
    isPending: false,
  };
};


export const usersFetch = (page,limit) => {
  var token = localStorage.getItem("token");
  return (dispatch) => {
    dispatch(userPending());
    axios
      .get(URLst + `v1/user/?page=${page}&limit=${limit}`,{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        dispatch(alluserSuccess(res.data));
      })
      .catch((err) => {
        var errorData;
        if (err.response != null) {
      
          errorData = err.response.data.err.message;
        } else {
          errorData = err.message;
        }
        console.log(errorData);
        dispatch(userFail(errorData));
        dispatch(errorMessage(errorData));
      });
  };
};


export const userCreate = (formData) => {
  var token = localStorage.getItem("token");
  return (dispatch) => {
    dispatch(userPending());
    axios
      .post(URLst + "v1/user/", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data)
        dispatch(successMessage("User Created Successfully"));
        dispatch(userCreateSuccess(res.data.data));
      })
      .catch((err) => {
        var errorData;
        if (err.response != null) {
      
          errorData = err.response.data.err.message;
        } else {
          errorData = err.message;
        }
        console.log(errorData);
        dispatch(userFail(errorData));
        dispatch(errorMessage(errorData));
      });
  };
};

export const userActivate = (id, users) => {
  var token = localStorage.getItem("token");
  return (dispatch) => {
    dispatch(userPending());
    

    axios({
      method: "patch",
      url: URLst + `v1/user/${id}/activate`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log(res.data)
        let new_users = replaceObject({
          dataList: users,
          singledata: res.data.data,
        });

        dispatch(successMessage("User Activated Successfully"));
        dispatch(userUpdateSuccess(new_users));
      })
      .catch((err) => {
        var errorData;
        if (err.response != null) {
          console.log(err.response)
    
          errorData = err.response.data.err.message;
        } else {
          errorData = err.message;
        }
        dispatch(userFail(errorData));
        dispatch(errorMessage(errorData));
      });
  };
};

export const userBlock = (id, users) => {
  var token = localStorage.getItem("token");
  return (dispatch) => {
    dispatch(userPending());

      axios({
        method: "patch",
        url: URLst + `v1/user/${id}/block`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data)

        let new_users = replaceObject({
          dataList: users,
          singledata: res.data.data,
        });

        console.log(new_users)

        dispatch(successMessage("User Blocked Successfully"));
        dispatch(userUpdateSuccess(new_users));
      })
      .catch((err) => {
        var errorData;
        if (err.response != null) {
 
          errorData = err.response.data.err.message;
        } else {
          errorData = err.message;
        }
        dispatch(userFail(errorData));
        dispatch(errorMessage(errorData));
      });
  };
};
