import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { URLst } from "../utils/constants";
function Viewpdf() {
  const router = useRouter();
  const [data, setdata] = useState(null);
  const { token, id, filename, type } = router.query;


  console.log("TOKEN", token);


  useEffect(() => {
    customerFileFetch(token, id, filename, type);
  }, []);

  return (
    <>
   
    </>
  );
}

export default Viewpdf;


  const customerFileFetch = (tokenpassed, id, filename, type) => {
    var token = localStorage.getItem("token");
    console.log(type);

    axios({
      method: "get",
      responseType: 'blob',
      url: URLst + `v1/customer/${id}/files/${filename}/${type}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      //   )
      .then((res) => {
        console.log(res.data);
        //

        const file = new Blob([res.data], { type: "application/pdf" });
        let fileUrl = URL.createObjectURL(file);
        window.open(fileUrl)
        console.log(fileUrl)
        // setdata(fileUrl);
      })
      .catch((err) => {
        console.log(err)
        console.log(err.response);
        var errorData;
        if (err.response != null) {
     
          errorData = err.response.data.err.message;
        } else {
          errorData = err.message;
        }
        console.log(errorData);
      });
  };