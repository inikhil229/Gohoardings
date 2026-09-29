import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Modal from "react-bootstrap/Modal";
import { AccountContext } from "@/allApi/apicontext";
import { FiPhoneCall } from "react-icons/fi";
import dynamic from "next/dynamic";
import { BiMailSend } from "react-icons/bi";
import { setCookie ,getCookie} from "cookies-next";
import { MdLocationOn } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import Image from "next/image";
import {
  enquiryApi,
  emailformate,
  changefooter,
  CityNameImage,
} from "../allApi/apis";
import FloatingWhatsAppComponent from "./floatingWhatsapp";
import ChatBox from "./chatbox";
import GoHoardingsChatbot from "./aiibot";
const Footer = () => {
  const route = useRouter();
  const [serviceIcon, setServiceIcon] = useState(CityNameImage);
  const [email, setEmail] = useState([]);
  const { handleClose, handleShow, show } = useContext(AccountContext);
  const [country, setCountry] = useState("India"); // Default to India
  const LoginN = dynamic(() => import("@/pages/login/loginParent"));

  useEffect(() => {
    // Get the 'selected_country' cookie value on component mount
    const selectedCountry = getCookie("selected_country");

    // If the selected country is 'AE' (UAE), update the country name to 'UAE'
    if (selectedCountry === "AE") {
      setCountry("UAE");
    } else {
      setCountry("India");
    }
  }, []); // Empty dependency array to run this effect only once

  const handelSubmit = async (e) => {
    let count = 0;
    e.preventDefault();
    if (!emailformate.test(email)) {
      count = +1;
    } else if (count === 0) {
      const data = await enquiryApi(email);
      if (data.success == true) {
        setEmail("");
        toast(
          "Thank for becoming our member, You will get best deals from us."
        );
      }
    }
  };

  const services = [...serviceIcon];
  const direactMedia = (e) => {
    setCookie("category_name", e);
    services.map((el) => {
      if (el.value == e) {
        el.value2 = true;
      }
      if (el.value !== e) {
        el.value2 = false;
      }
    });

    setServiceIcon(services);
  };

  const direactCity = (e) => {
    setCookie("category_name", "traditional-media");
    setCookie("city_name", e === "India" ? "UAE" : e); // Replace "India" with "UAE"
    const services = [...serviceIcon];
    services.map((el) => {
      el.value2 = false;
    });

    setServiceIcon(services);
  };

  const logo = [
    {
      id: 1,
      img: "/images/web_pics/facebook.png",
      alt: "logo1",
      link: "https://www.facebook.com/gohoardings/",
    },
    {
      id: 2,
      img: "/images/web_pics/insta.png",
      alt: "logo2",
      link: "https://www.instagram.com/gohoardings/",
    },
    {
      id: 3,
      img: "/images/web_pics/twiter.png",
      alt: "logo3",
      link: "https://twitter.com/gohoardings",
    },
    {
      id: 4,
      img: "/images/web_pics/linkdin.png",
      alt: "logo4",
      link: "https://www.linkedin.com/company/gohoardings/",
    },
    {
      id: 5,
      img: "/images/web_pics/meail.png",
      alt: "logo5",
      link: "mailto:info@gohoardings.com",
    },
  ];
  // const cities = [
  //   {
  //     name: "Delhi",
  //     city: "delhi",
  //   },
  //   {
  //     name: "Noida",
  //     city: "noida",
  //   },
  //   {
  //     name: "Pune",
  //     city: "pune",
  //   },
  //   {
  //     name: "Bengaluru",
  //     city: "bengaluru",
  //   },
  //   {
  //     name: "Chennai",
  //     city: "chennai",
  //   },
  //   {
  //     name: "Hyderabad",
  //     city: "hyderabad",
  //   },
  //   {
  //     name: "Mumbai",
  //     city: "mumbai",
  //   },
  // ];
  const categories = [
    { name: "Billboard", href: "/billboard" },
    { name: "Digital Billboard", href: "/digital-billboard" },
    { name: "Mall Media", href: "/mall-media" },
    { name: "InFlight Branding", href: "/inflight-media" },
    { name: "Lift Branding", href: "/lift-branding" },
    { name: "Transit Media", href: "/transit-media" },
    { name: "Airport Branding", href: "/airport-media" },
  ];

  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("/api/cities");
        const result = await response.json();

        if (result.success) {
          setCities(result.data);
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, []);

  return (
    <>
      <div className=" footerN-content  pb-3  p-0 px-3 px-md-5 py-md-1  pt-md-5 ">
        <div className="row footer-branding pb-md-4 pb-2">
          <div className="col-md-3 pt-3 pt-md-1 ">
            <Link href="/">
              <Image
                width={245}
                height={43}
                src="/images/web_pics/logo.png"
                alt="gohoardings"
                className="brand-logo-footer "
              />
            </Link>
          </div>
          <div className="col-md-9 ">
            <h4 className="f-heading pt-2 pt-md-0">
            {country === "UAE" ? "UAE's Largest" : "India's Largest"} Outdoor Advertising Company
            </h4>
            <h6 className="f-second-heading pt-1">
              Our advertising network spread across 130 cities with more than
              1.2 lakh OOH advertising and DOOH advertising sites offering
              hassel-free branding experience. As the nation&#39;s largest
              advertising agency, we craft impactful campaigns that resonate,
              inspire, and drive success for brands nationwide.
            </h6>
          </div>
        </div>
        <div className="row pt-3">
          <div className="col-md-3 col-6  py-md-3  quick-links">
            <h4 className="   f-heading">Quick Links</h4>
            <ul className="position-relative  pt-md-3  ps-0">
              <li className="py-md-2">
                {" "}
                <a
                  className=" text-decoration-none f-heading-clr  mb-0"
                  href="https://odoads.com/login"
                  target="_blank"
                >
                  Login As Media Owner
                </a>
              </li>

              <li
                className="py-md-2 text-decoration-none f-heading-clr "
                onClick={handleShow}
                id="footerPopUp"
              >
                Login As Advertiser
              </li>
              <span className="pos-absolute">
                <li className="py-md-2">
                  <a
                    href="https://www.odoads.com/"
                    target="_blank"
                    className=" text-decoration-none f-heading-clr mb-0"
                  >
                    Odoads
                  </a>
                </li>

                <li className=" text-decoration-none f-heading-clr mb-0 py-md-2">
                  <a
                    href="https://gohoardings.com/blog"
                    target="_blank"
                    className=" text-decoration-none f-heading-clr mb-0"
                  >
                    Blog
                  </a>
                </li>

                <li className="py-md-2">
                  <p
                    onClick={() => route.push("/about-us")}
                    className=" text-decoration-none f-heading-clr mb-0"
                  >
                    About Us
                  </p>{" "}
                </li>
                <li className="py-md-2">
                  <p
                    onClick={() => route.push("/team")}
                    className=" text-decoration-none f-heading-clr mb-0"
                  >
                    Team
                  </p>
                </li>
                <li className="py-md-2">
                  <p
                    onClick={() => route.push("/contact-us")}
                    className=" text-decoration-none f-heading-clr mb-0"
                  >
                    Contact
                  </p>
                </li>
                <li className="py-md-2 text-decoration-none ">
                  {" "}
                  <p
                    onClick={() => route.push("/privacy")}
                    className=" f-heading-clr mb-0"
                  >
                    Privacy Policy
                  </p>
                </li>
                <li className="py-md-2 text-decoration-none ">
                  {" "}
                  <p
                    onClick={() => route.push("/refund-policy")}
                    className=" f-heading-clr mb-0"
                  >
                    Refund Policy
                  </p>
                </li>
              </span>
            </ul>
          </div>
          <div className="col-md-3 col-6 py-md-3 popular-media">
            <h4 className="f-heading">Popular Services</h4>
            <ul className="pt-md-3 ps-0">
              {categories.map((category, i) => (
                <li
                  key={i}
                  className="py-md-2 text-decoration-none f-heading-clr"
                  onClick={() => direactMedia(category.name)}
                >
                  <Link
                    href={category.href}
                    className="text-decoration-none link"
                  >
                    <span className="f-heading-clr"> {category.name} </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-md-3  col-6  py-md-3  ">
            <h4 className="   f-heading">Trending Cities</h4>
            <ul className=" pt-md-3   ps-0 ">
              <span className="pos-absolute end-0 top-0 me-5">
                {cities.map((el, i) => (
                  <li
                    key={i}
                    className=" py-md-2  text-decoration-none f-heading-clr "
                    onClick={(e) => direactCity(el.city)}
                  >
                    <Link
                      href={`${el.href}`}
                      className="text-decoration-none link "
                    >
                      <span className="f-heading-clr"> {el.city}</span>
                    </Link>
                  </li>
                ))}
              </span>
            </ul>
          </div>

          <div className="col-md-3  col-6   py-md-3 pe-0">
            <h4 className="  f-heading">Reach us</h4>
            <ul className=" pt-md-3  ps-0">
              <li className="py-md-2 reach-clr py-md-2 py-1">
                <FiPhoneCall className="me-md-3 me-1 icon-clr drd" /> +91
                7777871717
              </li>
              <li className="py-md-2 reach-clr py-md-2 py-1">
                <BiMailSend className="me-md-3 me-1  icon-clr drd" />
                info@gohoardings.com
              </li>
              <li className="d-flex reach-clr py-md-3 py-1">
                <MdLocationOn className="me-md-3 me-1  icon-clr mt-1 drd" />{" "}
                <p className="reach-clr">
                  E-82, Sector 06
                  <br />
                  Noida, 201301 (U.P.)
                </p>
              </li>
              <div className="grid-container1 ">
                {logo.map((clients, index) => {
                  return (
                    <div className="grid-item" key={index}>
                      <a href={clients.link} target="_blank">
                        <Image
                          width={27}
                          height={27}
                          src={clients.img}
                          alt={clients.alt}
                          className="img-fluid logo-img"
                        />
                      </a>
                    </div>
                  );
                })}
              </div>
            </ul>
          </div>
        </div>
        <div className="row  payment-footer-section ">
          <div className="col text-light d-none d-md-block" id="letHide"></div>
          <div className="col text-light  mt-md-0 d-none d-md-block"></div>
          <div className="col text-light  offset-md-3 d-none d-md-block">
            <h4 className="f-heading  text-nowrap  ">
              Best deals in your inbox
            </h4>
            <form
              onSubmit={handelSubmit}
              className="d-flex  p-2 ps-md-1 pt-1 ps-0 smv"
            >
              <input
                className="text-dark border-0  p-2 cnt-input-box rounded-start mt-md-2 "
                type="email"
                value={email}
                autoComplete="off"
                placeholder="Enter you email address"
                formcontrolname="email"
                id="footer-input"
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className=" btn   w-25  border-0 rounded-0 rounded-end mt-md-2 p-0"
                type="submit"
              >
                Contact{" "}
              </button>

              <ToastContainer />
            </form>

            <h6 className=" py-0 text-muted head6">
              * Join our newsletter for the most recent information.
            </h6>
          </div>
        </div>
        <div className="row my-2 d-flex justify-content-center">
          <p className="  text-light f-heading-clr ">
            copyrights © {new Date().getFullYear()} Gohoardings Solutions LLP
          </p>
        </div>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <LoginN />
      </Modal>
      <FloatingWhatsAppComponent />
      {/* <ChatBox/>   */}
      <GoHoardingsChatbot />
      <style jsx>
        {`
          #not-work {
            color: rgb(220, 220, 220);
            font-size: 1.1rem;
          }
          cnt-input-box:focus {
            border: none;
          }
          #footer-input:focus {
            outline: none;
          }

          .footerN-content {
            background-color: #212121;
          }
          button {
            color: black;
            font-weight: 500;
            background-color: #fff323;
          }
          button:hover {
            color: black;
            font-weight: 500;
            background-color: #ede111;
          }
          .footer-branding {
            border-bottom: 2px solid #fff32c;
          }
          .brand-logo-footer {
            width: 240px;
          }
          .f-heading {
            color: #ffff;
            font-size: 1.5rem;
            font-weight: 600;
          }
          .f-second-heading {
            color: rgb(220, 220, 220);
            font-size: 1rem;
            font-weight: 400;
          }
          .f-heading-clr {
            width: fit-content;
            color: rgb(220, 220, 220);
            font-size: 1rem;
            cursor: pointer;
          }

          .f-heading-clr:hover {
            color: #fff320;
          }
          .reach-clr {
            color: rgb(220, 220, 220);
            font-size: 1rem;
          }
          li {
            list-style-type: none;
          }
          .grid-container1 {
            width: 300px;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
          }
          #footerPopUp {
            cursor: pointer;
          }
          .grid-item {
            transition: transform 0.3s;
            text-align: start;
          }
          .logo-img {
            height: 28px;
            width: 28px;
          }
          .tawk-min-container .tawk-button-circle.tawk-button-large {
            background-color: #d5d509 !important;
          }
          .grid-item:hover {
            transform: scale(1.2);
          }
          .payment-footer-section {
            margin-top: -3%;
          }

          @media screen and (max-width: 1366px) {
            .brand-logo-footer {
              width: 190px !important;
            }
            .f-heading {
              font-size: 1.5rem;
            }

            .reach-clr {
              font-size: 1.1rem;
            }
            .grid-container1 {
              width: 260px;
            }
            .grid-item {
              text-align: start;
            }
            .logo-img {
              height: 26px;
              width: 26px;
            }
          }

          @media screen and (max-width: 1024px) {
            .brand-logo-footer {
              width: 130px !important;
            }
            .f-heading {
              font-size: 1rem;
            }
            .f-second-heading {
              font-size: 0.8rem;
            }
            .f-heading-clr {
              font-size: 0.8rem;
            }
            .reach-clr {
              font-size: 0.8rem;
            }
            .grid-container1 {
              width: 230px;
            }
            .grid-item {
              text-align: start;
            }
            .logo-img {
              height: 20px;
              width: 20px;
            }
            #letHide {
              display: none;
            }
            .smv {
              height: 45px;
            }
            .head6 {
              font-size: 0.6rem;
            }
          }
          @media screen and (max-width: 600px) {
            .grid-container1 {
              width: 45vw;
            }
            .grid-item {
              text-align: start;
            }
            .logo-img {
              height: 18px;
              width: 18px;
            }
          }
        `}
      </style>
    </>
  );
};

export default Footer;
