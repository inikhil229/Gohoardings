import React, { useState } from "react";
import { BiCurrentLocation } from "react-icons/bi";
import styles from "../styles/searchmedia.module.scss";
import axios from "axios";

const Citylocation = ({ InputGroup, setValue }) => {
  const [loading, setLoading] = useState(false);

  const data = async () => {
    setLoading(true);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser or requires HTTPS.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        const options = {
          method: "GET",
          url: "https://geocodeapi.p.rapidapi.com/GetNearestCities",
          params: { latitude: lat, longitude: long, range: "0" },
          headers: {
            "X-RapidAPI-Key":
              "f42c4a8dd6msh221d0cad4302dfap1c8219jsn7ad70aeb7432",
            "X-RapidAPI-Host": "geocodeapi.p.rapidapi.com",
          },
        };
        axios
          .request(options)
          .then(function (response) {
            const city = response.data[0];
            setValue(city.City);
            setLoading(false);
          })
          .catch(function (error) {
            console.error("Geocoding error:", error);
            setLoading(false);
            return false;
          });
      },
      function (error) {
        console.error("Geolocation error:", error);
        alert("Unable to retrieve your location. Check your browser permissions.");
        setLoading(false);
      }
    );
  };

  return (
    <>
      <InputGroup.Text
        className={styles.basic_addon}
        onClick={data}
        disabled={loading}
      >
        {loading ? (
          <span
            className={`spinner-border spinner-border-sm  icon-clr`}
            role="status"
            aria-hidden="true"
          ></span>
        ) : (
          <BiCurrentLocation
            className={`${styles.basic_addon_icon} icon-clr`}
          />
        )}
      </InputGroup.Text>
    </>
  );
};

export default Citylocation;
