import React, { useState, useEffect } from "react";
import { CityNameImage } from "../allApi/apis";
import Slider from "react-slick";
import { setCookie } from "cookies-next";
import styles from "../styles/ourServices.module.scss";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import Link from "next/link";
import Image from "next/image";
const Ourservices = () => {
 
  const directlink = (e) => {
    CityNameImage.forEach((el) => {
      el.value2 = el.value === e.value? true : false;
    });


    setCookie("category_name", e.value);
    setCookie("categorytag", e.label);
  };


  const directlinkget = () => {
    setCookie("category_name", "billboard");
    setCookie("city_name", "delhi");
  };

  {
    var settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      initialSlide: 0,
      autoplay: true,
      pauseOnHover: true,
      responsive: [
        {
          breakpoint: 800,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            initialSlide: 0,
          },
        },
        {
          breakpoint: 540,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 0,
          },
        },
      ],
    };
  }

  return (
    <>
      <div
        className={`${styles.service_content} container-xxl  container-xl container-lg container-md  pt-md-5 pb-md-5 servc`}
      >
        <h2>Our Services</h2>
        <h6 className="pt-1">
          Choose from below to deliver advertisements in a truly <br />
          exciting, innovative and creative way.
        </h6>
        <div>
          <Slider {...settings}>
            {CityNameImage.map((pos, i) => (
              <div className="container pt-4 " key={i}>
                <div
                  className={`row bg-light rounded-2 ${styles.service_card} me-2 ms-2 "`}
                >
                  <div className="col p-3 ">
                    <Image
                      width={100}
                      height={100}
                      alt={pos.srcImg}
                      src={pos.srcImg}
                      className={`rounded-2 ${styles.service_card_img}`}
                    />
                  </div>
                  <div className="col p-3 ps-0 position-relative">
                    <h6 className="position-absolute  ps-0 fw-bold">
                      {pos.label}
                    </h6>
                    <Link
                      href={`/${pos.value}`}
                      className="text-decoration-none"
                    >
                      <p
                        className={`position-absolute bottom-0  pb-3  mb-0 text-muted w-100 ${styles.View_Detail}`}
                        onClick={() => directlink(pos)}
                      >
                        {" "}
                        View Detail{" "}
                        <HiOutlineArrowNarrowRight
                          className={`ms-3 ms-md-1 ${styles.icon_clr}`}
                        />
                      </p>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
        <section>
          <div className="container-fluid  m-0 ">
            <div className={`row mx-auto ${styles.add_container} text-center`}>
              <div className="col-md-3 col-3 ">
                <Image
                  width={100}
                  height={100}
                  src="/images/web_pics/celebration.jpg"
                  className={styles.celebration_logo}
                  alt="celebration"
                />
              </div>
              <div className="col-md-6 col-9" >
                <span>
                  <h2 className="mb-0 mb-md-1">Get Your First Ad!</h2>
                  <h6 className="pt-1">
                    Boost your business with a free advertisement!*
                  </h6>
                </span>
              </div>
              <div className="col-md-3 col-12">
                <span
                  className={`${styles.button_serch} text-white rounded-pill`}
                >
                  <Link href="/billboard">
                    <button
                      className={styles.search_btn}
                      onClick={directlinkget}
                    >
                      Get it Now
                    </button>
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Ourservices;
