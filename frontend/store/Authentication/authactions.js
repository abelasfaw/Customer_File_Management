import axios from "axios";
import * as actionTypes from "./authactionTypes";
import { URLst } from "../../utils/constants";
// import { loadingTrue } from "../Loading/loadingAction"
import { successMessage,errorMessage } from "../index";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token, data) => {
  console.log(data)
  localStorage.setItem("token", token);
  localStorage.setItem("type", data.type);
  localStorage.setItem("name", data.firstName + " " + data.lastName);
  localStorage.setItem("firstName", data.firstName);
  localStorage.setItem("lastName",data.lastName);

  localStorage.setItem("username", data.username);
  localStorage.setItem("id", data._id);

  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
    data: data,
  };
};
export const forgotSuccess = (mes) => {
  return {
    type: actionTypes.FORGOT_SUCCESS,
    mes: mes,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const logout = () => {
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const authLogin = (value) => {
  return (dispatch) => {
    dispatch(authStart());

    // responseType: 'json',

    console.log(value);
    axios({
      method: "post",
      responseType: "json",
      url: `${URLst}v1/login`,
      data: {
        username: value.username,
        password: value.password,
      },
    })
      .then((res) => {
        console.log(res.data);
        const token = res.data.data.token;
        const data = res.data.data;
        // dispatch(loadingTrue)
        dispatch(authSuccess(token, data));

      })
      .catch((err) => {
        var errorData;
        if (err.response != null) {
          errorData = err.response.data.err.message;
        } else {
          errorData = err.message;
        }
        console.log(err.response);
        dispatch(authFail(errorData));
        dispatch(errorMessage(errorData))

      });
  };
};

export const forgotPassword = (value) => {
  return (dispatch) => {
    dispatch(authStart());

    axios
      .post(URLst + "v1/auth/forgot-password", {
        email: value.email,
      })
      .then((res) => {
        console.log(res);

        // dispatch(loadingTrue)
        dispatch(
          forgotSuccess(
            "A link to reset your password has been sent via your email."
          )
        );
      })
      .catch((err) => {
        var errorData;
        if (err.response != null) {
          errorData = err.response.data.message;
        } else {
          errorData = err.message;
        }
        dispatch(authFail(errorData));
      });
  };
};

export const resetPassword = (value) => {
  return (dispatch) => {
    dispatch(authStart());

    axios
      .post(URLst + `v1/auth/reset-password?token=${value.token}`, {
        password: value.password,
      })
      .then((res) => {
        console.log(res);

        dispatch(
          forgotSuccess(
            "Your password has been successfully reset. Please login to continue."
          )
        );
      })
      .catch((err) => {
        var errorData;
        if (err.response != null) {
          errorData = err.response.data.message;
        } else {
          errorData = err.message;
        }
        dispatch(authFail(errorData));
      });
  };
};
