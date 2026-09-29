import React, { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import styles from '../../styles/markers.module.scss'
const GoogleStreetView = dynamic(() => import('react-google-streetview'), {
  ssr: false
});

const Streetview = ({latitude, longitude, closeKeyword}) => {

    const googleMapsApiKey = "AIzaSyDEKx_jLb_baUKyDgkXvzS_o-xlOkvLpeE"

    const streetViewPanoramaOptions = {
      position: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
      pov: { heading: 100, pitch: 0 },
      zoom: 1,
      addressControl: false,
      showRoadLabels: false,
      zoomControl: true
    };

    return (
      <div className="container-fluid h-100 p-0">
  
      <button className={`${styles.back_map}  p-2`} onClick={closeKeyword}>Back</button>

   
        {latitude != undefined && 
        <GoogleStreetView
        apiKey={googleMapsApiKey}
        streetViewPanoramaOptions={streetViewPanoramaOptions}
      />
        }
      </div>
    );
  };

export default Streetview