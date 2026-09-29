import React, { useState, useEffect } from "react";
import CampaignForm from "./campaignForm";
import InfluencerForm from "./influencerForm";

const ContactUs = () => {
  const [categories, setCategories] = useState([
    { id: 1, category: "Brand", selected: true },
    { id: 2, category: "Influencer", selected: false },
  ]);
  const [selectButton, setSelectButton] = useState("");

  const directlink = (categoryId) => {
    const updatedCategories = categories.map((category) => ({
      ...category,
      selected: category.category === categoryId,
    }));
    setSelectButton(categoryId);
    setCategories(updatedCategories);
  };

  return (
    <>
      <div className="contact py-4">
        <div
          className={`container-xxl  container-xl container-lg container-md `}
        >
          <div className="row">
            <form className="nav-search text-center ">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className="search-btn  btn-line-filter"
                  type="button"
                  aria-expanded={category.selected}
                  onClick={() => {
                    directlink(category.category);
                  }}
                >
                  For {category.category}
                </button>
              ))}
            </form>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="card  ">
              {selectButton === "Brand" ? <CampaignForm /> : <InfluencerForm />}
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .card {
            width: 50vw;
            background-color: #212121;
          }
          .search-btn {
            letter-spacing: 1px;
            font-size: 1.1rem;
            border-radius: 1.5px;
            font-weight: 400;
            -webkit-transition: 0.15s linear;
            transition: 0.25s linear;
          }

          .btn-line-filter {
            color: #212121;
            padding: 0.4rem 1rem;
            background: transparent;
            border: none;
            margin: 1rem;
            font-weight: 600;
          }
          .btn-line-filter:hover {
            background-color: #fff212;
            box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
              rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
            color: #212121;
          }
          .btn-line-filter[aria-expanded="true"] {
            background-color: #fff212;
            box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
              rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
            color: #212121;
          }
          @media screen and (max-width: 540px) {
            .card {
              width: 100vw;
            }
          }
        `}
      </style>
    </>
  );
};

export default ContactUs;
