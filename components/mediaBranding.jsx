import React from "react";

const Medialogo = ({ category_name, city_name, Media_content }) => {
  return (
    <>
      <div className="media-branding-n">
        <div className="media-branding">
          {Media_content.map((el, i) => {
            if (category_name === el.value || city_name === el.city) {
              return (
                <div key={i}>
                  <div className="black-layer"></div>
                  <img src={el.srcImgM} alt="media_img" />
                  <div className="centered">
                    <h1>{el.banner_heading}</h1>
                    <p className="mt-1 mt-md-2">{el.banner_content}</p>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
      <style jsx>
        {`
          .media-branding-n {
            margin-top: 2%;
          }
          .media-branding {
            text-align: center;
            color: white;
            position: relative;
            z-index: 0;
            transition: transform 0.6s;
          }
          img {
            height: 36.5vh;
            width: 100%;
            border-radius: 6px;
          }
          .black-layer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: black;
            opacity: 0.5; // Adjust the opacity as needed
            z-index: 1; // Make sure it's above the image
          }
          .centered {
            width: 76vw;
            position: absolute;
            top: 50%;
            z-index: 5;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          h1 {
            font-size: 32px;
            font-weight: 700;
            line-height: 37.92px;
            color: #ffffff;
          }
          p {
            font-size: 0.8rem;
            color: #ffffff;
            font-weight: 300;
          }

          @media screen and (max-width: 1024px) {
            img {
              height: 45vh;
              width: 100%;
            }

            h1 {
              font-size: 2.8rem;
            }
            p {
              font-size: 1rem;
            }
          }
          @media screen and (max-width: 540px) {
            .media-branding-n {
              display: none;
            }
          }
        `}
      </style>
    </>
  );
};

export default Medialogo;
