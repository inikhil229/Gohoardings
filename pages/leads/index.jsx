import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Fixednavbar from "../../components/navbar/fixednavbar";
import WordCounts from "@/components/wordCounts";
import Image from "next/image";
import { BsArrowDownCircle, BsArrowUpCircle } from "react-icons/bs";
import { brandLogoApi } from "@/allApi/apis";
import { enquiryApi } from "@/allApi/apis";
import styles from "../../styles/enquire.module.scss";
import { toast } from "react-toastify";
const Leads = () => {
  const route = useRouter();
  const [logo, SetLogo] = useState([]);
  const [noOfLogo, setnoOfLogo] = useState(24);
  const [showButton, setshowButon] = useState(true);
  const slice = logo.slice(0, noOfLogo);
  const [welcomeForm, setWelcomeForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    message: "",
  });

  const handleChange = (e) => {
    setWelcomeForm({ ...welcomeForm, [e.target.name]: e.target.value });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
    for (const key in welcomeForm) {
      if (!welcomeForm[key]) {
        toast(`Please fill in the ${key.replace(/_/g, " ")} field.`);

        return;
      }
      if (key === "phone" && welcomeForm[key].length < 10) {
        toast(
          `Please enter a valid ${key.replace(
            /_/g,
            " "
          )} with at least 10 digits.`
        );
        return;
      }
      if (key === "email" && !isValidEmail(welcomeForm[key])) {
        toast(`Please enter a valid email address.`);
        return;
      }
    }

    const message = `client city: ${welcomeForm.city}, client message: ${welcomeForm.message}`;

    const data = await enquiryApi(
      welcomeForm.name,
      welcomeForm.email,
      welcomeForm.phone,
      message
    );

    if (data.success == true) {
         route.push("/thank_you");
      setWelcomeForm({
        name: "",
        email: "",
        phone: "",
        city: "",
        message: "",
      });
    }
  };
  const allLogo = async () => {
    const data = await brandLogoApi();
    SetLogo(data);
  };

  useEffect(() => {
    allLogo();
  }, []);

  const loadMore = () => {
    if (noOfLogo === 24) {
      setnoOfLogo(noOfLogo * 2);

      // Scroll to the next section
      const nextSection = document.getElementById("enquire_description_row");
      nextSection.scrollIntoView({ behavior: "smooth", block: "start" });

      // Delay the appearance of the next set of logos
      setTimeout(() => {
        const nextSlice = logo.slice(24, noOfLogo);
        SetLogo((prevLogo) => [...prevLogo, ...nextSlice]);
      }, 1000); // Adjust the delay time as needed
      setshowButon(false);
    }
  };

  const loadLess = () => {
    if (noOfLogo === 48) {
      setnoOfLogo(noOfLogo - 24);
      setshowButon(true);

      // Scroll to the next section (in reverse)
      const previousSection = document.getElementById("our_clients_content");
      previousSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const content = [
    {
      head: "500+",
      desc: "Airport coverage",
      top: 15,
      left: 20,
      size: 150,
      mtop: 9,
      mleft: 4,
    },
    {
      head: "1,500+",
      desc: "Malls for Advertising",
      top: 25,
      left: 5,
      size: 160,
      mtop: 9,
      mleft: 40,
    },
    {
      head: "10,000+",
      desc: "Micro & Macro Influencers",
      top: 41,
      left: 18.5,
      size: 147,
      mtop: 9,
      mleft: 75,
    },
    {
      head: "35,000+",
      desc: "Digital Apps & Sites",
      top: 53,
      left: 5.5,
      size: 155,
      mtop: 20,
      mleft: 12,
    },
    {
      head: "6,000+",
      desc: "Publications for Digital PR",
      top: 70,
      left: 17,
      size: 140,
      mtop: 20,
      mleft: 40,
    },
    {
      head: "",
      desc: "Covering 130+ Cities in India",
      top: 82,
      left: 6.8,
      size: 135,
      mtop: 20,
      mleft: 68,
    },
    {
      head: "80,000+",
      desc: "Campaign",
      top: 15,
      left: 69.5,
      size: 150,
      mtop: 79,
      mleft: 12,
    },
    {
      head: "120,000",
      desc: "OOH site for advertising",
      top: 25,
      left: 83.5,
      size: 160,
      mtop: 79,
      mleft: 40,
    },
    {
      head: "5,000+",
      desc: "Satisfied Clients",
      top: 41,
      left: 71.5,
      size: 147,
      mtop: 79,
      mleft: 68,
    },
    {
      head: "6+",
      desc: "Countries",
      top: 53,
      left: 83.5,
      size: 155,
      mtop: 90,
      mleft: 4,
    },
    {
      head: "",
      desc: "Expert in ATL Advertising",
      top: 70,
      left: 73.5,
      size: 140,
      mtop: 90,
      mleft: 40,
    },
    {
      head: "",
      desc: "Award Winning Advertising Company",
      top: 82,
      left: 83.5,
      size: 135,
      mtop: 90,
      mleft: 75,
    },
  ];

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 720);
    };

    // Initial check
    handleResize();

    // Event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const bubbleImage = (index) => {
    return isSmallScreen
      ? {
          left: `${index.mleft}vw`,
          top: `${index.mtop}vh`,
          height: `${175 / 2}px`,
          width: `${175 / 2}px`,
          position: "absolute",
        }
      : {
          left: `${index.left}vw`,
          top: `${index.top}vh`,
          height: `${index.size - 15}px`,
          width: `${index.size - 15}px`,
          position: "absolute",
        };
  };

  const hotjarTrackingCode = `(function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:3781905,hjsv:6};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`;
  return (
    <>
      <Head>
        <script dangerouslySetInnerHTML={{ __html: hotjarTrackingCode }} />
      </Head>
      <Fixednavbar />
      <div className="container-fluid p-0">
        <section>
          <div className="full-page-image"></div>

          <div className="content-overlay">
            <div className="row">
              <div className="col-12 col-md-4 ">
                {content.slice(0, 6).map((e, i) => (
                  <div
                    key={i}
                    className="bubble text-center  p-3 "
                    style={bubbleImage(e)}
                  >
                    <div className="bubble-body">
                      <h6 className="mt-4">{e.head}</h6>
                      <p>{e.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="col-12 col-md-4 ">
                <div className="position-relative">
                  <div className="form-container ">
                    <h3
                      className="my-4"
                      style={{ color: "#FFF32C", textAlign: "center" }}
                    >
                     Get Your First Ad
                    </h3>
                    <form className="form-content " onSubmit={onSubmit}>
                      <p style={{ color: "#FFF32C", textAlign: "start" }}>
                        *Please fill all the details.
                      </p>

                      <input
                        type="text"
                        className="my-1 input"
                        name="name"
                        value={welcomeForm.name}
                        onChange={handleChange}
                        placeholder="Your Full Name"
                      />
                      <input
                        type="email"
                        className="my-1 input"
                        placeholder="Your Mail ID"
                        name="email"
                        value={welcomeForm.email}
                        onChange={handleChange}
                      />
                      <input
                        type="number"
                        className="my-1 input"
                        name="phone"
                        value={welcomeForm.phone}
                        onChange={handleChange}
                        placeholder="Your Phone No"
                      />

                      <input
                        type="text"
                        className="my-1 input"
                        name="city"
                        value={welcomeForm.city}
                        onChange={handleChange}
                        placeholder="Your City"
                      />

                      <textarea
                        rows="3"
                        placeholder="Message"
                        name="message"
                        value={welcomeForm.message}
                        onChange={handleChange}
                        className="my-1 mt-4"
                      ></textarea>

                      <input
                        role="button"
                        type="submit"
                        className="button text-center"
                      />
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4 ">
                {content.slice(6).map((e, i) => (
                  <div
                    key={i}
                    className="bubble text-center  p-3 "
                    style={bubbleImage(e)}
                  >
                    <div className="bubble-body">
                      <h6 className="mt-4">{e.head}</h6>
                      <p>{e.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="container my-md-5 py-md-3">
            <div className="row">
              <div className="col-md-8 col-12 position-relative">
                <div
                  className={` text-start ${styles.our_clients_content} py-4`}
                >
                  <h2
                    className="my-3 text-start"
                    style={{ letterSpacing: "1.1px" }}
                  >
                    WE BUILD YOUR BRAND
                  </h2>
                  <h6>
                    At GoHoardings, we are not just an advertising agency; we
                    are brand architects dedicated to building your
                    brand`&lsquo;`s legacy. Our innovative strategies,{" "}
                    {isSmallScreen && (
                      <img
                        src="/images/web_pics/image 2.jpg"
                        className="float-end mbil"
                      />
                    )}
                    creative prowess, and extensive reach ensure that your brand
                    stands out in the dynamic landscape. Trust us to craft
                    compelling narratives, leaving a lasting impact on your
                    audience and establishing your brand as a force to be
                    reckoned with.
                  </h6>
                </div>
              </div>
              <div className="col-md-4 col-12">
                {!isSmallScreen && (
                  <img
                    src="/images/web_pics/image 2.jpg"
                    className="float-end mbil"
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        <section>
          <div
            className={`full-page-image2 text-center my-5 ${styles.our_clients_content}`}
          >
            <div className="text-content text-center">
              <h2 className="my-3 " style={{ letterSpacing: "1.1px" }}>
                We have more then 7 years of experience in Advertisement
              </h2>
              <h6></h6>
              <p>+91 7777871717 </p>
              <p>OR </p>{" "}
              <button
                className="button2"
                onClick={() => route.push("/contact-us")}
              >
                Contact Us
              </button>
            </div>
          </div>
        </section>

        <section
          id="our_clients_content"
          className={`${styles.our_clients_content} my-md-5 py-md-4 enqry`}
        >
          <h2 className="my-3 mt-md-5" style={{ textTransform: "uppercase" }}>
            Meet our happy clients
          </h2>
          <div className={`${styles.gridContainer} mt-3`}>
            {slice.map((clients, index) => {
              return (
                <div className={styles.gridItem} key={index}>
                  <Image
                    width={500}
                    height={500}
                    src={clients.img}
                    alt={clients.alt}
                    className={`img-fluid ${styles.logoImgA}`}
                  />
                </div>
              );
            })}
          </div>
          <h2>
            {showButton ? (
              <button
                className={`${styles.loadbutton} my-3 `}
                onClick={loadMore}
              >
                <BsArrowDownCircle />
              </button>
            ) : (
              <button
                className={`${styles.loadbutton} my-3 `}
                onClick={loadLess}
              >
                <BsArrowUpCircle />
              </button>
            )}{" "}
          </h2>
        </section>

        <section id="enquire_description_row">
          <WordCounts />
        </section>
      </div>
      <style jsx>{`
        .container-fluid {
          margin-top: 4.5%;
        }
        h6 {
          line-height: 1.5rem;
          text-transform: uppercase;
          font-size: 0.9rem;
        }
        .bubble-body,
        .form-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .bubble {
          border-radius: 50%;
          color: #fff;
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          background-color: hsla(0, 0%, 100%, 0.15);
          border-top: 2.2px ridge #799ede;
          box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset,
            rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset,
            rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset,
            rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px,
            rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px,
            rgba(0, 0, 0, 0.09) 0px 32px 16px;
        }
        .bubble-body h6 {
          font-size: x-large;
          font-weight: 700;
        }
        .bubble-body p {
          font-size: small;
        }
        .form-content {
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          background-color: hsla(0, 0%, 100%, 0.15);
          border: 1px ridge #799ede;

          box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.2);
          border-radius: 4px;
          height: fit-content;
          padding: 20px;
          width: 28vw;
        }

        .input {
          width: 100%;
          height: 35px;
          background: transparent;
          border: none;
          border-bottom: 1.9px solid #b9b9b9;
          color: #fff32c;
          font-weight: 400;
        }
        .input:focus {
          border-bottom: 1.9px solid #fff32c;
          box-shadow: none;
          outline: 0;
        }

        textarea {
          width: 100%;
          background: transparent;
          border-radius: 4.5px;
          border: 1.9px solid #b9b9b9;
          color: #fff32c;
          font-weight: 400;
        }
        textarea:focus {
          border: 1.9px solid #fff32c;
          box-shadow: none;
          outline: 0;
        }
        .input::placeholder {
          color: #b9b9b9;
        }
        textarea::placeholder {
          color: #b9b9b9;
        }
        .button {
          width: 100px;
          border-radius: 4px;
          border: none;
          background-color: #fff32c;
          cursor: pointer;
        }
        .button2 {
          width: auto;
          padding: 0.5rem 1.1rem;
          border-radius: 4px;
          border: 2px solid #373435;
          background-color: #373435;
          cursor: pointer;
          color: #ffed00;
          transition: background-color 0.3s, color 0.3s;
        }
        .button2:hover {
          border: 2px solid #373435;
          background-color: #ffed00;
          color: #373435;
        }
        .full-page-image {
          position: relative;
          background: url("/images/web_pics/why2.jpg") center/cover no-repeat;
          width: 100%;
          height: 100vh;
        }

        .full-page-image::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
        }

        .content-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        .full-page-image2 {
          background: url("/images/web_pics/Group 67.png") center/cover
            no-repeat;
          width: 100%;
          height: 360px;
        }
        .full-page-image2 {
          position: relative;
          background: url("/images/web_pics/Group 67.png") center/cover
            no-repeat;
          width: 100%;
          height: 360px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .full-page-image2 .text-content {
          padding: 20px;
        }
        @media screen and (max-width: 720px) {
          .form-content {
            width: 80vw;
          }
          .bubble-body h6 {
            font-size: large;
            font-weight: 600;
          }
          .bubble-body p {
            font-size: xx-small;
          }

          h3 {
            visibility: hidden;
          }
        }
      `}</style>
    </>
  );
};

export default Leads;
