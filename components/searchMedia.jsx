import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { CityNameImage, getAllCity } from "@/allApi/apis";
import MediaDropDown from "../components/mediaDropdown";
import Citylocation from "../components/cityLocation";
import { useRouter } from "next/router";
import styles from "../styles/searchmedia.module.scss";
import { setCookie, getCookie } from "cookies-next"; // Import getCookie to retrieve cookie value

const Searchmedia = () => {
  const [city, setCity] = useState([]);
  const [value, setValue] = useState("");
  const [focus, setFocus] = useState(false);
  const [userType, setUserType] = useState("");
  const [country, setCountry] = useState("India"); // Default to India
  const route = useRouter();

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

  const onChange = async (e) => {
    setValue(e.target.value);
    const cities = e.target.value;
    const data = await getAllCity(cities);
    setCity(data);
  };

  const mavigatetoMediaPage = (userType, value) => {
    if (userType.length > 3 && value.length > 2) {
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

  return (
    <>
      <div
        className={`${styles.search_media_content} container-xxl container-xl container-lg container-md mb-4 ms-xs-3`}
      >
        <div className="row mt-5 mt-md-0">
          <div className="col-md-8 ps-2 ps-md-0">
            <div className={`${styles.heading_text} mt-4`}>
              <h2>{country === "UAE" ? "UAE's Largest" : "India's Largest"}</h2>
              <h1>
                Outdoor Advertising <br />
                Agency
              </h1>
              <h6 className="pt-2">
                OOH Advertising made easy Search
                <br />
                Media. Check Availability. Book Online.
              </h6>
            </div>
            <div className={`${styles.mnc} mt-4 ms-2 ms-md-0`}>
              <a className="text-decoration-none">
                <button
                  className={`${styles.button}`}
                  onClick={() => route.push(`/contact-us`)}
                >
                  <span>Enquire now</span>
                </button>
              </a>
            </div>
          </div>
          <div className="col-md-4 text-center p-md-0 d-none d-md-block">
            <img
              width={420}
              height={370}
              alt="home-img"
              src="/images/web_pics/cloud_gif.gif"
              className={styles.search_media_img}
            />
          </div>
        </div>
        <section className="serchm">
          <div className="container-fluid mt-5 pt-2 px-5 m-0 ">
            <div className={`${styles.search_container} row mx-auto mb-5 p-1`}>
              <div className="col-md-5 p-0 me-0 pe-0">
                <div className={styles.search_location}>
                  <div className={styles.search_inner}>
                    <InputGroup className="" id="input-click">
                      <Citylocation
                        InputGroup={InputGroup}
                        setValue={setValue}
                      />
                      <Form.Control
                        autoComplete="off"
                        placeholder="Search your location"
                        aria-describedby="basic-addon1"
                        onChange={(e) => onChange(e)}
                        value={value}
                        onFocus={() => setFocus(true)}
                        // onBlur={() => setFocus(false)}

                        className={styles.search_location_box}
                      />
                    </InputGroup>
                  </div>
                  <div
                    className={
                      focus
                        ? `${styles.dropdown_menu_location} dropdown-menu  border-0 show ps-3 p-1`
                        : "dropdown-menu"
                    }
                    id={styles.abcd}
                  >
                    {city.map((item, i) => (
                      <div
                        key={i}
                        className={styles.border_1}
                        onClick={() => onSearch(item.name)}
                      >
                        <option value={item.name} className=" text-dark mt-1">
                          {item.name}
                        </option>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div
                className="col-md-5 ps-0 ms-0 pt-2 pb-md-2 pe-0 pe-md-2"
                onFocus={() => setFocus(false)}
              >
                <MediaDropDown userType={userType} setUserType={setUserType} />
              </div>
              <div className="col-md-2 ps-0 pt-2 pb-2 pe-0 pe-md-2">
                {userType && value ? (
                  <button
                    className={styles.search_btn}
                    onClick={(a, b) => mavigatetoMediaPage(userType, value)}
                  >
                    Search
                  </button>
                ) : (
                  <button
                    className={`${styles.search_btn} ${styles.search_btnNot}`}
                  >
                    Search
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Searchmedia;
