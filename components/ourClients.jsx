import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import Loader from "../components/loader";
import Image from "next/image";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import { goh_testimonialsApi } from "@/allApi/apis";
const OurClients = () => {
  const [posts, setPosts] = useState([]);
  const clients = async () => {
    const data = await goh_testimonialsApi();
    setPosts(data);
  };

  useEffect(() => {
    clients();
  }, []);

  {
    var settings = {
      slidesToShow: 3,
      slidesToScroll: 3,

      speed: 1000,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 700,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    };
  }

  let slider = settings;
  return (
    <>
      <div className="container-xxl  container-xl container-lg container-md   mt-md-2 mb-md-4  py-5 mb-0 clients ">
        <section>
          <h2 className="text-center text-nowrap ">
            What Our Clients Say About Us!
          </h2>
          <h6 className=" text-center">
            Our clients praise our advertising agency for exceptional
            creativity,
            <br /> results-driven campaigns and unmatched dedication to their
            success.
          </h6>
        </section>

        {!posts ? (
          <div className=" container ">
            <div className="row  text-center my-3">
              <Loader />
            </div>
          </div>
        ) : (
          <div className="cards">
            <Slider {...slider}>
              {posts &&
                posts.map((el, i) => (
                  <div className="card position-relative" key={i}>
                    <Image
                      width={50}
                      height={40}
                      className="coma"
                      src={`images/web_pics/coma.png`}
                      alt="..."
                    />
                    <div className="card-body">
                      <Image
                        width={50}
                        height={50}
                        src={`images/web_pics/user-profile.png`}
                        alt="..."
                      />
                      <h3>{el.name}</h3>
                      {/* <div className="stars">
                      <BsStarFill />
                      <BsStarFill />
                      <BsStarFill />
                      <BsStarHalf />
                      <BsStar />
                    </div> */}
                      <p dangerouslySetInnerHTML={{ __html: el.testimony }} />
                    </div>
                  </div>
                ))}
            </Slider>
          </div>
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
          h3 {
            font-size: 1rem;
            font-weight: 600;
            color: #373435;
            margin-top: 6px;
          }
          p {
            font-size: small;
            color: #373435;
          }
          .card {
            border-bottom: 8px #fff212 solid !important;
            transition: 0.5s;
            border: none;
            margin: 10% !important;
            height: 240px;
            cursor: pointer;
            box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px !important;
            width: 300px !important;
          }

        

          @media screen and (max-width: 540px) {
            h2 {
              font-size: 1.33rem;
            }
            h6 {
              display: none;
            }
            .card {
              margin: 4% !important;
              height: 227px;
              width: 91.8% !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default OurClients;
