import React, { useEffect } from "react";
import "../styles/globals.css";
import { Provider } from "react-redux";
import { createWrapper } from "next-redux-wrapper";
import store from "../store/store";
import { primary_color,URLst } from "../utils/constants";
import { ConfigProvider, theme } from "antd";
import { Montserrat } from "@next/font/google";
import send from "../utils/service";
import Message from "../Components/MessageComponent/Message";
import { infoMessage } from "../store/index";
const { defaultAlgorithm, darkAlgorithm } = theme;

const montserrat = Montserrat({ subsets: ["latin"] });

function MyApp({ Component, pageProps }) {

  // useEffect(() => {
  //   if ("serviceWorker" in navigator) {
  //     send(URLst).catch((err) => console.error(err));
  //   } 

  // }, []);

  // if (typeof window !== "undefined") {
  //   if ("serviceWorker" in window.navigator) {
  //     navigator.serviceWorker.addEventListener('message', function(event) {
  //       store.dispatch(infoMessage(event.data.title,event.data.body))
  //     });
  //   }
  // }

  
  return (
    <Provider store={store}>
      <Message />
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: primary_color,
            borderRadius: 8,

            // fontFamily: "Montserrat",
            // lineWidth:1.5
          },
          components: {
            Table: {
              colorText: "#717698",
              borderRadius: 6,
              borderRadiusLG: 8,
            },
          },
          // algorithm:darkAlgorithm
          algorithm: store.getState().themeReducer.darkTheme
            ? darkAlgorithm
            : defaultAlgorithm,
        }}
      >
        <main className={montserrat.className}>
          <Component {...pageProps} />
        </main>
      </ConfigProvider>
    </Provider>
  );
}

const makeStore = () => store;
const wrapper = createWrapper(makeStore);

export default wrapper.withRedux(MyApp);
