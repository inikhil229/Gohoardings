import React, { useContext, useEffect, useState, useCallback } from "react";
import { AccountContext } from "@/allApi/apicontext";
import styles from "../../styles/map.module.scss";
import { useJsApiLoader } from "@react-google-maps/api";
import Markers from "./marker";
import Image from "next/image";

import {
  addItem,
  mediaDataApi,
  singlemnedia,
  removeItem,
  mediaApi,
  statemediaApi,
} from "@/allApi/apis";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import dynamic from "next/dynamic";
const Fixednavbar = dynamic(() => import("@/components/navbar/fixednavbar"), {
  ssr: false,
});

import Filters from "./filters";
import Loader from "@/components/loader";

const Map = () => {
  const router = useRouter();
  const [search, setSearch] = useState([]);
  const [nsearch, setNsearch] = useState([]);
  const { state, addRemove } = useContext(AccountContext);
  const [noOfLogo, setnoOfLogo] = useState(8);
  const { handleClose, handleShow } = useContext(AccountContext);
  var slice;
  if (search.success != false) {
    slice = search.slice(0, noOfLogo);
  }

  const city_name = getCookie("city_name");
  const state_name = getCookie("state_name");
  const category_name = getCookie("category_name");
  const page_title = getCookie("page_title");
 const code = getCookie("item_code");

  const getData = async () => {
    if (state_name) {
      const pages = noOfLogo + 8;

      const data = await statemediaApi(state_name, pages);
      setSearch(data);
    } else if (page_title && code) {
      const data = await singlemnedia(page_title, category_name,code);
      setSearch(data);
    } else if (category_name) {
      const data = await mediaDataApi(category_name, city_name);
      setSearch(data);
    } else {
      const pages = noOfLogo + 8;
      const data = await mediaApi("tradition-ooh-media", pages);
      setSearch(data);
    }
  };

  const [mapMarker, setPosts] = useState([]);

  const addonCart = async (e) => {
    const data = await addItem(e);
    if (data.message == "Login First") {
      handleShow();
    } else {
      addRemove({ type: "INCR" });
      add(code);
    }
  };

  const removefromCart = async (obj) => {
    const data = await removeItem(obj);
    if (data.message == "Done") {
      addRemove({ type: "DECR" });
      remove(obj);
    }
  };
  const add = (code) => {
    let temp = [...slice];
    temp.forEach((obj) => {
      if (obj.code == code) {
        obj.isDelete = 0;
      }
      setPosts(temp);
    });
  };

  const remove = (code) => {
    let temp = [...slice];
    let data = temp;
    temp.forEach((element) => {
      if (element.code == code) {
        element.isDelete = 1;
      }
      setPosts(data);
    });
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDEKx_jLb_baUKyDgkXvzS_o-xlOkvLpeE",
  });

  const More = async () => {
    if (search.length >= noOfLogo) {
      await setnoOfLogo(noOfLogo + 6);
    }
  };

  const value = getCookie("permissions");
  useEffect(() => {
    value ? router.push("/map") : (router.push("/"), handleShow());
  }, []);

  useEffect(() => {
    getData();
  }, [city_name, category_name]);

  useEffect(() => {
    getData();
  }, [noOfLogo]);

  return (
    <>
      <Fixednavbar />
      <div
        className="container-fluid animate__animated  animate__fadeIn"
        id={styles.map_body}
      >
        {search.success != false ? (
          <>
            <div
              className={` p-2 ps-4 pe-4 ${styles.filter_section} d-flex map-filter-drop`}
            >
              <Filters
                search={slice}
                setSearch={setSearch}
                setNsearch={setNsearch}
              />
            </div>

            <div className="row" id={styles.map_view_row}>
              <div className=" p-4 pt-2" id={styles.map_view}>
                {!mapMarker.length > 0 ? (
                  isLoaded && slice && slice.length > 0 ? (
                    <Markers
                      markers={slice}
                      nsearch={nsearch}
                      setSearch={setSearch}
                      removefromCart={removefromCart}
                      addonCart={addonCart}
                      More={More}
                    />
                  ) : (
                    <>
                      <Loader />
                    </>
                  )
                ) : (
                  <Markers
                    markers={slice}
                    removefromCart={removefromCart}
                    addonCart={addonCart}
                    More={More}
                  />
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="container ">
            <div className={`${styles.no_data} row  text-center my-3`}>
              <Image
                width={500}
                height={500}
                src="../../../images/web_pics/no-data.png"
                alt="No Data Found"
                className=""
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Map;
