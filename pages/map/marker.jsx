import React, { useEffect, useState } from "react";
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import Link from "next/link";
import Streetview from "./streetview";
import styles from "../../styles/markers.module.scss";
import { markersPosition } from "@/allApi/apis";
import Loader from "@/components/loader";
import Image from "next/image";

const Markers = ({
  markers,
  nsearch,
  setSearch,
  removefromCart,
  addonCart,
  More,
}) => {
  const [map, setMap] = useState(null);
  const [hasmarker, sethasmarker] = useState(false);
  const [combinedArray, setCombinedArray] = useState([]);

  if (markers) {
    markers.forEach((e) => {
      e["position"] = {
        lat: parseFloat(e.latitude),
        lng: parseFloat(e.longitude),
      };
    });
  }

  var center = {
    lat: markers?.[0].latitude,
    lng: markers?.[0].longitude,
  };

  const updateCombinedArray = () => {
    if (nsearch) {
      const newArray = [].concat(...nsearch);
      newArray.forEach((e) => {
        e["position"] = { lat: e.lat, lng: e.lng };
      });
      setCombinedArray(newArray);
    }
  };

  const [activeMarker, setActiveMarker] = useState(null);

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };
 

 
  const handleOnLoad = (map) => {
    if(markers){
    setMap(map);
    const bounds = new window.google.maps.LatLngBounds();
    markers.forEach(({ position }) => bounds.extend(position));
    map.fitBounds(bounds);
  }
  };

  const onBoundsChanged = async () => {
    if (map) {
      const mapThing = map;
      const bounds = mapThing.getBounds();
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      const data = await markersPosition(
        ne.lat(),
        sw.lat(),
        ne.lng(),
        sw.lng()
      );
      if (data.length > 0) {
        setSearch(data);
      }
    }
  };
  const customMapStyle = [
    {
      featureType: "landscape.man_made",
      elementType: "geometry",
      stylers: [
        {
          color: "#f7f1df",
        },
      ],
    },
    {
      featureType: "landscape.natural",
      elementType: "geometry",
      stylers: [
        {
          color: "#d0e3b4",
        },
      ],
    },
    {
      featureType: "landscape.natural.terrain",
      elementType: "geometry",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi.business",
      elementType: "all",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi.medical",
      elementType: "geometry",
      stylers: [
        {
          color: "#fbd3da",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [
        {
          color: "#bde6ab",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#ffe15f",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#efd151",
        },
      ],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#ffffff",
        },
      ],
    },
    {
      featureType: "road.local",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "black",
        },
      ],
    },
    {
      featureType: "transit.station.airport",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#cfb2db",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          color: "#a2daf2",
        },
      ],
    },
  ];

  const [streetView, setStreetView] = useState(false);
  const [latitude, setLatitude] = useState();
  const [longitude, setlongitude] = useState();

  const onStreet = (latitude, longitude) => {
    setlongitude(longitude);
    setLatitude(latitude);
    setStreetView(!streetView);
  };
  const closeKeyword = () => {
    setStreetView(!streetView);
    setActiveMarker(null);
    sethasmarker(false);
  };

  useEffect(() => {
    if (markers?.[markers.length - 1].position) {
      sethasmarker(true);
    }
  }, [streetView]);

  useEffect(() => {
    updateCombinedArray();
  }, [nsearch]);
  return (
    <>
      {streetView ? (
        <Streetview
          latitude={latitude}
          longitude={longitude}
          closeKeyword={closeKeyword}
        />
      ) : (
        <>
          <GoogleMap
            onLoad={handleOnLoad}
            zoom={"8"}
            onClick={() => setActiveMarker(null)}
            mapContainerStyle={{ height: "100%" }}
            center={center}
            options={{
              styles: customMapStyle,
            }}
            streetView={activeMarker}
          >
            <div className={`${styles.this_area} d-flex`}>
              <button
                className={styles.this_area_button}
                onClick={() => onBoundsChanged()}
              >
                Search in this area
              </button>
              <button
                className={styles.this_area_button}
                onClick={() => More()}
              >
                Load more
              </button>
            </div>
            {/* <button className={`${styles.this_area} `} onClick={onBoundsChanged} >Search in this area</button> */}
            {!hasmarker ? (
              <Loader />
            ) : (
              markers.map((marker) => (
                <Marker
                  key={marker.id}
                  icon={
                    marker.isDelete === 0
                      ? "/images/web_pics/placeholder2.png"
                      : "/images/web_pics/placeholder.png"
                  }
                  position={marker.position}
                  onClick={() => handleActiveMarker(marker.id)}
                >
                  {activeMarker === marker.id ? (
                    <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                      <div className={styles.infoWindow}>
                        <div className={styles.media_image}>
                          <Link
                            href={`/seedetails/${marker.category_name}/${marker.page_title}/${marker.code}`}
                            className="text-decoration-none"
                          >
                            <Image
                              width={500}
                              height={500}
                              src={
                                marker.thumb.startsWith("https")
                                  ? marker.thumb
                                  : `https://${marker.mediaownercompanyname
                                      .trim()
                                      .split(" ")
                                      .slice(0, 2)
                                      .join("_")
                                      .toLowerCase()}.odoads.com/media/${marker.mediaownercompanyname
                                      .trim()
                                      .split(" ")
                                      .slice(0, 2)
                                      .join("_")
                                      .toLowerCase()}/media/images/new${marker.thumb}`
                              }
                              alt="About media"
                              className="rounded-top"
                              id={styles.mark_img}
                            />
                          </Link>
                        </div>

                        <div className={`${styles.info_window} bg-white`}>
                          <Link
                            href={`/seedetails/${marker.category_name}/${marker.page_title}/${marker.code}`}
                            className="text-decoration-none"
                          >
                            <h5 className=" text-dark">
                              {marker.illumination + "-" + marker.medianame}
                            </h5>
                          </Link>
                          <p>
                            <span>Media Type : </span>
                            {marker.subcategory}
                          </p>
                          <p>
                            <span>Height X Width : </span>
                            {marker.height} X {marker.width} feet
                          </p>

                          <p>
                            <span>FTF : </span>
                            {marker.ftf}
                          </p>
                          <Image
                            width={500}
                            height={500}
                            src="/images/web_pics/streetv.gif"
                            className={styles.streetv}
                            onClick={(e, i) => onStreet(marker.latitude, marker.longitude)}
                          />

                          {marker.isDelete === 0 ? (
                            <Image
                              width={500}
                              height={500}
                              src="/images/web_pics/A-chek.png"
                              onClick={() => removefromCart(marker.code)}
                              className={`${styles.addonCart} icon-clr ${styles.sitemark} `}
                              alt="check_button"
                            />
                          ) : (
                            <Image
                              width={500}
                              height={500}
                              alt="cart_icon"
                              src="/images/web_pics/A-cart.png"
                              onClick={() => addonCart(marker)}
                              className={`${styles.addonCart} icon-clr ${styles.sitemark} `}
                            />
                          )}
                        </div>
                      </div>
                    </InfoWindow>
                  ) : null}
                </Marker>
              ))
            )}
            {combinedArray.map(
              ({ id, position, name, Type, city_name, photo }) => (
                <Marker
                  key={id}
                  icon={"/images/web_pics/restaurant.png"}
                  position={position}
                  onClick={() => handleActiveMarker(id)}
                >
                  {activeMarker === id && (
                    <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                      <div className={styles.infoWindow}>
                        <div className={styles.media_image}>
                          <Image
                            width={500}
                            height={500}
                            src={
                              `https://maps.googleapis.com/maps/api/place/photo?photoreference=` +
                              photo +
                              `&sensor=false&maxheight=210&maxwidth=330&key=AIzaSyDEKx_jLb_baUKyDgkXvzS_o-xlOkvLpeE`
                            }
                            alt=""
                            srcset=""
                            onError={(e) =>
                              (e.target.src = "/images/web_pics/alter-img.png")
                            }
                          />
                        </div>
                        <br />
                        <p className="mb-2">Name : {name}</p>
                        <p className="mb-2">Type : {Type}</p>
                        <p className="mb-2">City : {city_name}</p>
                      </div>
                    </InfoWindow>
                  )}
                </Marker>
              )
            )}
          </GoogleMap>
        </>
      )}
    </>
  );
};

export default Markers;
