import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
import Fixednavbar from "./fixednavbar";

function useWindowScroll() {

  
  const [scrollPosition, setScrollPosition] = useState([window.pageYOffset]);
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition([window.pageYOffset]);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return scrollPosition;
}


const Floatingnavbar = () => {
  const [scroll] = useWindowScroll();
  const [scrollcss, setScrollcss] = useState(false);

  useEffect(() => {
    const handleCss = () => {
      if (scroll > 500) {
        setScrollcss(false);
      } else {
        setScrollcss(true);
      }
    };
    handleCss();
  }, [scroll]);

  return (
    <>
      <div
        style={scrollcss ? { display: "none" } : { display: "block" }}
        className="new-search   animate__animated  animate__fadeInDown mt-0"
      >
        <Fixednavbar />
      </div>
      <style jsx>
        {`
          .new-search {
            position: fixed;

            z-index: 5;
            top: 0%;
            width: 100vw;
          }
        `}
      </style>
    </>
  );
};

export default Floatingnavbar;
