import React from "react";
import Image from "next/image";
const WhyUs = () => {
  const logo = [
    {
      id: 1,
      img: "/images/web_pics/facebook2.png",
      alt: "Facebook",
    },
    {
      id: 2,
      img: "/images/web_pics/Instagram.png",
      alt: "instagram",
    },
    {
      id: 3,
      img: "/images/web_pics/Linkedin.png",
      alt: "youtube",
    },
    {
      id: 4,
      img: "/images/web_pics/Twitch.png",
      alt: "youtube",
    },
    {
      id: 5,
      img: "/images/web_pics/Snapchat.png",
      alt: "youtube",
    },
    {
      id: 6,
      img: "/images/web_pics/youtube2.png",
      alt: "youtube",
    },
  ];
  return (
    <>
      <div
        className={`container-xxl  container-xl container-lg container-md my-md-5 my-4`}
      >
        <div className="row">
          <h2>Influencer’s Platforms</h2>
          <div className="influencer-platform my-md-5 my-4">
            {logo.map((e, i) => (
              <p key={i} className="my-0 logo-img">
                <Image
                  width={120}
                  height={120}
                  src={e.img}
                  alt={e.alt}
                  className="img-fluid"
                />
              </p>
            ))}
          </div>
        </div>
        <div className="row my-md-5 my-4">
          <h2 className="my-3 mb-5">Why choose Gohoardings.com</h2>
          <div className="col-md-4 ">
          <div className="container my-3 ">
              <div class="content">
                <h5>Branding At Its Best</h5>
                <p>Boosting brand recognition through the utilization of influence marketing with reach and established credibility.
</p>
              </div>
            </div>
            <div className="container my-3 ">
              <div class="content">
                <h5>Higher Engagement Rate</h5>
                <p>The audience gets more engaged and feels more connected with their favorite influencer</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <Image
              width={500}
              height={500}
              src={"/images/web_pics/whyus.png"}
              alt="whyus"
              className="img-fluid "
            />
          </div>
          <div className="col-md-4">
         
            <div className="container my-3 ">
              <div class="content">
                <h5>Targeted Audience</h5>
                <p>You can do the marketing and advertising to the specified and targeted audience by doing influencer marketing</p>
              </div>
            </div>
            <div className="container my-3 ">
              <div class="content">
                <h5>Minimum Cost Maximum Result</h5>
                <p>Enhance your influencer marketing campaign with. Boost brand visibility in your budget</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          h5 {
            font-size: 1rem;
            line-height: 1;
            letter-spacing: 0.9px;
            color: #323d47;
          }
          p {
            font-size: 0.85rem;
            line-height: 1.4;
            color: #4c4545;
            letter-spacing: 0.6px;
          }
          h2 {
            font-size: 2.2rem;
            font-weight: 700;
            color: #373435;
            text-align: center;
          }
          .influencer-platform {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .logo-img {
            box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
          }
          .why-card {
            height: 110px;
            box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
          }
          .container {
            background: white;
            cursor: pointer;
            border-radius: 15px;
            position: relative;
            padding: 17px 25px;
            color: #393939;
            box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
          }

          .container::after {
            content: "";
            background: #393939;
            border-radius: 15px;
            height: 100%;
            width: 100%;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 0;
            clip-path: circle(10% at 0% 0%);
            transition: all 0.3s ease-in;
          }

          .content {
            position: relative;
            z-index: 1;
            transition: all 0.3s ease-in;
          }

        
          @media screen and (max-width: 540px) {
            h2 {
              font-size: 1.6rem;
            }
            .influencer-platform {
              gap: 10px;
            }
          }
        `}
      </style>
    </>
  );
};

export default WhyUs;
