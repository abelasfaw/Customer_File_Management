/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/display-name */

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../layout";
import { adminroutes ,officeroutes,fileroomroutes} from "../layout/menuLinks";

function WithAuth(WrappedComponent) {
  return (props) => {
    const [wind, setwind] = useState(false);
    useEffect(() => {
      setwind(true);
    }, []);
    if (wind) {
      const role = localStorage.getItem("role");
      const Router = useRouter();
      // const accessToken = true;
      const accessToken = localStorage.getItem("token");

      if (role === "ADMIN") {

        if (adminroutes.some((e) => e.link == Router.pathname)) {
          let i = adminroutes.findIndex((element) => {
            return element.link === Router.pathname;
          });
          localStorage.setItem("selectedKey", i.toString());
        } else {
          localStorage.setItem("selectedKey", null);
        }
      } else if (role === "FILE-ROOM") {

        if (fileroomroutes.some((e) => e.link == Router.pathname)) {
          let i = fileroomroutes.findIndex((element) => {
            return element.link === Router.pathname;
          });
          localStorage.setItem("selectedKey", i.toString());
        } else {
          localStorage.setItem("selectedKey", null);
        }
      } else {

        if (officeroutes.some((e) => e.link == Router.pathname)) {
          let i = officeroutes.findIndex((element) => {
            return element.link === Router.pathname;
          });
          localStorage.setItem("selectedKey", i.toString());
        } else {
          localStorage.setItem("selectedKey", null);
        }
      }

      if (!accessToken) {
        Router.replace("/login");
        return null;
      }

      if (
        Router.pathname == "/login" ||
        Router.pathname == "/forgot-password" ||
        Router.pathname == "/reset-password" ||
        Router.pathname == "/"
      ) {
        return <WrappedComponent {...props} />;
      } else {
        return (
          <Layout>
            <WrappedComponent {...props} />
          </Layout>
        );
      }
    }

    return null;
  };
}

export default WithAuth;
