import React, { useState, useEffect } from "react";
import Image from "next/image";
import { influencerAll } from "@/allApi/apis";
const OurInfluencer = () => {
  const [posts, setPosts] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [categories, setCategories] = useState([
    { id: 1, category: "All", selected: true },
    { id: 2, category: "Celebrities", selected: false },
    { id: 3, category: "Fashion/Lifestyle", selected: false },
    { id: 4, category: "Tech Bloggers", selected: false },
    { id: 5, category: "Food Bloggers", selected: false },
  ]);

  const getInfluencer = async () => {
    const data = await influencerAll();
    setPosts(data);
    setFilterData(data);
  };
  const directlink = (selectedCategory) => {
    const formattedSelectedCategory = selectedCategory
      .toLowerCase()
      .replace(/\s/g, "");

    if (formattedSelectedCategory === "all") {
      setFilterData(posts);
    } else {
      const data = posts.filter(
        (post) =>
          post.category.toLowerCase().replace(/\s/g, "") ===
          formattedSelectedCategory
      );
      setFilterData(data);
    }

    const updatedCategories = categories.map((category) => ({
      ...category,
      selected:
        formattedSelectedCategory === "all"
          ? category.category.toLowerCase().replace(/\s/g, "") ===
            formattedSelectedCategory
          : category.category.toLowerCase().replace(/\s/g, "") ===
            formattedSelectedCategory,
    }));

    setCategories(updatedCategories);
  };

  useEffect(() => {
    getInfluencer();
  }, []);

  return (
    <>
      <div className="influencer py-4" id="influencer">
        <div
          className={`container-xxl  container-xl container-lg container-md `}
        >
          <div className="row">
            <form className="nav-search text-center">
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
                  {category.category}
                </button>
              ))}
            </form>

            <div className="all-influencer pt-md-5 pe-0">
              {filterData && filterData.length > 0 ? (
                filterData.map((data, i) => (
                  <div className="card my-2" style={{ width: "19rem" }} key={i}>
                    <img
                      className="card-img-top card-img card-img"
                      src={data.image}
                      alt="Card image cap"
                    />
                    <div className="card-body text-center py-2 ">
                      <h6 className="">{data.name}</h6>

                      <p className="my-0">
                        <Image
                          width={15}
                          height={15}
                          src="/images/web_pics/insta.png"
                          alt="/images/web_pics/insta.png"
                          className="img-fluid logo-img"
                        />{" "}
                        {data.instagram_id} : {data.instagram_follower}+
                      </p>
                      <p className="my-0">
                        <Image
                          width={15}
                          height={15}
                          src="/images/web_pics/facebook.png"
                          alt="/images/web_pics/facebook.png"
                          className="img-fluid logo-img"
                        />{" "}
                        {data.facebook_id} : {data.facebook_follower} +
                      </p>
                      <p className="my-0">
                        <Image
                          width={15}
                          height={15}
                          src="/images/web_pics/youtube.png"
                          alt="/images/web_pics/youtube.png"
                          className="img-fluid logo-img"
                        />{" "}
                        {data.youtube_id} : {data.youtube_follower}+ 
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h6 className="text-center w-100">
                  No Influencer in this category{" "}
                </h6>
              )}
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .influencer {
            background-color: #f1f1f1;
          }
          .search-btn {
            letter-spacing: 0.5px;
            font-size: 0.9rem;
            border-radius: 1.5px;
            font-weight: 400;
            -webkit-transition: 0.15s linear;
            transition: 0.25s linear;
          }
          .card-img {
            height: 250px;
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
          .all-influencer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1.2rem;
            flex-wrap: wrap; /* Allow items to wrap to the next line */
          }

          .card {
            flex-basis: calc(
              25% - 1.2rem
            ); /* Set the initial size for four cards in a row */

            /* Adjust styles for screens 768px or smaller */
            @media (max-width: 768px) {
              flex-basis: calc(100% - 1.2rem); /* Show one card in a row */
            }
          }

          .card-body {
            background-color: #fff212;
          }
          .logo-img {
            height: 15px;
            width: 15px;
          }
          p {
            font-size: 14px;
            font-weight: 400;
          }
          h6 {
            color: #00000;

            font-weight: 800;
          }
          .nav-search {
            border-bottom: 1.8px solid gray;
            // width:fit-content;
          }
          @media (max-width: 768px) {
            .btn-line-filter {
              padding: 0.4rem 0.6rem;

              margin: 0.4rem;
            }
            .search-btn {
              font-size: 0.8rem;
            }
          }
        `}
      </style>
    </>
  );
};

export default OurInfluencer;
