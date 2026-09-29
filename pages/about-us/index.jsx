import { MdKeyboardArrowRight } from "react-icons/md";
import React, { useState } from "react";
import Head from "next/head";
import Branding from "../../components/branding";
import { useRouter } from "next/router";
import Image from "next/image";
import Fixednavbar from "@/components/navbar/fixednavbar";
import { brandLogoApi } from "@/allApi/apis";
import { useEffect } from "react";
const About = () => {
  const [noOfLogo, setnoOfLogo] = useState(18);
  const [logo, SetLogo] = useState([]);
  const [showButton, setshowButon] = useState(true);
  const slice = logo.slice(0, noOfLogo);

  const loadMore = () => {
    if (noOfLogo === 18) {
      setnoOfLogo(noOfLogo * 2);
    } else if (noOfLogo === 36) {
      setnoOfLogo(noOfLogo + 12);
      setshowButon(false);
    }
  };
  const allLogo = async () => {
    const data = await brandLogoApi();
    SetLogo(data);
  };

  const toContact = () => {
    route.push("/contact-us");
  };
  const { asPath } = useRouter();
  useEffect(() => {
    allLogo();
  }, []);

  const cardData = [
    {
      title: "TRADITIONAL",
      description:
        "Local directory is the smartest way to find the best services",
    },
    {
      title: "MALL MEDIA",
      description:
        "Local directory is the smartest way to find the best services",
    },
    {
      title: "DIGITAL OOH MEDIA",
      description:
        "Local directory is the smartest way to find the best services",
    },
    {
      title: "AIRPORT BRANDING",
      description:
        "Local directory is the smartest way to find the best services",
    },
    {
      title: "OFFICE BRANDING",
      description:
        "Local directory is the smartest way to find the best services",
    },
    {
      title: "TRANSIT MEDIA",
      description:
        "Local directory is the smartest way to find the best services",
    },
  ];
  return (
    <>
      <Head>
        <link rel="canonical" href={`https://www.gohoardings.com${asPath}`} />
        <title>About - Outdoor Advertising Agency in India | Gohoardings</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="India’s finest outdoor hoardings media agency. We are helping business to grow offline with hoardings, billboards ads, bus shelters, metro pillars, airport, and office brandings | Gohoardings"
        />
        <meta
          name="google-site-verification"
          content="fLT70DRZGdH5FUdrS8w1k2Zg_VTzNJGDF9ie9v4FAzM"
        />
        <meta
          name="keywords"
          content="Hoarding agency, Outdoor Advertising Company, Bus Advertising, Airport Advertising, OOH Media Agency, Train Advertising, Cab and Autorikshaw Advertising, Digital LED Display Ads, DOOH Advertising, Ad Agency India, Hoarding Advertising Agency Nearby, Multiplex Advertising, Gohoardings is india’s largest Outdoor Advertising Agency"
        />
        <meta
          property="og:title"
          content="About - Outdoor Advertising Agency in India | Gohoardings"
        />
        <meta property="og:siteName" content="www.gohoardings.com/about-us" />
        <meta
          property="og:description"
          content="India’s finest outdoor hoardings media agency. We are helping business to grow offline with hoardings, billboards ads, bus shelters, metro pillars, airport, and office brandings | Gohoardings"
        />
        <meta property="og:type" content="en_US" />
        <meta property="og:url" href={`https://www.gohoardings.com${asPath}`} />
        <meta property="og:property" content="en_US" />
        <meta
          property="twitter:title"
          content="About - Outdoor Advertising Agency in India | Gohoardings"
        />
        <meta
          property="twitter:siteName"
          content="www.gohoardings.com/about-us"
        />
        <meta
          property="twitter:description"
          content="India’s finest outdoor hoardings media agency. We are helping business to grow offline with hoardings, billboards ads, bus shelters, metro pillars, airport, and office brandings | Gohoardings"
        />
        <meta property="twitter:type" content="en_US" />
        <meta
          property="twitter:url"
          href={`https://www.gohoardings.com${asPath}`}
        />
        <meta property="twitter:property" content="en_US" />
      </Head>

      <Fixednavbar />
      <div className="d-hide drop-nd"></div>
      <section className="fvf">
        <Branding title="About Us" />
      </section>

      <section>
        <div className="container mt-2">
          <div className="row">
            <div className="col-md-7  text-container text-center mt-3">
              <h2>Welcome to India’s largest outdoor advertising agency</h2>
              <p className="descrption">
                our advertising network is spread across 130 cities with more
                than 1.2 lakh OOH and DOOH sites Offering hassle-free branding
                experiences at an unmatched price.We are building brands since
                2016.We believe to innovate,inform and inspire,thus providing a
                range of media for the promotion of your goods, products, and
                services or ideas We have a delighted customer base for the
                advertising company domain, we are engaged in providing the
                services by a skilled and experienced team of professionals with
                utmost perfection.
              </p>
            </div>
            <div className="col-md-5">
              <Image
                width={500}
                height={500}
                src="/images/web_pics/ooh.png"
                alt="img"
                className="img-fluid"
                id="media-img"
              />
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="media-container container pb-4">
          <div className="row">
            {cardData.map((card, index) => (
              <div
                key={index}
                className="col-lg-2 col-md-4 mt-2 col-sm-6 col-6"
              >
                <div className="card about-cards">
                  <h6>{card.title}</h6>
                  <p className="descrption">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="vision">
        <div className="container text-center">
          <div className="row ">
            <div className="col-md-7  text-container ">
              <h2>Our Vision </h2>
              <p className="descrption">
                Our vision to create a holistic system that helps a user quickly
                and efficiently plan, book and manage out of home advertising
                campaigns across the globe. We want to provide a voice to your
                brand,show you the power of marketing communication,and build a
                bridge between your brand and customer.
              </p>
              <p className="descrption">
                We do it in a different way.We&#39;ve got the creative eye and
                the perfect equation of ideas.We help you grow by adding the
                word called success to your brand.Thus to conclude our vision is
                to be the master touch, you need, to be visible and heard.
              </p>
            </div>

            <div className="col-md-5">
              <Image
                width={500}
                height={500}
                id="map-img"
                className="img-fluid "
                src="/images/web_pics/India_map.png"
                alt="map"
              />
            </div>
          </div>
        </div>
        <div className="container text-center">
          <div className="row mt-3">
            <div className="col-md-5">
              <Image
                width={500}
                height={500}
                id="care-img"
                className="img-fluid care"
                src="/images/web_pics/vision.png"
                alt="care"
              />
            </div>
            <div className="col-md-7 text-container">
              <h2>Our Mission</h2>

              <p className="descrption">
                We aim to become the world&#39;s best OOH and DOOH advertising
                company.Our mission is to guide you to find your brand’s voice
                and help you to tell a bigger story through our best services
                available in city.&#39;Quality never goes out of style&#39; and
                we ensure to provide the best one.
              </p>

              <p className="descrption">
                The promotion that your company needs,for the traffic, you would
                love.Where creativity meets ads,You’ve got a business, we have
                got brilliant minds,striving each day to make this space the
                Leading Outdoor Advertising agency in India
              </p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container-fluid px-3  m-0 p-0 text-center mt-5">
          <div>
            <div className="row mt-5 pt-3">
              <h2 className="my-3 mt-md-5">Meet our happy clients</h2>
            </div>
            <div className="grid-container1 mt-3">
              {slice.map((clients, index) => {
                return (
                  <div className="grid-item" key={index}>
                    <Image
                      width={500}
                      height={500}
                      src={clients.img}
                      alt={clients.alt}
                      className="img-fluid logo-img-a"
                    />
                  </div>
                );
              })}
            </div>
            {showButton ? (
              <button
                className="load-button mt-3 mb-5 p-2"
                onClick={() => loadMore()}
              >
                Load more <i className="bi bi-download "></i>
              </button>
            ) : (
              <button
                className="load-button mt-3 mb-5 p-2 "
                onClick={() => toContact()}
              >
                Let&#39;s Talk <i className="bi bi-arrow-right-square"></i>
              </button>
            )}
          </div>
        </div>
      </section>
      <style>
        {`
  .fvf{
    margin-top: 4.1%;
  }
  .text-container {
    padding-top: 7%;
    opacity: 75%;
    color: $black;
  }
  
  .vision {
    margin-top: 2.5%;
  }
  .media-container {
    margin-top: 3%;
  }
  .about-cards {
    background-image: linear-gradient(
      to bottom,
      rgb(23, 21, 29),
      rgb(37, 38, 41)
    );
    text-align: center;
    color: white;
    padding-top: 7px;
    padding-left: 3px;
    padding-right: 3px;
    cursor: pointer;
    box-shadow: $box-shadow;
  }
  .about-cards h6 {
    padding-bottom: 4px;
    border-bottom: 1px solid $yellow;
  }
  
  .container2 {
    background: transparent;
    display: flex;
    text-align: center;
    align-items: center;
  }
  #media-img {
    position: relative;
    cursor: pointer;
    // padding-left: 35px;
  }
  
  #map-img {
    position: relative;
    cursor: pointer;
    // margin-left: 35px;
    height: 426px;
    width: 390px;
  }
  
  .text-container {
    color: $black;
  }
  
  .text-container p::first-letter {
    color: $grey;
    font-size: $subhead;
    font-weight: 600;
  }
  .grid-container1 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  }
  .grid-item {
    text-align: center;
  }
  .logo-img-a {
    height: 100px;
    width: 150px;
  }
  
  #root {
    background-color: $white;
    padding: 0%;
    margin: 0%;
  }
  .load-button {
    width: 120px;
    font-size: 16px;
    font-weight: 600;
    color: rgb(255, 255, 255);
    cursor: pointer;
    margin: 20px;
    height: 40px;
    text-align: center;
    border: none;
    background-size: 300% 100%;
    border-radius: 5px;
    background-color: #373435;
    --moz-transition: all 0.4s ease-in-out;
    transition: all 0.4s ease-in-out;
  }
  .load-button:hover {
    transform: scale(1.1);
  }
  #care-img {
    padding-top: 1px;
  }
  
  @media screen and (max-width: 1366px) {
    .about-cards {
      h6 {
        font-size: 12px;
        padding-bottom: 3px;
      }
      .descrption {
        font-size: small;
      }
    }
    .vision {
      margin-top: 1.5%;
    }
    .logo-img-a {
      height: 80px;
      width: 130px;
    }
    #map-img {
      position: relative;
      cursor: pointer;
      padding-top: 25px;
      padding-left: 32px;
    }
    #care-img {
      padding-top: 30px;
    }
  }
  @media screen and (max-width: 540px) {
    .about-cards {
      h6 {
        font-size: 8px;
        padding-bottom: 3px;
      }
      .descrption {
        font-size: small;
      }
    }
    .vision {
      margin-top: 1.2%;
    }
 
      .grid-container1{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr ;
    
    #map-img {
      
      padding-top: 0px;
      padding-left: 0px;
      margin-left: 0px;
    }
    #care-img {
      display:none;
    }
  }
  `}
      </style>
      <h6>
        <span onClick={() => route.push("/")} className="bredcamp">
          Home
        </span>
        <MdKeyboardArrowRight />
        <span className="bredcamp text-secondary">About</span>
      </h6>
    </>
  );
};

export default About;
