import React, { useEffect, useState } from "react";
import { BsFillCircleFill } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import Fixednavbar from "@/components/navbar/fixednavbar";
import { MdKeyboardArrowRight } from "react-icons/md";
import Head from "next/head";
import { useRouter } from "next/router";
import { faqs as posts } from "@/assets/scss/faqs";

const Faqs = () => {
  const route = useRouter();
  return (
    <>
      <Head>
        <link
          rel="canonical"
          href={`https://www.gohoardings.com${route.asPath}`}
        />
        <title>
          FAQ About Best Hoarding Advertising Company | Gohoardings.com
        </title>
        <meta charSet="utf-8" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Get answers to your questions about hoarding advertising from GoHoardings, your trusted and largest hoarding company and media buyer. FAQs made simple."
        />
        <meta
          name="google-site-verification"
          content="fLT70DRZGdH5FUdrS8w1k2Zg_VTzNJGDF9ie9v4FAzM"
        />
        <meta
          name="keywords"
          content="gohoardings, go hoardings, media buyer, advertising agency, hoarding advertising company, outdoor media company, outdoor advertisment, hoarding for sale, hoarding promotions, ooh ad agency, best ad agency in india, largest advertising agency in india, bus advertising, airport advertising, metro advertising, transit advertising"
        />
        <meta
          property="og:title"
          content="India's Largest Outdoor Advertising Agency | Gohoarding Solution"
        />
        <meta property="og:siteName" content="www.gohoardings.com/faqs" />
        <meta
          property="og:description"
          content="India's Largest Outdoor Advertising Agency. We are helping business to grow offline with hoardings, billboards ads, bus shelters, metro pillars, airport, and office brandings | Gohoardings"
        />
        <meta property="og:type" content="en_US" />
        <meta
          property="og:url"
          href={`https://www.gohoardings.com${route.asPath}`}
        />
        <meta property="og:property" content="en_US" />
        <meta
          property="twitter:title"
          content="India's Largest Outdoor Advertising Agency | Gohoarding Solution"
        />
        <meta
          property="twitter:siteName"
          content="www.gohoardings.com/about-us"
        />
        <meta
          property="twitter:description"
          content="India's Largest Outdoor Advertising Agency. We are helping business to grow offline with hoardings, billboards ads, bus shelters, metro pillars, airport, and office brandings | Gohoardings"
        />
        <meta property="twitter:type" content="en_US" />
        <meta
          property="twitter:url"
          href={`https://www.gohoardings.com${route.asPath}`}
        />
        <meta property="twitter:property" content="en_US" />
      </Head>
      <Fixednavbar />
      <div className="d-hide drop-nd"></div>
      <div className="container-xxl  container-xl container-lg container-md container-faqs pt-4">
        <h6 className="mt-5 pt-5">
          <span onClick={() => route.push("/")} className="bredcamp">
            Home
          </span>
          <MdKeyboardArrowRight />
          <span className="bredcamp text-secondary">
            Frequently Asked Questions
          </span>
        </h6>
        <h1 className=" mt-4 mb-4">Frequently Asked Questions</h1>
        <section className="mt-5 mb-5">
          {posts.map((data, index) => {
            let abc = "a" + data.id;
            return (
              <div className="question-box mt-3" key={index}>
                <p
                  className=" toggle-btn p-3 ps-2 mb-0 "
                  data-bs-toggle="collapse"
                  data-bs-target={`#${abc}`}
                >
                  <h4>
                    <BsFillCircleFill className="point me-2" /> {data.subject}
                    <IoIosArrowDown className="down float-end" />
                  </h4>
                </p>
                <div className="collapse" id={abc}>
                  <div className="card-body  pb-1 ps-5 pe-4">
                    <h5>{data.description}</h5>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </div>

      <style jsx>
        {`
          h1 {
            font-weight: 700;
            font-size: 3.1rem;
            color: black;
          }
          .question-box {
            background-color: #fefefe;
            box-shadow: rgba(98, 98, 105, 0.2) 0px 7px 29px 0px;
          }

          .toggle-btn h4 {
            cursor: pointer;
            font-size: 19px;
            color: rgb(57, 55, 55);
          }

          .collapse {
            background: transparent;
          }

          h5 {
            font-weight: 700;
            cursor: pointer;
            font-size: 1.3rem;
            color: black;
          }

          .down {
            float: right;
            color: rgb(89, 85, 85);
          }

          .point {
            color: rgb(168, 162, 162);
          }

          @media screen and (max-width: 1366px) {
            .toggle-btn h4 {
              font-size: 16px;
            }
            .card-body h5 {
              font-size: 14px;
            }
          }
        `}
      </style>
    </>
  );
};

export default Faqs;
