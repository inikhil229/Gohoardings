import Fixednavbar from "@/components/navbar/fixednavbar";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { CityNameImage, mediaDataApi } from "@/allApi/apis";
import MainUi from "@/components/mediaComponents/MainUi";
import dynamic from "next/dynamic";

const Media = (props) => {
  const ErrorPage = dynamic(() => import("../404"));
  const Metatag = props.MetaKeys;
  const Media_content = props.Media_content;
  const Canonicaltag = props.currentPageUrl;
  const router = useRouter();
  const [value, setValue] = useState("");
  const [focus, setFocus] = useState(false);
  const [search, setSearch] = useState([]);
  const [locationData, setlocationData] = useState([]);
  const [mediaData, setMediadata] = useState([]);
  const [categoryData, setcategoryData] = useState([]);
  const [noOfLogo, setnoOfLogo] = useState(16);
  const [isLoading, setIsLoading] = useState(false);
  const { category_name, city } = router.query;

  const SelectServc = async (obj) => {
    CityNameImage.forEach((el) => {
      el.value2 = el.value === obj.value ? true : false;
    });
    router.push(`/${obj.value}/${city}`);
  };

  const getData = async () => {
    setIsLoading(true);
    const data = await mediaDataApi(category_name, city);
    setSearch(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
    apiforFillters();
  }, [category_name, city]);

  const onSearch = async (searchCity) => {
    const lowercaseCity = searchCity.toLowerCase();
    setIsLoading(true);
    setValue(searchCity);
    const data = await mediaDataApi(category_name, searchCity);
    setSearch(data);
    setFocus(false);
    router.push(`/${category_name}/${lowercaseCity}`);
    setIsLoading(false);
  };

  const apiforFillters = async () => {
    setIsLoading(true);
    const data = await mediaDataApi(category_name, city);
    setMediadata(data);
    setlocationData(data);
    setcategoryData(data);
    setIsLoading(false);
  };

  const validCategories = [
    "traditional-ooh-media",
    "digital-media",
    "office-branding",
    "billboard",
    "digital-billboard",
    "mall-media",
    "lift-branding",
    "transit-media",
    "airport-media",
    "inflight-media",
    "delhi",
    "noida",
    "pune",
    "chennai",
    "bengaluru",
    "mumbai",
    "hyderabad",
  ];
  useEffect(() => {
    CityNameImage.forEach((el) => {
      el.value2 = el.value === category_name ? true : false;
    });
    setValue(city);
  }, [city]);
  const hotjarTrackingCode = `(function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:3792413,hjsv:6};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`;
  if (validCategories.includes(category_name)) {
    return (
      <>
        <Head>
          {Metatag.map((el, ind) => {
            if (category_name === el.value) {
              return (
                <React.Fragment key={ind}>
                  <link
                    key={ind}
                    rel="canonical"
                    href={`https://www.gohoardings.com${Canonicaltag}`}
                  />
                  <title key={ind}>{el.page_titel}</title>
                  <meta key={ind} charSet="utf-8" />
                  <meta
                    key={ind}
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                  />
                  <meta key={ind} name="theme-color" content="#000000" />
                  <meta key={ind} name="description" content={el.page_decri} />
                  <meta
                    key={ind}
                    name="google-site-verification"
                    content="fLT70DRZGdH5FUdrS8w1k2Zg_VTzNJGDF9ie9v4FAzM"
                  />
                  <meta key={ind} name="keywords" content={el.meta_keyword} />
                </React.Fragment>
              );
            }
          })}
          <script dangerouslySetInnerHTML={{ __html: hotjarTrackingCode }} />
        </Head>
        <Fixednavbar />
        <MainUi
          noOfLogo={noOfLogo}
          setnoOfLogo={setnoOfLogo}
          categoryData={categoryData}
          mediaData={mediaData}
          locationData={locationData}
          setSearch={setSearch}
          category_name={category_name}
          search={search}
          onSearch={onSearch}
          SelectServc={SelectServc}
          value={value}
          focus={focus}
          serviceIcon={CityNameImage}
          city={city}
          isLoading={isLoading}
          setValue={setValue}
          setFocus={setFocus}
          Media_content={Media_content}
        />
      </>
    );
  } else {
    return (
      <>
        <ErrorPage />
      </>
    );
  }
};

Media.getInitialProps = async ({ req, res, query }) => {
  let currentPageUrl = "";
  const { category_name } = query;
  if (req) {
    currentPageUrl = req.url;
  } else if (res) {
    currentPageUrl = res.socket.parser.incoming.originalUrl;
  }

  const { Media_content } = await import("@/allApi/mediajson");
  const { MetaKeys } = await import("@/allApi/mediajson");

  return {
    MetaKeys,
    currentPageUrl,
    Media_content,
  };
};

export default Media;
