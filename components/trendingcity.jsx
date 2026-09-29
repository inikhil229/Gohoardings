import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import Link from "next/link";
import Loader from "../components/loader";

const TrendingCity = () => {
  const [trendingCities, setTrendingCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingCities = async () => {
      try {
        const response = await fetch("/api/trendingcities");
        const result = await response.json();

        if (result.success) {
          setTrendingCities(result.data);
        } else {
          console.error(result.message);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingCities();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 2,
    autoplay: true,
    speed: 3500,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          initialSlide: 0,
        },
      },
    ],
  };

  return (
    <>
      <div className="container-xxl container-xl container-lg container-md mt-5 mt-md-2 mb-md-4 py-5 mb-5 trending-contain">
        <section>
          <h2 className="text-center text-nowrap">
            Choose what is Trending in your City
          </h2>
          <h6 className="text-center">
            Choose the best ways to deliver relevant <br />
            messages to the relevant audience.
          </h6>
        </section>

        {loading ? (
          <div className="container">
            <div className="row text-center my-3">
              <Loader />
            </div>
          </div>
        ) : (
          <Slider {...sliderSettings}>
            {trendingCities.map((pos, i) => (
              <div className="container pt-3" key={i}>
                <div className="row">
                  <div className="col p-3">
                    <Link
                      href={`/seedetails/${pos.category_name}/${pos.page_title}/${pos.code}`}
                    >
                      <div className="trending-card-img rounded-2">
                        <img
                          className="rounded-2 trending-cardd"
                          alt={pos.alt || "Trending City"}
                          src={pos.thumb.slice(2, pos.thumb.length)}
                          // changed the url from ../images/webpics to /images/webpics using the slice method because nextjs takes the pubilc folder by default
                          // ../images/web_pics/trending/al_barsha.jpg , coming  from api
                          // /images/web_pics/trending/al_barsha.jpg after using the slice method

                          onError={(e) =>
                            (e.target.src = "/images/web_pics/alter-img.png")
                          }
                        />
                        <div className="bottom-left">{pos.city_name}</div>
                        <div className="bottom-left-media">
                          {pos.medianame.substring(0, 20)}...
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>

      <style jsx>
        {`
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

          .trending-card-img:before {
            content: "";
            position: absolute;
            background: linear-gradient(
              to bottom,
              transparent,
              transparent,
              rgba(0, 0, 0, 0.55) 90%
            );
            top: 0;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 5px;
          }

          .trending-card-img {
            height: 200px;
            width: 300px;
            position: relative;
            z-index: 0;
          }
          .bottom-left {
            position: absolute;
            bottom: 32px;
            color: #ffffff;
            left: 16px;
            font-size: 1rem;
          }
          .bottom-left-media {
            position: absolute;
            bottom: 5px;
            color: #ffffff;
            left: 16px;
            font-size: 1.2rem;
            font-weight: 400;
          }

          .trending-cardd {
            height: 200px;
            width: 300px;
          }

          @media screen and (max-width: 1366px) {
            .trending-card-img {
              height: 180px;
              width: 260px;
            }
            .trending-cardd {
              height: 180px;
              width: 260px;
            }
          }

          @media screen and (max-width: 540px) {
            .trending-contain {
              display: none;
            }
          }
        `}
      </style>
    </>
  );
};

export default TrendingCity;
