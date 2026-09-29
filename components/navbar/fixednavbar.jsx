/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState ,useCallback,useMemo} from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { getAllCity } from "@/allApi/apis";
import { DropdownButton } from "react-bootstrap";
import { CityNameImage } from "@/allApi/apis";
import { MdOutlineSearch, MdLocationPin } from "react-icons/md";
import { Dropdown } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { removeCookies, setCookie, getCookie } from "cookies-next";
import styles from "../../styles/fixedNavbar.module.scss";
import NavbarDropdown from "./dropdown";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";

const Userdetail = dynamic(() => import("./userdetail"), {
  ssr: false,
});
const COUNTRY_DATA = {
  IN: { code: "IN", name: "India", flag: "/images/flags/in.png" ,locale: "in"},
  AE: { code: "AE", name: "UAE", flag: "/images/flags/uae.png",locale: "ae" },
  // US: { code: "ZA", name: "South Africa", flag: "/images/flags/za.png" },
};

const Fixednavbar = () => {
  const [city, setCity] = useState([]);
  const [posts, setPosts] = useState();
  const [focus, setFocus] = useState(false);
  const [value, setValue] = useState("");
  const [userType, setUserType] = useState("");
  const [userPath, setUserPath] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_DATA.IN);

  const route = useRouter();

  const { pathname } = useRouter();
  
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
  
  const getMap = () => {
    removeCookies("page_title");
    removeCookies("state_name");
    route.push("/map");
  };

  let selecType;
  CityNameImage.map((el) => {
    if (el.value == userType) {
      selecType = el.label;
    }
  });

  const onChange = async (event) => {
    setValue(event.target.value);
    const cities = event.target.value;
    const data = await getAllCity(cities);
    setCity(data);
  };

  const mavigatetoMediaPage = (userType, value) => {
    if (pathname === "/map" && userType.length > 3 && value.length > 2) {
      setCookie("category_name", userType);
      removeCookies("page_title");
      removeCookies("state_name");
      setCookie("city_name", value);
      route.push(`/map`);
    } else if (userType.length > 3 && value.length > 2) {
      setCookie("category_name", userType);
      setCookie("city_name", value);
      CityNameImage.forEach((el) => {
        el.value2 = el.value === userType ? true : false;
      });
      route.push(`/${userType}/${value}`);
    }
  };

  const onSearch = (searchTerm) => {
    setValue(searchTerm);
    setFocus(false);
  };

  function handleMouseEnter() {
    setShowMenu(true);
  }

  function handleMouseLeave() {
    setShowMenu(false);
  }

  return (
    <div className="fixed-top mb-2">
      <Navbar
        expand={`lg px-md-0 p-1 m-0 border-0 ${styles.navbar_main_floating}`}
      >
        <div className={styles.sss}></div>

        <Navbar.Brand
          id={styles.home}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className={`${styles.nav_icon_6} me-3`} aria-expanded={showMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <Image
            width={100}
            height={35}
            alt="gohoardings"
            src="/images/web_pics/logo.png"
            className={`border-0 brand ${styles.float_brand} ms-2`}
            onClick={() => route.push("/")}
          />
          <div className={`dropdown-menu ${showMenu ? "show" : ""} p-0 m-0`}>
            <NavbarDropdown />
          </div>
          <style jsx>{`
            .dropdown-menu.show {
              display: block;
            }
          `}</style>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="me-3" />
        <Navbar.Collapse id={styles.basic_navbar_nav}>
          <Nav className={`navbar-nav mx-auto  ${styles.search_inner_drop} `}>
            <InputGroup className=" me-3">
              <Form.Control
                placeholder="Search your location"
                aria-describedby="basic-addon1"
                autoComplete="off"
                onChange={onChange}
                value={value}
                onFocus={() => setFocus(true)}
                id={styles.search_location_box}
              />
            </InputGroup>

            <div
              className={
                focus
                  ? "dropdown-menu border-0 show  mt-5  ms-0"
                  : "dropdown-menu "
              }
              id={styles.xyz}
            >
              {city.map((item, i) => (
                <div
                  className={`${styles.border_1} rounded-3`}
                  key={i}
                  onClick={() => onSearch(item.name)}
                >
                  <option value={item.name} className=" text-light mt-1 ps-3 ">
                    {item.name}
                  </option>
                </div>
              ))}
            </div>
            <div className="p-0 m-0 fnav ms-3" onFocus={() => setFocus(false)}>
              <DropdownButton
                title={userType ? selecType : "Select your media type"}
                id={styles.select_media_box}
                onSelect={(e) => setUserType(e)}
              >
                {CityNameImage.map((el, i) => (
                  <Dropdown.Item
                    eventKey={el.value}
                    className="p-2 mt-0 text-light"
                    key={i}
                  >
                    <span className={`${styles.select_media_icon} text-light`}>
                      {" "}
                      {el.icon}{" "}
                    </span>
                    {el.label}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </div>
            {userType && value ? (
              <Button
                className="ms-3"
                onClick={(a, b) => mavigatetoMediaPage(userType, value)}
                id={styles.search_button_flotnav}
              >
                <MdOutlineSearch className={`${styles.search_logo} icon-clr`} />
              </Button>
            ) : (
              <Button
                className={`ms-3 ${styles.float_btn_notalowed}`}
                id={styles.search_button_flotnav}
              >
                <MdOutlineSearch
                  className={`${styles.search_logo} icon-clr ${styles.float_btn_notalowed}`}
                />
              </Button>
            )}
          </Nav>
          <form className="  text-center me-3">
            {/* Country Dropdown */}
            <Dropdown className={styles.countryDropdown}>
            <Dropdown.Toggle variant="light" className={styles.flagButton}>
              <Image src={selectedCountry.flag} width={24} height={16} alt={selectedCountry.name} /> {selectedCountry.name}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {Object.values(COUNTRY_DATA).map((country) => (
                <Dropdown.Item key={country.code} onClick={() => handleCountryChange(country.code)}>
                  <Image src={country.flag} width={20} height={14} alt={country.name} /> {country.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          </form>

          <form className="  text-center me-3">
            <Nav.Link
              className={`${styles.mapLink} ${styles.float_map_btn}   p-0 rounded-pill pt-1`}
              onClick={getMap}
            >
              Map
              <MdLocationPin
                className={`${styles.GiHamburgerMenu} ps-0 p-0  ms-0`}
              />
            </Nav.Link>
          </form>

          <form className="text-center">
            <Userdetail />
          </form>

          <div className={styles.sss}></div>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Fixednavbar;
