import Link from "next/link";
import React, { useState , useEffect} from "react";
import { setCookie } from "cookies-next";
import { CityNameImage } from "@/allApi/apis";
import Image from "next/image";
const City = () => {
  const [serviceIcon, setServiceIcon] = useState(CityNameImage);
  const [imageDimensions, setImageDimensions] = useState({ width: 340, height: 210 });

  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("/api/cities");
        const result = await response.json();

        if (result.success) {
          setCities(result.data);
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      function handleResize() {
        const screenWidth = window.innerWidth;

        let newWidth, newHeight;

        if (screenWidth <= 400) {
          newWidth = 300;
          newHeight = 200;
        } else {
          newWidth = 340;
          newHeight = 210;
        }

        setImageDimensions({ width: newWidth, height: newHeight });
      }

      window.addEventListener('resize', handleResize);

      handleResize();

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);


  const directlink = (e) => {
    const services = [...serviceIcon];
    setCookie("category_name", "billboard"),
      setCookie("city_name", e.city),
      services.map((el) => (el.value2 = false));
    setServiceIcon(services);
  };

  // const City = [
  //   {
  //     city: "Delhi",
  //     href: "/delhi",
  //     no: "2493+",
  //     src: "/images/web_pics/01-min.jpg",
  //     alt: "outdoor advertising agency in delhi"
  //   },
  //   {
  //     city: "Mumbai",
  //     href: "/mumbai",
  //     no: "1716+",
  //     src: "/images/web_pics/02-min.jpg",
  //     alt: "outdoor advertising agency in mumbai"
  //   },
  //   {
  //     city: "Bengaluru",
  //     href: "/bengaluru",
  //     no: "960+",
  //     src: "/images/web_pics/03-min.jpg",
  //     alt: "outdoor advertising agency in banglore"
  //   },
  //   {
  //     city: "Chennai",
  //     href: "/chennai",
  //     no: "482+",
  //     src: "/images/web_pics/04-min.jpg",
  //     alt: "outdoor advertising agency in chennai"
  //   },
  //   {
  //     city: "Hyderabad",
  //     href: "/hyderabad",
  //     no: "897+",
  //     src: "/images/web_pics/05-min.jpg",
  //     alt: "outdoor advertising agency in hyderabad"
  //   },
  //   {
  //     city: "Pune",
  //     href: "/pune",
  //     no: "429+",
  //     src: "/images/web_pics/06-min.jpg",
  //     alt: "outdoor advertising agency in pune"
  //   },
  // ];

  return (
    <div className="citylist m-0 mt-4 mt-md-5  py-md-4 ">
      <section>
      <h2 className="text-center text-nowrap pt-3 pt-md-0">
          Explore your City Listings
        </h2>
        <h6 className=" text-center">
          Explore some of the best business from around the
          <br />
          world from our partners and friends.
        </h6>
      </section>

      <div className="container mt-4 mt-md-5 ">
  <div className="row">
    {cities.slice(0,6).map((e, i) => (
      <div className="col col-md-4 my-2" key={i}>
        <Link href={e.href}>
          <div
            className="city-img-container d-flex flex-column justify-content-center align-items-center"
            onClick={() => {
              directlink(e);
            }}
          >
            <div className="img-text-container text-center">
            <Image
              width={imageDimensions.width}
              height={imageDimensions.height}
              src={e.src?.startsWith('/') ? e.src : `/${e.src}`}
              className="rounded responsive-img"
              alt={e.alt}
            />
              <div className="bottom-left">{e.city}</div>
              <div className="bottom-left-media">
                {e.no}
                <span className="bottom-left-media-text">medias </span>{" "}
              </div>
            </div>
          </div>
        </Link>
      </div>
    ))}
  </div>
</div>



{/* <div className="container mt-4 mt-md-5">
  <div className="row">
    {City.slice(3).map((e, i) => (
      <div className="col col-md-4" key={i}>
        <Link href={e.href}>
          <div
            className="city-img-container d-flex flex-column justify-content-center align-items-center"
            onClick={() => {
              directlink(e);
            }}
          >
            <div className="img-text-container text-center">
            <Image
              width={imageDimensions.width}
              height={imageDimensions.height}
              src={e.src}
              className="rounded responsive-img"
              alt={e.alt}
            />
              <div className="bottom-left">{e.city}</div>
              <div className="bottom-left-media">
                {e.no}
                <span className="bottom-left-media-text">medias </span>{" "}
              </div>
            </div>
          </div>
        </Link>
      </div>
    ))}
  </div>
</div> */}

      <style jsx>{`
        .citylist {
          background-color: #ececec;
        }
        h2 {
          font-size: 2.2rem;
          font-weight: 700;
          color: #373435;
        }

        h6 {
          font-size: 1.1rem;
          font-weight: 400;
          color: #373435;
        }

  

        .city-img-container {
          position: relative;
          z-index: 0;
          transition: transform 0.6s;
        }

        .bottom-left {
          position: absolute;
          bottom: 42px;
          color: #ffffff;
          left: 16px;
          font-size: 1.1rem;
        }

        .bottom-left-media {
          position: absolute;
          bottom: 8px;
          color: #ffffff;
          left: 16px;
          font-size: 1.6rem;
          font-weight: 700;
          padding-right: 0px;
        }

        .bottom-left-media-text {
          color: #ffffff;

          font-size: 1.1rem;
          font-weight: 400 !important;
        }

        .city-img-container:hover {
          transform: scale(1.1);
          z-index: 2;
        }
     .img-text-container {
            position: relative;
          } 


@media screen and (max-width: 540px) {
          #citygh{
            
            padding: 0px!important ;
          }
          h2 {
            font-size: 1.6rem;
          }
          h6 {
            display: none;
          }

          .city-img-container {
            margin-bottom: 35px;
          }

          .city-img-container:before {
            width: 100%!important;
            height: 150px;
            margin: 0px ;
          }
   
     
            .bottom-left {
              position: absolute;
              bottom:28px;
              color: #fff;
              font-weight: 500;
              font-size: 1rem;
            }


            .bottom-left-media {
              position: absolute;
              bottom: 10px;
              font-size: .9rem;
              font-weight: 400;
              padding-right: 0px;
            }
            .bottom-left-media-text {
           display: none;
            }
          
        }
      }
      `}</style>
    </div>
  );
};

export default City;
