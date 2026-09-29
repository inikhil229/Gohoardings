import React, { useContext, useState, useEffect, useCallback } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useRouter } from "next/router";
import { AccountContext } from "@/allApi/apicontext";
import styles from "../../styles/navbarHome.module.scss";
import dynamic from "next/dynamic";
import { removeCookies, setCookie, getCookie } from "cookies-next";
import Image from "next/image";
import instance from "@/allApi/axios";
import { Dropdown } from "react-bootstrap";

const COUNTRY_DATA = {
  IN: { code: "IN", name: "India", flag: "/images/flags/in.png", locale: "in"},
  AE: { code: "AE", name: "UAE", flag: "/images/flags/uae.png" ,locale: "ae"},
  // US: { code: "ZA", name: "South Africa", flag: "/images/flags/usa.png" },
};

const NavbarH = () => {
  const route = useRouter();
  const { handleClose, handleShow } = useContext(AccountContext);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_DATA.IN);

  const getMap = async () => {
    const { data } = await instance.get(`forgetPass`);
    if (data.message == "InValid Token") {
      handleShow();
    } else {
      removeCookies("page_title");
      removeCookies("state_name");

      route.push("/map");
    }
  };
  const Userdetail = dynamic(() => import("./userdetail"), {
    ssr: false,
  });

  const changeLocale = (locale) => {
    setCookie("NEXT_LOCALE", locale, { path: "/" });
    route.replace(route.asPath, undefined, { locale });
  };

  useEffect(() => {
    const savedCountryCode = getCookie("selected_country");

    if (savedCountryCode && COUNTRY_DATA[savedCountryCode]) {
      setSelectedCountry(COUNTRY_DATA[savedCountryCode]);
      changeLocale(COUNTRY_DATA[savedCountryCode].locale);
      fetchDataForCountry(savedCountryCode);
    }
  }, []);

  // Function to fetch data for the selected country
  const fetchDataForCountry = async (countryCode) => {
    try {
      const response = await getCountrySpecificData(countryCode);
      setSelectedCountry(response);
    } catch (error) {
      console.error("Error fetching country data:", error);
    }
  };

  // Handle country change and refresh the page
  const handleCountryChange = useCallback((countryCode) => {
    if (COUNTRY_DATA[countryCode]) {
      setCookie("selected_country", countryCode, { path: "/" });
      setSelectedCountry(COUNTRY_DATA[countryCode]);
      changeLocale(COUNTRY_DATA[countryCode].locale);
      window.location.href = "/";
    }
  }, []);

  return (
    <div>
      <Navbar expand={`lg px-md-0 pb-0 ${styles.fixd_nabar} sdsd`}>
        <div className="navbar container-xxl  container-xl container-lg container-md">
          <Navbar.Brand>
            <Image
              width={223}
              height={42}
              src="/images/web_pics/logo.png"
              className={styles.rand_logo}
              alt="gohoardings"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="" />
          <Navbar.Collapse id={styles.basic_navbar_nav}>
            <Nav className=" ms-auto ">
              <Nav.Link
                className={`me-2  me-md-0   ${styles.nav_text_btn}  text-center`}
                href="https://influencersea.com/"
                target="_blank"
              >
                Influencer marketing
              </Nav.Link>
              <Nav.Link
                className={`me-2  me-md-0   ${styles.nav_text_btn}  text-center`}
                href="https://odoads.com/"
                target="_blank"
              >
                Odoads
              </Nav.Link>
              <Nav.Link
                className={`me-2  me-md-0   ${styles.nav_text_btn}  text-center`}
                href="https://blog.gohoardings.com/"
                target="_blank"
              >
                Blog
              </Nav.Link>
              <Nav.Link
                className={`me-3  me-md-0   ${styles.nav_text_btn}  text-center`}
                onClick={() => route.push("/contact-us")}
              >
                Contact
              </Nav.Link>

              <Nav.Link
                className={`ms-2  me-md-0   ${styles.nav_text_btn}  text-center`}
                onClick={getMap}
              >
                Map View
              </Nav.Link>
              <form className="  text-center me-3">
                {/* Country Dropdown */}
                <Dropdown className={styles.countryDropdown}>
                  <Dropdown.Toggle
                    variant="light"
                    className={styles.flagButton}
                  >
                    <Image
                      src={selectedCountry.flag}
                      width={24}
                      height={16}
                      alt={selectedCountry.name}
                    />{" "}
                    {selectedCountry.name}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {Object.values(COUNTRY_DATA).map((country) => (
                      <Dropdown.Item
                        key={country.code}
                        onClick={() => handleCountryChange(country.code)}
                      >
                        <Image
                          src={country.flag}
                          width={20}
                          height={14}
                          alt={country.name}
                        />{" "}
                        {country.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </form>
              <div
                className={`  me-md-0   ${styles.fixed_login}  text-center `}
              >
                <Userdetail />
              </div>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>
    </div>
  );
};

export default NavbarH;
