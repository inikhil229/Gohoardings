import React from "react";
import Link from "next/link";
import { MdOutlineSearch, MdMenu } from "react-icons/md";
import { useEffect, useState, useCallback } from "react";
import styles from "../../styles/mobileNav.module.scss";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Image from "next/image";
// import { Dropdown } from "bootstrap";
import { Dropdown } from "react-bootstrap";
import { removeCookies, setCookie, getCookie } from "cookies-next";

const COUNTRY_DATA = {
  IN: { code: "IN", name: "India", flag: "/images/flags/in.png", locale: "in" },
  AE: { code: "AE", name: "UAE", flag: "/images/flags/uae.png", locale: "ae" },
  // US: { code: "ZA", name: "South Africa", flag: "/images/flags/za.png" },
};
const Mobilenav = () => {
  const route = useRouter();
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_DATA.IN);
  const Userdetail = dynamic(() => import("./userdetail"), {
    ssr: false,
  });

  const changeLocale = (locale) => {
    setCookie("NEXT_LOCALE", locale, { path: "/" });
    route.replace(route.asPath, undefined, { locale });
  };
  // Load selected country from cookie on mount
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
    <div className="mbilview ">
      <div className={`${styles.mobilenav} fixed-top p-2 `}>
        <div className="pt-1">
          <Image
            width={50}
            height={35}
            alt="gohoardings"
            src="/images/web_pics/logo.png"
            className={`${styles.navbrand} `}
            onClick={() => route.push("/")}
          />
        </div>
        <div className="pt-1 d-flex">
          <div className="mt-1 me-2">
            <Dropdown className={styles.countryDropdown}>
              <Dropdown.Toggle variant="light" className={styles.flagButton}>
                <Image
                  src={selectedCountry.flag}
                  width={24}
                  height={16}
                  alt={selectedCountry.name}
                />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {Object.values(COUNTRY_DATA).map((country) => (
                  <Dropdown.Item
                    key={country.code}
                    onClick={() => handleCountryChange(country.code)}
                  >
                    <Image
                      src={country.flag}
                      width={24}
                      height={16}
                      alt={country.name}
                      className="me-2"
                    />
                    {country.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className="mt-1 me-2">
            <Userdetail />
          </div>
          <div
            className=""
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasScrolling"
            aria-controls="offcanvasScrolling"
          >
            <MdMenu className={`${styles.search_logo} `} />
          </div>
        </div>
      </div>

      <div
        className="offcanvas offcanvas-start"
        data-bs-scroll="true"
        data-bs-backdrop="false"
        tabIndex="-1"
        id="offcanvasScrolling"
        aria-labelledby="offcanvasScrollingLabel"
      >
        <div className="offcanvas-header">
          <Image
            width={50}
            height={30}
            alt="gohoardings"
            src="/images/web_pics/logo.png"
            className={`${styles.navbrand} m-1 mt-0`}
            onClick={() => route.push("/")}
          />
          <button
            type="button"
            className="btn-close "
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className="list-group list-group-flush">
            <li
              className="list-group-item"
              data-bs-dismiss="offcanvas"
              onClick={() => route.push("https://blog.gohoardings.com/")}
            >
              Blogs
            </li>
            <li
              className="list-group-item"
              data-bs-dismiss="offcanvas"
              onClick={() => route.push("https://influencersea.com/")}
            >
              Influencer marketing
            </li>
            <li
              className="list-group-item"
              data-bs-dismiss="offcanvas"
              onClick={() => route.push("/contact-us")}
            >
              Contact Us
            </li>
            <li
              className="list-group-item"
              data-bs-dismiss="offcanvas"
              onClick={() => route.push("/about-us")}
            >
              About Us
            </li>
            <li
              className="list-group-item"
              data-bs-dismiss="offcanvas"
              onClick={() => route.push("/media-and-news")}
            >
              News & Media
            </li>
            <li
              className="list-group-item"
              data-bs-dismiss="offcanvas"
              onClick={() => route.push("/faqs")}
            >
              FAQs
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Mobilenav;
