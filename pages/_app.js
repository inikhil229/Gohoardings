import React, { useEffect } from "react";
import "@/styles/globals.scss";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "animate.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import { SSRProvider } from "react-bootstrap";
import { SessionProvider } from "next-auth/react";
import AccountProvider from "@/allApi/apicontext";
import Footer from "@/components/footer";
import Mobilenav from "@/components/navbar/mobilenav";
import { appWithTranslation } from "next-i18next";
import ChatWidget from "@/components/chatWidgets";

function App({ Component, pageProps, session }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.js");
  }, []);

  return (
    <SSRProvider>
      <AccountProvider>
        <SessionProvider session={session}>
          <Mobilenav />
          <Component {...pageProps} />
          <ChatWidget />
        </SessionProvider>
        <Footer />
      </AccountProvider>
    </SSRProvider>
  );
}

export default appWithTranslation(App);
