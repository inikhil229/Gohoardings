import React, { useContext, useEffect, useState } from "react";
import { AccountContext } from "@/allApi/apicontext";
import {
  enquiryApi,
  emailformate,
  addItem,
  removeItem,
  singlemnedia,
} from "@/allApi/apis";
import { MdLocationPin } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import instance from "@/allApi/axios";
import Head from "next/head";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Loader from "@/components/loader";
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";
import { MdKeyboardArrowRight } from "react-icons/md";
import Image from "next/image";
import axios from "axios";
import Fixednavbar from "@/components/navbar/fixednavbar";
import { getImageUrl } from "@/assets/scss/CleanImageurl";

const Details = (props) => {
  const Canonicaltag = props.currentPageUrl;
  const metaData = props.apiData;
  const router = useRouter();
  const { category_name, page_title, code } = router.query;
  const { addRemove } = useContext(AccountContext);
  const { handleShow } = useContext(AccountContext);
  const [markers, setPosts] = useState([]);
  const [name, setName] = useState("");
  const [phone, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setEror] = useState(false);

  let count = 0;
  const onSubmit = async (e) => {
    e.preventDefault();
    if (name === "") {
      setEror(true);
      count = +1;
    } else if (phone.length !== 10) {
      count = +1;
      setEror(true);
    } else if (!emailformate.test(email)) {
      count = +1;
      setEror(true);
    } else if (message === "") {
      count = +1;
      setEror(true);
    } else if (count === 0) {
      const data = await enquiryApi(name, email, phone, message);

      if (data.success == true) {
        setName("");
        setNumber("");
        setEmail("");
        setMessage("");
        setEror(false);
        toast("Our team will contact you soon");
      }
    }
  };
  const mapData = async (item) => {
    setCookie("page_title", item.page_title);
    setCookie("item_code", item.code);
    router.push("/map");
  };
  const getMedia = async () => {
    if (category_name && page_title && code) {
      try {
        const { data } = await instance.post("seedetails", {
          page_title: page_title,
          category_name: category_name,
          code: code,
        });

        if (data) {
          setPosts(Array.isArray(data) ? data : [data]); // Ensure it's always an array
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error("Error fetching media data:", error);
      }
    }
  };

  const addonCart = async (e) => {
    const data = await addItem(e);
    if (data.message === "Login First") {
      handleShow();
    } else {
      addRemove({ type: "INCR" });
      add(e);
    }
  };
  const removefroCart = async (obj) => {
    const data = await removeItem(obj.code);
    if (data.message == "Done") {
      addRemove({ type: "DECR" });
      remove(obj);
    }
  };

  const add = (event) => {
    let data = [...markers];
    data.forEach((element) => {
      if (element.code == event.code) {
        element.isDelete = 0;
      }
      setPosts(data);
    });
  };

  const remove = (event) => {
    let data = [...markers];
    data.forEach((element) => {
      if (element.code == event.code) {
        element.isDelete = 1;
      }
      setPosts(data);
    });
  };

  const extractedFields = [];
  useEffect(() => {
    getMedia();
    markers.forEach((item) => {
      const { city_name, medianame, flight_name } = item;

      extractedFields.push({
        city_name,
        medianame,
        flight_name,
      });
    });
  }, [category_name, page_title]);

  const detailTag = [
    {
      value: "billboard",
      description: `Hoardings in ${
        extractedFields.length !== 0 ? extractedFields[0].city_name : "India"
      } enhance enduring brand remembrance while extending your reach over. These promotional materials are strategically positioned zoned with substantial footfall, ensuring remarkable prominence among bystanders, walkers, and travelers.`,
    },
    {
      value: "digital-billboard",
      description: `Digital Hoardings in ${
        extractedFields.length !== 0 ? extractedFields[0].city_name : "India"
      } are the innovative OOH advertising opportunity that display eye-catching visual brand creatives on LED screens offering hyperlocal city-wide visibility. Digital OOH Ads in “CityName”, is a cost-effective outdoor tool that increases brand impact and engage targeted audiences.`,
    },
    {
      value: "mall-media",
      description: `${
        extractedFields.length !== 0 ? extractedFields[0].medianame : ""
      } ${
        extractedFields.length !== 0 ? extractedFields[0].city_name : "India"
      } at Gohoardings, In media options rates are mentioned in the advertising for all advertising options available at the Mall. Once you decided on the media option, do reach out to us to get the best discount available`,
    },
    {
      value: "transit-media",
      description: `An effective transit ad option, this Ad can help bring your brand message into the streets and on roads. Operational in a densely populated city. This transit media ad follow a fixed route offer brand awareness & exposure to passengers & pedestrians within a predictable geographical area.`,
    },
    {
      value: "airport-media",
      description: `Grabing the attention of business travellers, tourists, and local,  ${
        extractedFields.length !== 0
          ? extractedFields[0].flight_name
          : "Indians"
      } airport ads create brand recall & awareness that lasts beyond the airport. Advertising in Aiports provide makes a better presence among an affluent audience.`,
    },
  ];
  const hotjarTrackingCode = `(function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:3792413,hjsv:6};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`;
  return (
    <>
      {metaData.map((item, i) => (
        <Head key={i}>
          <link
            rel="canonical"
            href={`https://www.gohoardings.com${Canonicaltag}`}
          />
          <title>{item.page_title.replace(/-/g, " ")}</title>
          <meta charSet="utf-8" />

          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#000000" />
          <meta
            name="description"
            content={item.page_title.replace(/-/g, " ")}
          />
          <meta
            name="google-site-verification"
            content="fLT70DRZGdH5FUdrS8w1k2Zg_VTzNJGDF9ie9v4FAzM"
          />
          <meta name="keywords" content={item.page_title.replace(/-/g, " ")} />
          <meta
            property="og:title"
            content={item.page_title.replace(/-/g, " ")}
          />
          <meta property="og:siteName" content={item.medianame} />
          <meta
            property="og:description"
            content={item.page_title.replace(/-/g, " ")}
          />
          <meta property="og:type" content="en_US" />
          <meta property="og:image" href={item.thumb} />
          <meta
            property="og:url"
            href={`https://www.gohoardings.com${Canonicaltag}`}
          />
          <meta property="og:property" content="en_US" />
          <meta
            property="twitter:title"
            content={item.page_title.replace(/-/g, " ")}
          />
          <meta property="twitter:siteName" content={item.medianame} />
          <meta
            property="twitter:description"
            content={item.page_title.replace(/-/g, " ")}
          />
          <meta property="twitter:type" content="en_US" />
          <meta property="twitter:image" href={item.thumb} />
          <meta
            property="twitter:url"
            href={`https://www.gohoardings.com${Canonicaltag}`}
          />
          <meta property="twitter:property" content="en_US" />
          <script dangerouslySetInnerHTML={{ __html: hotjarTrackingCode }} />
        </Head>
      ))}
      <Fixednavbar />
      {markers == 0 ? (
        <>
          <div className=" container-xxl  container-xl container-lg container-md">
            <div className="row  text-center my-5">
              <Loader />
            </div>
          </div>
        </>
      ) : (
        <>
          {markers.map((item, i) => (
            <>
              <div
                className="container-xxl  container-xl container-lg container-md detail-container animate__animated  animate__fadeIn"
                key={i}
              >
                <div className="row mt-3 mt-md-5 ms-md-3 me-md-3 ms-0 me-0 detail-mg p-1 p-md-3 rounded-3">
                  <div className="col-md-6 p-0">
                    <Carousel showThumbs={false} infiniteLoop={true}>
                      {item?.thumbnail?.split(",").map((element, i) => (
                        <div key={i}>
                          <Image
                            width={420}
                            height={390}
                            alt={item?.mediaownercompanyname}
                            src={getImageUrl(item)}
                            onError={(e) =>
                              (e.target.src = "/images/web_pics/alter-img.png")
                            }
                            className="rounded-3 detail-img"
                          />
                        </div>
                      ))}
                    </Carousel>
                  </div>

                  <div className="col-md-6 p-2 p-md-3  ps-md-4 rounded-3 text-dark">
                    <h5 className=" text-uppercase"> {item?.subcategory}</h5>
                    <h2>{item?.medianame}</h2>
                    <p>Code : {item?.code}</p>
                    <div className="row my-3">
                      <div className="col-4">
                        <h6>Media</h6>
                        <h6 className="fw-bold">{item?.subcategory}</h6>
                      </div>
                      <div className="col-4 ">
                        <h6>Size</h6>
                        <h6 className="fw-bold">
                          {item?.height}x{item?.width} {item?.widthunit}
                        </h6>
                      </div>
                      <div className="col-4">
                        <h6>Illumination</h6>
                        <h6 className="fw-bold">
                          {item?.illumination ? (
                            item?.illumination
                          ) : (
                            <span className="text-muted">No Data</span>
                          )}
                        </h6>
                      </div>
                    </div>
                    <div className="row my-2">
                      <div className="col-8">
                        <h6>FTF</h6>
                        <h6 className="fw-bold">{item?.location}</h6>
                      </div>
                      <div className="col-4">
                        <h6>Total Area</h6>
                        <h6 className="fw-bold">
                          {item?.height * item?.width} Sq. Ft.{" "}
                        </h6>
                      </div>
                    </div>
                    {detailTag.map((el, i) => {
                      if (category_name === el.value) {
                        return <p key={i}>{el?.description}</p>;
                      }
                    })}
                    <div className="row p-0">
                      <div className=" col-6 position-relative">
                        <span className="bottom-0 position-absolute view">
                          Price: {parseInt(item?.price / 30)},{" "}
                          {item?.price_format || "Rs"}
                        </span>
                      </div>
                      <div className="col-2">
                        <div
                          className="location p-2 text-center rounded"
                          onClick={(element) => mapData(item)}
                        >
                          <MdLocationPin
                            className="icon-clr me-4 me-md-0 mt-1 mt-md-0"
                            id="detail-map-location"
                          />
                        </div>
                      </div>
                      <div className="col-4" id="detail-Map">
                        {item.isDelete === 0 ? (
                          <div
                            className="cart-btn text-center p-2 rounded me-2"
                            onClick={() => removefroCart(item)}
                          >
                            <h6 className=" mt-2 fw-bold "> Remove</h6>
                          </div>
                        ) : (
                          <div
                            className="cart-btn text-center p-2 rounded me-2"
                            onClick={() => addonCart(item)}
                          >
                            <h6 className="fw-bold mt-2">Add to Cart</h6>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* map section */}
                <div className="py-4 py-md-5 ">
                  <h3 className="ms-md-3  ms-1 fw-bold">
                    Media Location:{" "}
                    <span className="text-muted fw-normal">
                      {item?.location}{" "}
                    </span>
                  </h3>
                  <div className="detail-map ms-md-3 me-md-3 ms-0 me-0 p-1 p-md-3 rounded-3">
                    <iframe
                      src={
                        "https://maps.google.com/maps?q=" +
                        item?.latitude +
                        "," +
                        item?.longitude +
                        "&t=&z=15&ie=UTF8&iwloc=&output=embed"
                      }
                      className="map_sectionD rounded"
                      allowFullScreen={true}
                      loading="lazy"
                      title="google-map"
                    ></iframe>
                  </div>
                </div>

                {/* form section */}
                <div className="detail-form p-3 rounded-3 my-md-5 my-4 mb-md-3">
                  <>
                    <h1 className="txt-clr-tlk fw-bold">
                      Get a Free Consultation!
                    </h1>
                    <h5 className="txt-clr">*Please fill all the details.</h5>
                    <form
                      className='mt-4 "position-relative'
                      onSubmit={onSubmit}
                    >
                      <div className="form-group py-3 ">
                        <label htmlFor="formGroupExampleInput">Name*</label>
                        <input
                          autoComplete="off"
                          type="text"
                          className="form-control ps-0 rounded-0"
                          id="formGroupExampleInput"
                          placeholder="Your Full Name"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                          }}
                        />
                        {error == true && name === "" ? (
                          <small className="p-0 text-danger text-small ">
                            Please enter your name
                          </small>
                        ) : (
                          <> </>
                        )}
                      </div>
                      <div className="row py-3">
                        <div className="col">
                          <label htmlFor="Last-name">Email*</label>
                          <input
                            autoComplete="off"
                            type="text"
                            className="form-control ps-0 rounded-0"
                            placeholder="Your Mail ID"
                            id="first-name"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                            }}
                          />
                          <p className="error-msg">
                            {" "}
                            {error == true && !emailformate.test(email) ? (
                              <small className="p-0 p-0 text-danger text-small  ">
                                Type your email corectly
                              </small>
                            ) : (
                              <> </>
                            )}{" "}
                          </p>
                        </div>
                        <div className="col">
                          <label htmlFor="Last-name">Phone phone*</label>
                          <input
                            autoComplete="off"
                            type="phone"
                            className="form-control ps-0 rounded-0"
                            placeholder="+1 012 3456 789"
                            id="+1 012 3456 789"
                            value={phone}
                            onChange={(e) => setNumber(e.target.value)}
                          />
                          {error == true && phone.length !== 10 ? (
                            <small className="p-0 text-danger text-small  ">
                              Type your 10 digit phone corectly
                            </small>
                          ) : (
                            <> </>
                          )}
                        </div>
                      </div>
                      <div className="form-group py-3">
                        <label htmlFor="formGroupExampleInput2">Message*</label>
                        <input
                          autoComplete="off"
                          type="text"
                          className="form-control ps-0 rounded-0"
                          id="formGroupExampleInput2"
                          placeholder="Write your message.."
                          value={message}
                          onChange={(e) => {
                            setMessage(e.target.value);
                          }}
                        />
                        {error == true && message === "" ? (
                          <small className="p-0 text-danger text-small  p-0 ">
                            Please enter your message for our team
                          </small>
                        ) : (
                          <> </>
                        )}
                      </div>
                      <div className=" p-0 m-0  pb-5">
                        <button
                          type="submit"
                          className="btn btn-lg  message-btn  float-end"
                          role="button"
                        >
                          Send Message
                        </button>
                        <ToastContainer />
                      </div>
                    </form>
                  </>
                </div>
              </div>
              <h6 className="my-4">
                <span onClick={() => router.push("/")} className="bredcamp">
                  Home
                </span>
                <MdKeyboardArrowRight />
                <span
                  className="bredcamp"
                  onClick={() => router.push("/billboard")}
                >
                  Medias
                </span>
                <MdKeyboardArrowRight />
                <span className="bredcamp text-secondary">Details</span>
              </h6>
            </>
          ))}
        </>
      )}
      <style jsx>
        {`
    .detail-container {
      margin-top: 6%;
    }   
      h2 {
        font-size: 2.1rem;
      }
      h3 {
        color: #4f4a4c;
        font-size: 1.7rem;
      }
      h5 {
        font-size: 1.1rem;
        color: #4f4a4c;
      }
      h6 {
        color: #373435;
        font-size: 1rem;
      }
      p,
      span {
        color: #373435;
      }
     
    
      .detail-mg {
        background-color: #fdfdfd;
        box-shadow: rgba(98, 98, 105, 0.2) 0px 7px 29px 0px;
      }
   
    
      .detail-img {
        height: 390px;
        width: 605px !important;
      }
    
      .view {
        cursor: pointer;
        font-weight: bold;
      }
      .view:hover {
        color: black;
      }
      .location {
        background-color: #e8e8e8;
        cursor: pointer;}

       
      
      .cart-btn {
        background-color: #fff212;
        cursor: pointer;
        color: #3d3933;
      }
      .detail-map {
        background-color: #fdfdfd;

        box-shadow: rgba(98, 98, 105, 0.2) 0px 7px 29px 0px;
      }
        .map_sectionD {
          height: 60vh;
          width: 100%;
        }
      
    
      .detail-form {
        background-color: #fdfdfd;
        box-shadow: rgba(98, 98, 105, 0.2) 0px 7px 29px 0px;
      }
        .txt-clr-tlk {
          color: #373435;
          font-size: 2.2rem;
        }
        .txt-clr {
          color: #373435;
        }
        .form-control {
          border: none !important;
          border-bottom: 1px solid #b5b4b4 !important;
        }
        label {
          color: #6c757d !important;
          font-size: 0.9rem;
        }
      
        .message-btn {
          background-color: #373435;
          color: rgb(237, 237, 237);
          font-size: 1rem;
          border-radius: 4px !important;
        }
        .message-btn:hover {
          background-color: #4a494a;
          color: rgb(237, 237, 237);
        }
      
      @media screen and (max-width: 1366px) {
        h2 {
          font-size: 1.9rem;
        }
        h3 {
          color: #4f4a4c;
          font-size: 1.5rem;
        }
        h5 {
          font-size: 1rem;
          color: #4f4a4c;
        }
        h6 {
          color: #373435;
          font-size: 0.9rem;
        }
    
        .detail-img {
          height: 370px;
          width: 585px !important;
        }
        .map_sectionD {
          height: 55vh;
        }
      }
    
      @media screen and (max-width: 1024px) {
        h2 {
          font-size: 1.7rem;
        }
        h3 {
          color: #4f4a4c;
          font-size: 1.3rem;
        }
        h5 {
          font-size: 0.9rem;
          color: #4f4a4c;
        }
        h6 {
          color: #373435;
          font-size: 0.8rem;
        }
    
        .detail-img {
          height: 375px;
          width: 550px !important;
        }
        .map_sectionD {
          height: 45vh;
        }
       

        @media screen and (max-width: 540px) {
         
          .location {
            width: 85px;
            height: 62px;
           }
          .detail-img {
            height: 300px;
          }
          .map_sectionD {
            height: 45vh;
          }
          .detail-container {
      		margin-top: 13%;
    		}  
        
         

    `}
      </style>
    </>
  );
};

Details.getInitialProps = async ({ req, res }) => {
  let currentPageUrl = "";
  let category2 = "";
  let details2 = "";
  let code2 = "";

  if (req) {
    currentPageUrl = req.url;
    const urlParts = currentPageUrl.split("/");
    category2 = urlParts[2];
    details2 = urlParts[3];
    code2 = urlParts[4];
  } else if (res) {
    currentPageUrl = res.socket.parser.incoming.originalUrl;
    const urlParts = currentPageUrl.split("/");
    category2 = urlParts[2];
    details2 = urlParts[3];
    code2 = urlParts[4];
  }

  // Call the API and get the data
  let apiData = [];
  if (category2 && details2 && code2) {
    try {
      const response = await axios.post(
        "https://www.gohoardings.com/api/seedetails",
        {
          page_title: details2,
          category_name: category2,
          code: code2,
        },
      );
      apiData = response.data;
    } catch (error) {
      // Handle API error if needed
      console.error("API Error:", error);
    }
  }

  return {
    currentPageUrl,
    apiData,
  };
};
export default Details;
