import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";
import { CityNameImage } from "@/allApi/apis";

const NavbarDropdown = () => {
  const route = useRouter();
  const pages = [
    { text: "About Us", href: "/about-us" },
    { text: "Team", href: "/team" },
    { text: "News & Media", href: "/media-and-news" },
    { text: "Contact", href: "/contact-us" },
    { text: "Testimonials", href: "/testimonial" },
    { text: "Blogs", href:"https://blog.gohoardings.com/",taget:"_blank"  },
    { text: "FAQs", href: "/faqs" }
  ];
  

  const directlink = (e) => {
    setCookie("category_name", e);
    setCookie("city_name", "delhi");
  
    CityNameImage.forEach((el) => {
      el.value2 = el.value === e ? true : false;
    });
    route.push(`/${e}`);
  };
  

  return (
    <>
      <div
        className="drop-menu   position-fixed  rounded-0  animate__animated  "
        id="de"
      >
        <div className="container-xxl  container-xl container-lg container-md  ">
          <div className="row m-1 drop-data">
            <div className="col-3 p-0  border-box mb-3">
              <ul className="list-none ms-2">
                {CityNameImage.slice(0, 4).map((e, i) => (
                  <li
                    key={i}
                    onClick={() => directlink(e.value)}
                    className="button text-light text-nowrap is-small is-info"
                  >
                    {e.label}
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-3 p-0 m-0 border-box mb-3">
              <ul className="list-none">
                {CityNameImage.slice(4).map((e, i) => (
                  <li
                    key={i}
                    onClick={() => directlink(e.value)}
                    className="button text-light text-nowrap is-small is-info"
                  >
                    {e.label}
                  </li>
                ))}
                            <li
  onClick={() => window.open("https://influencersea.com/")}
  className="button text-light text-nowrap is-small is-info"
>
  Influencer marketing
</li>
              </ul>
            </div>
            <div className="col-3 p-0 m-0 border-box mb-3">
              <ul className="list-none">
                {pages.slice(0, 4).map((e, i) => (
                  <li key={i}>
                    <Link
                      href={e.href}
                      className="text-decoration-none text-light"
                    >
                      {e.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-3 p-0 m-0 mb-3">
              <ul className="list-none">
                {pages.slice(4).map((e, i) => (
                  <li key={i}>
                    <Link
                      href={e.href}
                      className="text-decoration-none text-light"
                    target={e.taget && e.taget}>
                      {e.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          #de {
            background: #212121;
            opacity: 98% !important;
            width: 93%;
            padding-top: 1.4%;
            box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px,
              rgba(0, 0, 0, 0.22) 0px 15px 12px;
            border: none;
          }
          .write {
            height: 36px;
            width: 46px;
          }
          .drop-nd {
            height: 1px;
          }
          .drop-data ul li {
            color: rgb(103, 103, 103);
            width: 130px;
            padding: 4px;
            cursor: pointer;
            list-style-type: none;
          }
          .drop-data ul li:after {
            display: block;
            content: "";
            border-bottom: solid 1px white;
            transform: scaleX(0);
            transition: transform 300ms ease-in-out;
          }

          .drop-data ul li:hover:after {
            transform: scaleX(1);
          }

          .border-box {
            border-right: 1px solid #c8c9ca;
          }

          #write-btn {
            box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
            opacity: 98%;
            width: 200px;
            font-size: 20px;
            font-weight: 600;
            cursor: pointer;
            height: 49px;
            text-align: center;
            border: none;
            background-size: 300% 100%;
            border-radius: 0px;
            background-color: #fff212;

            --moz-transition: all 0.4s ease-in-out;
            transition: all 0.4s ease-in-out;
          }
        `}
      </style>
    </>
  );
};

export default NavbarDropdown;
