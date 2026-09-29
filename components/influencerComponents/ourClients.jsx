import React, { useState, useEffect } from "react";
import styles from "../../styles/enquire.module.scss";
import Image from "next/image";
import { BsArrowDownCircle, BsArrowUpCircle } from "react-icons/bs";
import { brandLogoApi } from "@/allApi/apis";
const OurClients = () => {
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
    //   nextSection.scrollIntoView({ behavior: "smooth", block: "start" });

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
    <div
      className={`container-xxl  container-xl container-lg container-md `} 
    >
      <div className="row">
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
              <button
                className={`${styles.loadbutton} my-3 `}
                onClick={loadMore}
              >
                <BsArrowDownCircle />
              </button>
            ) : (
              <button
                className={`${styles.loadbutton} my-3 `}
                onClick={loadLess}
              >
                <BsArrowUpCircle />
              </button>
            )}{" "} 
          </h2>
        </section>
      </div>
    </div>
  );
};

export default OurClients;
