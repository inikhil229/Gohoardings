import Fixednavbar from "@/components/navbar/fixednavbar";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { CityNameImage, mediaApi, getCityDataApi } from "@/allApi/apis";

import MainUi from "@/components/mediaComponents/MainUi";
import dynamic from "next/dynamic";
const Media = (props) => {
  const ErrorPage = dynamic(() => import("../404"));
  const Metatag = props.MetaKeys;
  const Media_content = props.Media_content;
  const Canonicaltag = props.currentPageUrl;
  const [noOfLogo, setnoOfLogo] = useState(16);
  const router = useRouter();
  const [value, setValue] = useState("");
  const [focus, setFocus] = useState(false);
  const [locationData, setlocationData] = useState([]);
  const [mediaData, setMediadata] = useState([]);
  const [categoryData, setcategoryData] = useState([]);
  const [search, setSearch] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { category_name } = router.query;
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

  const SelectServc = async (obj) => {
    CityNameImage.forEach((el) => {
      el.value2 = el.value === obj.value ? true : false;
    });
    if (validCategories.slice(0, 7).includes(category_name)) {
      router.push(`/${obj.value}`);
    } else {
      router.push(`/${obj.value}/${category_name}`);
    }
  };

  const getData = async () => {
    setIsLoading(true);
    const noofPage = parseInt(noOfLogo + 3);
    let data = [];
    if (category_name) {
      if (category_name.includes("-") || category_name === "billboard") {
        data = await mediaApi(category_name, noofPage);
        setSearch(data);
        setIsLoading(false);
      } else {
        data = await getCityDataApi(category_name);
        setSearch(data);
        setIsLoading(false);
      }
    }
  };

  const apiforFillters = async () => {
    setIsLoading(true);
    const data = await mediaApi(category_name, noOfLogo);
    setMediadata(data);
    setlocationData(data);
    setcategoryData(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
    apiforFillters();
  }, [category_name, noOfLogo]);

  const onSearch = async (searchCity) => {
    const lowercaseCity = searchCity.toLowerCase();
    setValue(searchCity);
    setFocus(false);
    if (validCategories.slice(0, 6).includes(category_name)) {
      router.push(`/${category_name}/${lowercaseCity}`);
    } else {
      router.push(`/${lowercaseCity}`);
    }
  };

  let city = "";

  useEffect(() => {
    CityNameImage.forEach((el) => {
      el.value2 = el.value === category_name ? true : false;
    });

    if (validCategories.slice(7, 14).includes(category_name)) {
      setValue(category_name);
    }
  }, []);
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
          {Metatag.map((el) => {
            if (category_name === el.value) {
              return (
                <React.Fragment key={el.value}>
                  <link
                    rel="canonical"
                    href={`https://www.gohoardings.com${Canonicaltag}`}
                  />
                  <title>{el.page_titel}</title>
                  <meta charSet="utf-8" />
                  <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                  />
                  <meta name="theme-color" content="#000000" />
                  <meta name="description" content={el.page_decri} />
                  <meta
                    name="google-site-verification"
                    content="fLT70DRZGdH5FUdrS8w1k2Zg_VTzNJGDF9ie9v4FAzM"
                  />
                  <meta name="keywords" content={el.meta_keyword} />
                  <meta property="og:title" content={el.page_titel} />
                  <meta property="og:siteName" content={el.meta_keyword} />
                  <meta property="og:description" content={el.page_decri} />
                  <meta property="og:type" content="en_US" />
                  <meta property="og:image" href={el.thumb} />
                  <meta
                    property="og:url"
                    href={`https://www.gohoardings.com${Canonicaltag}`}
                  />
                  <meta property="og:property" content="en_US" />
                  <meta property="twitter:title" content={el.page_titel} />
                  <meta property="twitter:siteName" content={el.meta_keyword} />
                  <meta
                    property="twitter:description"
                    content={el.page_decri}
                  />
                  <meta property="twitter:type" content="en_US" />
                  <meta property="twitter:image" href={el.thumb} />
                  <meta
                    property="twitter:url"
                    href={`https://www.gohoardings.com${Canonicaltag}`}
                  />
                  <meta property="twitter:property" content="en_US" />
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
          setValue={setValue}
          setFocus={setFocus}
          isLoading={isLoading}
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

Media.getInitialProps = async ({ req, res }) => {
  let currentPageUrl = "";

  if (req) {
    currentPageUrl = req.url;
  } else if (res) {
    currentPageUrl = res.socket.parser.incoming.originalUrl;
  }
  const MetaKeys = [
    {
      value: "billboard",
      page_titel: "Top billboard advertising agency in India | Gohoardings",
      page_decri:
        "Choose from millions of billboards here. We are the best billboard advertising agency in India. Get the best outdoor advertising solutions with Gohoardings.",
      meta_keyword:
        "billboards, billboard advertising, billboard advertising agency, billboard agency, hoarding advertising agency, hoarding advertising company, hoarding company, billboard ad agency, billboard ads, billboard company, hoarding agency, unipole advertising, outdoor hoardings, billboard agency in india",
    },
    {
      value: "digital-billboard",
      page_titel: "Digital billboard advertising agency in India | Gohoardings",
      page_decri:
        "Start your digital billboard advertising with us. At Gohoardings, we provide the best interactive digital billboard advertising sites to enhance your brand presence.",
      meta_keyword:
        "digital billboard advertising, digital hoarding advertising, digital billboard ads, outdoor digital advertising, digital display advertising, digital hoarding rental, digital media hoardings, digital advertising display board, LED hoarding advertising, digital hoardings",
    },
    {
      value: "mall-media",
      page_titel:
        "Shopping Mall Advertising with Gohoardings - Best advertising agnecy",
      page_decri:
        "Unlock the Power of Mall Advertising with Gohoardings - Your Trusted Partner for Effective Outdoor Advertising and Branding. Elevate Your Brand Visibility Today!",
      meta_keyword:
        "gohoardings, gohoarding, shopping mall advertising, mall media advertising, mall advertising, shopping mall ad services, mall media solution, mall advertising company, advertising in shopping mall, branding in shopping mall, mall display ad promotion, mall advertising rates, mall event advertising, malll marketing services, mall promotion agency",
    },

    {
      value: "lift-branding",
      page_titel:
        "Office Branding Services | GoHoardings: Transform Your Workspace",
      page_decri:
        "Elevate your office space with impactful Office Branding and In-Office Advertising solutions from GoHoardings. Enhance your workspace today!",
      meta_keyword:
        "in office media, office branding, office advertising, advertising inside office, in office advertising, inhouse branding, workspace advertisment, office branding agency, office branding company, office media advertisment, office marketing agency, office branding ideas",
    },
    {
      value: "transit-media",
      page_titel: "Best Transit Media Advertising Agency | Gohoardings",
      page_decri:
        "Discover the Power of Transit Advertising with Gohoardings - Best Transit Advertising Company! Transform your marketing strategy with our bus advertising solutions.",
      meta_keyword:
        "gohoardings, gohoardings.com, transit advertising, bus advertising, public transport advertising,outdoor advertising, transit media services, transit media advertising, transit media marketing, railway station advertising, transit ad agency, transit media company, airport advertising, transit poster advertising, transit display ads",
    },
    {
      value: "airport-media",
      page_titel:
        "Gohoardings: Elevate Your Brand with Airport Advertising Solutions",
      page_decri:
        "Explore Top-Notch Airport Media Advertising Services with Gohoardings. Reach New Heights by Advertising in Airports Nationwide. Elevate Your Brand Today!",
      meta_keyword:
        "gohoardings, gohoardings.com, airport media, airport media advertising, advertising in airports, airport branding in india, airport display ads, airport advertising solutions, airport branding agency, airport display advertising, airport media marketing, airport digital ads",
    },
    {
      value: "inflight-media",
      page_titel: "Inflight Media: Airline Advertising in India | GoHoardings",
      page_decri:
        "Gohoardings: India's Best Airline Advertising Agency – Explore Effective Outdoor Advertising Solutions Nationwide. Get Airline Magazine Advertising in India",
      meta_keyword:
        "airline advertising, airline marketing, inflight advertising, travel magzine advertising, passanger magzine ads, air travell promotional, airplane advertising, branding in airplane, advertising in airplane, airline sponsoeship opportunity, inflight branding agency, inflight ad company",
    },
    {
      value: "delhi",
      page_titel:
        "Top Advertising Agency in Delhi | Outdoor Advertising Agency",
      page_decri:
        "Unlock Success with Gohoardings, Delhi's Premier Outdoor Advertising Agency. Harness the Power of Outdoors for Your Brand. Contact Us Now",
      meta_keyword:
        "gohoardings, gohoarding, top advertising agency in delhi, top advertising agency in noida, outdoor advertising, hoarding site in delhi, hoardings for rent in delhi, transit advertising in delhi, airport branding company in delhi, advertising agency, digital hoardings agency, branding agency, marketing agency, outdoor promotion",
    },
    {
      value: "hyderabad",
      page_titel: "Gohoardings: Best Outdoor Advertising Agency in Hyderabad",
      page_decri:
        "Experience Excellence with Gohoardings: Hyderabad's Top Outdoor Advertising Agency. Maximize Your Brand's Impact. Contact Us Today",
      meta_keyword:
        "gohoardings, gohoarding, outdoor advertising agency, outdoor advertising in hyderabad, top advertising companies in hyderabad, outdoor hoarding advertising, ad companies in hyderabad, advertising companies in hyderabad, top advertising agencies in hyderabad, advertising agencies hyderabad",
    },
    {
      value: "pune",
      page_titel: "Gohoarding the best outdoor advertising agency in Pune",
      page_decri:
        "Elevate Your Brand with Gohoarding, the Top Outdoor Advertising Agency in Pune. Experience Excellence in Outdoor Promotion. Contact Us Today",
      meta_keyword:
        "gohoardings, gohoarding, best advertising agency in pune, outdoor advertising agency in pune, hoardings company in pune, outdoor branding agency in pune, top advertising company in pune, hoardings for rent in pune, hoardings site in pune, transit advertising in pune, airport advertising in pune, outdoor marketing company in pune, pune advertisingss agenccy, outdoor advertising ",
    },
    {
      value: "mumbai",
      page_titel:
        "Hoardings Advertising Agency in Mumbai | Outdoor Advertising",
      page_decri:
        "Maximize Visibility with Mumbai's Top Outdoor Advertising Agency. Unleash the Power of Hoardings for Effective Brand Promotion. Contact Us Today",
      meta_keyword:
        "gohoardings, gohoarding, advertising, advertising agency, advertising agency in mumbai, advertising company in mumbai, mumbai best advertising agency, hoarding company in mumbai, hoardings site in mumbai, transit advertising in mumbai, branding company in mumbai, top marketing company, advertisment price in airport, airport branding company, airport hoarding site on rent",
    },
    {
      value: "chennai",
      page_titel: "Top Outdoor Advertising Agency in Chennai | Gohoardings",
      page_decri:
        "Elevate Your Brand with the Top Outdoor Advertising Agency in Chennai. Discover Effective Outdoor Marketing Solutions. Contact Us Today",
      meta_keyword:
        "gohoardings, gohoarding, top advertising agency in chennai, chennai advertising agency, best advertising company in chennai, hoardings company in chennai, advertising agency, hoarding site in chennai, marketing company in chennai, transit advertising company, mall media company in chennai, chennai airport advertising, vehicle advertisment",
    },
    {
      value: "bengaluru",
      page_titel: "Outdoor Advertising Agency in Bangalore | Gohoardings",
      page_decri:
        "Discover the Best Outdoor Advertising Agency in Bangalore - Gohoardings. Elevate your brand with our innovative outdoor ad solutions in the vibrant city.",
      meta_keyword:
        "gohoardings, gohoarding, outdoor advertising agency bangalore, outdoor advertising agency in bangalore, best advertising agency, outdoor media agency in bangalore, billboard advertising agency, hoarding advertising  agency, banaglore outdoor marketig company, digital outdoor advertising in bangalore, hoarding advertising company in bangalore, branding company, marketing company, transit media agency, airport advertising agency in bangalore",
    },
    {
      value: "noida",
      page_titel:
        "Top advertising agency in Noida |Top Advertising Agency in Noida | Outdoor Advertising Company",
      page_decri:
        "Gohoardings provides the best sites for hoarding advertising, transit advertising, mall media advertising. We the one of the best advertising agency in Noida.",
      meta_keyword:
        "gohoardings, advertising agency in noida, advertising company in noida, hoarding company in noida, outdoor advertising agency in noida, best ad agency in noida, ad agency in noida, top ad agency, top advertisign agency, bus advertising agency, hoarding sites in noida, hoarding ads, mall media advertising, hoarding advertiser in noida",
    },
  ];
  const { Media_content } = await import("@/allApi/mediajson");
  return {
    MetaKeys,
    currentPageUrl,
    Media_content,
  };
};

export default Media;
