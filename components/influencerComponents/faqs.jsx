import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { faqs as posts } from "@/assets/scss/faqs";


const FaqsInfluencer = () => {
  return (
    <>
      <div className="container-xxl  container-xl container-lg container-md   mb-md-4   mb-0 clients ">
        <h2 className="text-center">FAQs</h2>
        <div className="row my-3">
          <div className="col-md-6">
            {posts.slice(0, 4).map((data, i) => {
              let abc = "a" + data.id;
              return (
                <div className="question-box mt-3" key={i}>
                  <div
                    className=" toggle-btn p-3 ps-2 mb-0 "
                    data-bs-toggle="collapse"
                    data-bs-target={`#${abc}`}
                  >
                    <h4>
                      {data.qsn}
                      <IoIosArrowDown className="down float-end" />
                    </h4>
                  </div>
                  <div className="collapse" id={abc}>
                    <div className="card-body  p-2 pt-0 pb-2">
                      <small>{data.ans}</small>
                      <br />
                      <small className="mt-3">{data.ans2 && data.ans2}</small>
                      <br />
                      <small className="mt-3">{data.ans3 && data.ans3}</small>
                      <br />
                      <small className="mt-3">{data.ans4 && data.ans4}</small>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="col-md-6">
            {posts.slice(4, 8).map((data, i) => {
              let abc = "a" + data.id;
              return (
                <div className="question-box mt-3" key={i}>
                  <div
                    className=" toggle-btn p-3 ps-2 mb-0 "
                    data-bs-toggle="collapse"
                    data-bs-target={`#${abc}`}
                  >
                    <h4>
                      {data.qsn}
                      <IoIosArrowDown className="down float-end" />
                    </h4>
                  </div>
                  <div className="collapse" id={abc}>
                    <div className="card-body  p-2 pt-0 pb-3">
                      <small>{data.ans}</small>
                      <br />
                      <small className="mt-3">{data.ans2 && data.ans2}</small>
                      <br />
                      <small className="mt-3">{data.ans3 && data.ans3}</small>
                      <br />
                      <small className="mt-3">{data.ans4 && data.ans4}</small>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <style jsx>
          {`
            h2 {
              font-size: 2.2rem;
              font-weight: 700;
              color: #373435;
            }
            .question-box {
              background-color: #fefefe;
              box-shadow: rgba(98, 98, 105, 0.2) 0px 7px 29px 0px;
              border-radius: 4.5px;
            }

            .toggle-btn h4 {
              cursor: pointer;
              font-size: 19px;
              color: rgb(57, 55, 55);
              margin-bottom: 0rem;
            }

            .collapse {
              background: transparent;
            }

            .down {
              float: right;
              color: rgb(89, 85, 85);
            }

            @media screen and (max-width: 1366px) {
              .toggle-btn h4 {
                font-size: 16px;
              }
            }
          `}
        </style>
      </div>
    </>
  );
};

export default FaqsInfluencer;
