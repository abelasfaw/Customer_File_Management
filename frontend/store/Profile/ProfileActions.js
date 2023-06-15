import axios from "axios";
import * as actionTypes from "./ProfileactionTypes";
import { URLst } from "../../utils/constants";
// import { loadingTrue } from "../Loading/loadingAction"
import { successMessage } from "../index";
export const profileStart = () => {
  return {
    type: actionTypes.PROFILE_START,
  };
};

export const profileSuccess = (data) => {
  return {
    type: actionTypes.PROFILE_SUCCESS,
    data: data,
  };
};

export const profileFail = (error) => {
  return {
    type: actionTypes.PROFILE_FAIL,
    error: error,
  };
};

export const updateProfile = (formData) => {
  var token = localStorage.getItem("token");

  return (dispatch) => {
    dispatch(profileStart());

    axios
      .patch(URLst + `v1/user/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data.data);
        let data = res.data.data;
        dispatch(profileSuccess(data));
        dispatch(successMessage("Successfully Updated Profile"));
        localStorage.setItem("name", data.firstName + " " + data.lastName);
        localStorage.setItem("firstName", data.firstName);
        localStorage.setItem("lastName", data.lastName);
        localStorage.setItem("username", data.username);
      })
      .catch((err) => {
        console.log(err.response);
        var errorData;
        if (err.response != null) {
          errorData = err.response.data.err.message;
        } else {
          errorData = err.message;
        }
        dispatch(profileFail(errorData));
      });
  };
};

export const changePassword = (formData) => {
  var token = localStorage.getItem("token");

  return (dispatch) => {
    dispatch(profileStart());

    axios
      .patch(URLst + `v1/user/password`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        dispatch(profileSuccess(res.data.data));
        dispatch(successMessage("Successfully Changed Password"));
      })
      .catch((err) => {
        console.log(err.response);
        var errorData;
        if (err.response != null) {
          errorData = err.response.data.err.message;
        } else {
          errorData = err.message;
        }
        dispatch(profileFail(errorData));
      });
  };
};

export const getProfile = () => {
  return (dispatch) => {
    dispatch(profileStart());
    let data = {};
    data["firstName"] = localStorage.getItem("firstName");
    data["lastName"] = localStorage.getItem("lastName");
    data["username"] = localStorage.getItem("username");
    dispatch(profileSuccess(data));
  };
};
