import { useEffect } from "react";
import Head from "next/head";
import Router from "next/router";
import LoadingComponent from "../Components/loadingComponent";
export default function Home() {
  useEffect(() => {
    var token = localStorage.getItem("token");

    if (token == null) {
      Router.push("/login");
    } else {
      Router.push("/dashboard");
    }
  });
  return (
    <div>
      <Head>
        <title>Land Administration</title>
        <meta name="description" content="created by Abeselom" />
        <link rel="icon" href="/favicon.ico" />
      
      </Head>

     <LoadingComponent />
     
    </div>
  );
}
