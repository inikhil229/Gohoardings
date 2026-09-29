import React, { useState, useEffect } from "react";
import Enquireregister from "./enquireregister";
import styles from "../../styles/enquire.module.scss";
import Image from "next/image";
import { BsArrowDownCircle, BsArrowUpCircle } from "react-icons/bs";
import { brandLogoApi } from "@/allApi/apis";
const Enquire = () => {
  const [logo, SetLogo] = useState([]);
  const [noOfLogo, setnoOfLogo] = useState(24);
  const [showButton, setshowButon] = useState(true);
  const slice = logo.slice(0, noOfLogo);
  const allLogo = async () => {
    const data = await brandLogoApi();
    SetLogo(data);
  };

  useEffect(() => {
   allLogo();
  }, []);

  const loadMore = () => {
    if (noOfLogo === 24) {
      setnoOfLogo(noOfLogo * 2);

      // Scroll to the next section
      const nextSection = document.getElementById("enquire_description_row");
      nextSection.scrollIntoView({ behavior: "smooth", block: "start" });

      // Delay the appearance of the next set of logos
      setTimeout(() => {
        const nextSlice = logo.slice(24, noOfLogo);
        SetLogo((prevLogo) => [...prevLogo, ...nextSlice]);
      }, 1000); // Adjust the delay time as needed
      setshowButon(false);
    }
      
    
  };

  const loadLess = () => {
    if (noOfLogo === 48) {
      setnoOfLogo(noOfLogo - 24);
      setshowButon(true);

      // Scroll to the next section (in reverse)
      const previousSection = document.getElementById("our_clients_content");
      previousSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
    <section
        id="our_clients_content"
        className={`${styles.our_clients_content} my-4 enqry`}
      >
        <h2 className="my-3 mt-md-5">Meet our happy clients</h2>
        <div className={`${styles.gridContainer} mt-3`}>
          {slice.map((clients, index) => {
            return (
              <div className={styles.gridItem} key={index}>
                <Image
                  width={500}
                  height={500}
                  src={clients.img}
                  alt={clients.alt}
                  className={`img-fluid ${styles.logoImgA}`}
                />
              </div>
            );
          })}
        </div>

        <h2>
          {showButton ? (
            <button className={`${styles.loadbutton} my-3 `} onClick={loadMore}>
              <BsArrowDownCircle />
            </button>
          ) : (
            <button className={`${styles.loadbutton} my-3 `} onClick={loadLess}>
              <BsArrowUpCircle/>
            </button>
          )}{" "}
        </h2>
      </section> 
         
      <div
        id="enquire_description_row"
        className={`container-xxl  container-xl container-lg container-md ${styles.enquire_content} py-2 py-md-5 my-md-3 px-md-5 `}
      >
        <div className={`row p-2 ${styles.enquire_description_row}`}>
          <div
            className={` col-md-4  p-4 p-md-3  ${styles.enquire_description} col-xs-0`}
          >
            <h3 className={`${styles.enquire_qsns_cant} text-light`}>
              What can Gohoardings
              <br /> help you with?
            </h3>
            <p className={`${styles.hor_border} py-2`}> </p>

            <div className="row ">
              <h6 className={`${styles.enquire_qsns_cant_qsn}  mb-1`}>
                Have a requirement ?
              </h6>
              <p className={styles.enquire_ans_cant}>
                Tell us your requirements and we will reach you with the
                brainstormed, creative and most effective solutions instantly.
              </p>
            </div>
            <div className="row py-1">
              <h6 className={`${styles.enquire_qsns_cant_qsn}  mb-1`}>
                Have a query ?
              </h6>
              <p className={styles.enquire_ans_cant}>
                Feel free to write to us. Our reps are right there to answer
                them all.
              </p>
            </div>
            <div className="row py-1">
              <h6 className={styles.enquire_qsns_cant_qsn}>
                Have a suggestion?
              </h6>
              <p className={`${styles.enquire_ans_cant} mb-4`}>
                Your feedback and suggestions are always welcome. We are
                constantly striving to be better than what we were yesterday.
              </p>
            </div>
          </div>
          <div className=" col-md-8 p-md-3 p-md-3 ps-md-5 pt-md-2 ">
            <Enquireregister />
          </div>
        </div>
      </div>
    </>
  );
};

export default Enquire;
