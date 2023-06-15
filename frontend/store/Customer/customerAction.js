/** @format */

import axios from "axios";
import { URLst, handle401 } from "../../utils/constants";
import * as actionTypes from "./customerTypes";
import { successMessage, errorMessage } from "../index";


export const allcustomerPending = () => {
  return {
    type: actionTypes.SET_CUSTOMER_PENDING,
    isPending: true,
  };
};

export const allcustomerSuccess = (data) => {
  return {
    type: actionTypes.SET_CUSTOMER_SUCCESS,
    isPending: false,
    data: data.data,
    // count: data.totalResults,
  };
};

export const customerCreateSuccess = (data) => {
  return {
    type: actionTypes.CREATE_CUSTOMER_SUCCESS,
    data: data,
  };
};

export const updatecustomerSuccess = (data) => {
  return {
    type: actionTypes.UPDATE_CUSTOMER_SUCCESS,
    isPending: false,
    data: data,
  };
};

export const fetchallcustomers= (data) => {
  return {
    type: actionTypes.FETCH_ALL_CUSTOMERS_SUCCESS,
    isPending: false,
    data: data.data,
    count:data.totalCustomers
  };
};

export const allcustomerFail = (error) => {
  return {
    type: actionTypes.SET_CUSTOMER_ERROR,
    error: error,
    isPending: false,
  };
};



export const fetchallcustomerSuccess = (page,limit) => {
  return (dispatch) => {
    var token = localStorage.getItem("token");
    dispatch(allcustomerPending());
    console.log(token);
    axios({
      method: "get",
      url: URLst + `v1/customer/all?page=${page}&limit=${limit}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log(res);
        dispatch(fetchallcustomers(res.data));
      })
      .catch((err) => {
        var errorData;
        console.log(err.response);
        if (err.response != null) {
     
          errorData = err.response.data.err.message;
        } else {
          errorData = err.message;
        }
        console.log(errorData);
        dispatch(allcustomerFail(errorData));
        dispatch(errorMessage(errorData));

      });
  };
};


export const getAllcustomerSuccess = (regId) => {
  return (dispatch) => {
    var token = localStorage.getItem("token");
    dispatch(allcustomerPending());
    console.log(token);
    axios({
      method: "get",
      url: URLst + `v1/customer?registrationNumber=${regId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log(res);
        dispatch(allcustomerSuccess(res.data));
      })
      .catch((err) => {
        var errorData;
        console.log(err.response);
        if (err.response != null) {
   
          errorData = err.response.data.err.message;
        } else {
          errorData = err.message;
        }
        console.log(errorData);
        dispatch(allcustomerFail(errorData));
        dispatch(errorMessage(errorData));

      });
  };
};

export const customerCreate = (formData) => {
  var token = localStorage.getItem("token");
  return (dispatch) => {
    dispatch(allcustomerPending());

    axios
      .post(URLst + "v1/customer", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        dispatch(successMessage("Created Successfully"));
        dispatch(allcustomerSuccess({ data: [res.data.data] }));
      })
      .catch((err) => {
        console.log(err.response);
        var errorData;
        if (err.response != null) {

          errorData = err.response.data.err.message;
        } else {
          errorData = err.message;
        }
        console.log(errorData);
        dispatch(allcustomerFail(errorData));
        dispatch(errorMessage(errorData));
      });
  };
};

export const AllcustomerEdit = (id, customers, edited) => {
  var token = localStorage.getItem("token");
  return (dispatch, getState) => {
    dispatch(allcustomerPending());

    axios({
      method: "patch",
      url: URLst + `v1/customer/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: edited,
    })
      .then((res) => {
        let newData = [...customers];
        let index = newData.findIndex((av) => av.id === res.data.id);

        newData[index] = res.data;
        dispatch(successMessage("Edited Successfully"));

        dispatch(updatecustomerSuccess(newData));
      })
      .catch((err) => {
        var errorData;

        if (err.response != null) {
          
          errorData = err.response.data.err.message;
        } else {
          errorData = err.message;
        }
        console.log(errorData);
        dispatch(allcustomerFail(errorData));
        dispatch(errorMessage(errorData));
      });
  };
};

export const customerFileCreate = (formData, id, type, customer) => {
  var token = localStorage.getItem("token");
  return (dispatch) => {
    dispatch(allcustomerPending());

    axios
      .post(URLst + `v1/customer/${id}/file/${type}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        let newarr = customer;
        console.log(newarr);
        newarr[0].files.push(res.data.data);

        dispatch(successMessage("File Created Successfully"));
        dispatch(updatecustomerSuccess(newarr));
      })
      .catch((err) => {
        var errorData;
        if (err.response != null) {
          
          errorData = err.response.data.err.message;
        } else {
          errorData = err.message;
        }
        console.log(errorData);
        dispatch(allcustomerFail(errorData));
        dispatch(errorMessage(errorData));
      });
  };
};

export const customerFileCreateOffice = (
  formData,
  id,
  type,
  customer,
  requesttoken
) => {
  var token = localStorage.getItem("token");
  return (dispatch) => {
    dispatch(allcustomerPending());

    axios
      .post(URLst + `v1/customer/${id}/files/${type}/${requesttoken}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        let newarr = customer;
        console.log(newarr);
        newarr[0].files.push(res.data.data);

        dispatch(successMessage("File Created Successfully"));
        dispatch(updatecustomerSuccess(newarr));
      })
      .catch((err) => {
        var errorData;
        if (err.response != null) {
          
          errorData = err.response.data.err.message;
        } else {
          errorData = err.message;
        }
        console.log(errorData);
        dispatch(allcustomerFail(errorData));
        dispatch(errorMessage(errorData));
      });
  };
};

export const customerFileFetch = (tokenpassed, id, filename, type) => {
  var token = localStorage.getItem("token");
  console.log(type);
  return (dispatch) => {
    dispatch(allcustomerPending());

    axios({
      method: "get",
      responseType: "blob",
      url: URLst + `v1/customer/${id}/file/${filename}/${type}/${tokenpassed}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log(res.data);
        const file = new Blob([res.data], { type: "application/pdf" });
        let fileUrl = URL.createObjectURL(file);
        window.open(fileUrl);
        console.log(fileUrl);
        dispatch(allcustomerFail(""));
      })
      .catch((err) => {
        console.log(err.response);
        var errorData;
        if (err.response != null) {
          
          errorData = err.response.data.err.message;
        } else {
          errorData = err.message;
        }
        console.log(errorData);
        dispatch(allcustomerFail(errorData));
        dispatch(errorMessage(errorData));
      });
  };
};

export const customerFileFetchFileroom = (id, filename, type) => {
  var token = localStorage.getItem("token");
  console.log(type);
  return (dispatch) => {
    dispatch(allcustomerPending());

    axios({
      method: "get",
      responseType: "blob",
      url: URLst + `v1/customer/${id}/files/${filename}/${type}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        const file = new Blob([res.data], { type: "application/pdf" });
        let fileUrl = URL.createObjectURL(file);
        window.open(fileUrl);
        console.log(fileUrl);
        dispatch(allcustomerFail(""));
      })
      .catch((err) => {
        console.log(err.response);
        var errorData;
        if (err.response != null) {
          
          errorData = err.response.data.err.message;
        } else {
          errorData = err.message;
        }
        console.log(errorData);
        dispatch(allcustomerFail(errorData));
        dispatch(errorMessage(errorData));
      });
  };
};
