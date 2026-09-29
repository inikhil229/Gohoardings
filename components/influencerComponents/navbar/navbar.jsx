import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();
  return (
    <>
      <nav className="navbar dekstop-nav">
        <div className="nav-container w-100">
          <section className="nav-container">
            <img
              src="/images/web_pics/logo.png"
              className="logo"
              onClick={() => router.push("/")}
              style={{ cursor: "pointer" }}
            />
          </section>

          <form className="nav-search">
            <button
              className="search-btn  btn-line "
              type="button"
              onClick={() => {
                router.push("#influencer");
              }}
            >
              Our Creators
            </button>

     
          </form>
        </div>
      </nav>

      <style jsx>
        {`
          .navbar {
            background-color: #212121;
            padding: 0.7vw 8.2vw;
          }

          .nav-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            vertical-align: middle;
          }

          .search-btn {
            letter-spacing: 0.5px;
            font-size: 0.9rem;
            border-radius: 1.5px;
            font-weight: 400;
            -webkit-transition: 0.15s linear;
            transition: 0.25s linear;
          
          }
          .btn-fill {
            padding: 0.51rem 1.05rem;

            background-color: #FFF212;
            border: transparent;
            color:#212121;
           
          }

          // .btn-fill:hover {
          //   background: linear-gradient(96deg, #ff4600 0%, #db7e00 100%);
          // }

          .btn-line {
            color: #FFF212;
            padding: 0.4rem 1rem;
            background: transparent;
            border: 2.5px solid #FFF212;
          
          }
          .btn-line:hover {
            background-color: #FFF212;
            box-shadow: 0 1px 10px rgba(248, 249, 250, 0.4);
            color:#212121;
          }

          @media screen and (max-width: 768px) {
            .logo {
              height: 1.4rem;
            }
            .search-btn {
              letter-spacing: 0.3px;
              font-size: 0.8rem;
              padding: 0.5rem;
            }
            .navbar {
              padding: 2vw 1.8vw;
            }
          }
        `}
      </style>
    </>
  );
};

export default Navbar;
