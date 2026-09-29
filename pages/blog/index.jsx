import { useRef,useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Slider from "react-slick";
import { useRouter } from "next/router";
import NavbarBlog from "@/components/navbar/blognav";
import { blogpopincrs } from "@/allApi/apis";
import { FaRegEye } from "react-icons/fa";
export default function Blog({ }) {
  const router = useRouter();
  const { asPath } = useRouter();
  const sliderRef = useRef(null);
  const blogs = JSON.parse(router.query.posts);
  var settings = {
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    speed: 3000,
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

  let slider = settings;

  const handleNextSlide = () => {
    sliderRef.current.slickNext();
  };

  const handlePrevSlide = () => {
    sliderRef.current.slickPrev();
  };

  const formatDate = (dateTimeString) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour12: true,
    };
    const formattedDateTime = new Date(dateTimeString).toLocaleString(
      "en-US",
      options,
    );
    return formattedDateTime;
  };

  const increasePopularity = async (url) => {
    const data = await blogpopincrs(url);
  };

  const popblog = [...blogs];

  const sortByPopularity = (a, b) => b.popularity - a.popularity;

  const popularPosts = popblog.sort(sortByPopularity).slice(0, 5);

  return (
    <>
      <Head>
        <link rel="canonical" href={`https://www.gohoardings.com${asPath}`} />
        <title>
          Top Outdoor Advertising Agencies in Noida - Best Outdoor Media
          Management Services Delhi near me - Gohoardings.com - Top Outdoor
          Advertising Agencies in Noida - Best Outdoor Media Management Services
          Delhi near me - Gohoardings.com
        </title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Outdoor Advertising Agencies in Noida, Delhi. Find ✓Advertising Agencies, ✓Printing Services, ✓Flex Printing Services, ✓Newspaper Advertising Agencies, ✓Pamphlet Printers in Noida, Delhi. Get Phone Numbers, Address, Reviews, Photos, Maps , FAQs for top Outdoor Advertising Agencies near me in Noida, Delhi on Gohoardings.com"
        />
        <meta
          name="google-site-verification"
          content="fLT70DRZGdH5FUdrS8w1k2Zg_VTzNJGDF9ie9v4FAzM"
        />
        <meta
          name="keywords"
          content="List of Outdoor Advertising Agencies in Noida, Delhi, Reviews, Map, Address, Phone number, Contact Number, local, popular Outdoor Advertising Agencies, Outdoor Advertising Agencies, outdoor advertising agencies in Noida, outdoor advertising companies in Noida, an outdoor advertising agency in Noida, an outdoor ad agency in Noida, outdoor ad agencies in Noida, an outdoor advertising company in Noida, outdoor advertising services in Noida, outdoor ad company in Noida, outdoor ad services in Noida"
        />
        <meta
          property="og:title"
          content="Top Outdoor Advertising Agencies in Noida - Best Outdoor Media Management Services Delhi near me - Gohoardings.com - Top Outdoor Advertising Agencies in Noida - Best Outdoor Media Management Services Delhi near me - Gohoardings.com"
        />
        <meta property="og:siteName" content="www.gohoardings.com" />
        <meta
          property="og:description"
          content="Outdoor Advertising Agencies in Noida, Delhi. Find ✓Advertising Agencies, ✓Printing Services, ✓Flex Printing Services, ✓Newspaper Advertising Agencies, ✓Pamphlet Printers in Noida, Delhi. Get Phone Numbers, Address, Reviews, Photos, Maps , FAQs for top Outdoor Advertising Agencies near me in Noida, Delhi on Gohoardings.com"
        />
        <meta property="og:type" content="en_US" />
        <meta property="og:url" href={`https://www.gohoardings.com${asPath}`} />
        <meta property="og:property" content="en_US" />
        <meta
          property="twitter:title"
          content="Top Outdoor Advertising Agencies in Noida - Best Outdoor Media Management Services Delhi near me - Gohoardings.com - Top Outdoor Advertising Agencies in Noida - Best Outdoor Media Management Services Delhi near me - Gohoardings.com"
        />
        <meta property="twitter:siteName" content="www.gohoardings.com" />
        <meta
          property="twitter:description"
          content="Outdoor Advertising Agencies in Noida, Delhi. Find ✓Advertising Agencies, ✓Printing Services, ✓Flex Printing Services, ✓Newspaper Advertising Agencies, ✓Pamphlet Printers in Noida, Delhi. Get Phone Numbers, Address, Reviews, Photos, Maps , FAQs for top Outdoor Advertising Agencies near me in Noida, Delhi on Gohoardings.com"
        />
        <meta property="twitter:type" content="en_US" />
        <meta
          property="twitter:url"
          href={`https://www.gohoardings.com${asPath}`}
        />
        <meta property="twitter:property" content="en_US" />
      </Head>
      <NavbarBlog />
      <div
        className="position-relative mt-3"
        style={{ maxWidth: "100%", overflowX: "hidden" }}
      >
        <Slider {...slider} ref={sliderRef}>
          {blogs &&
            blogs.map((blog, i) => (
              <div className="slide-item" key={i}>
                <div className="">
                  <div className="image-container">
                    <Link
                      href={`/blog/${blog.url}`}
                      onClick={() => increasePopularity(blog.url)}
                    >
                      {/* <img
                        width="440px"
                        height="290px" // <-- set fixed height
                        style={{ objectFit: "cover" }} // <-- keeps aspect ratio nicely
                        src={blog.image}
                        alt={blog.url}
                      /> */}
                      <img
                        height="300"
                        width="100%"
                        src={blog.image}
                        alt={blog.url}
                      />

                      <div className="blog-summary">
                        <h6 className="mt-2 text-light text-shadow">
                          {blog.title}
                        </h6>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </Slider>

        <div className="custom-buttons">
          <button
            className="btn btn-left text-light bg-black bg-opacity-75"
            onClick={handlePrevSlide}
          >
            <strong>&lt;</strong>
          </button>
          <button
            className="btn btn-right text-light bg-black bg-opacity-75"
            onClick={handleNextSlide}
          >
            <strong>&gt;</strong>
          </button>
        </div>
      </div>
      <div className="container my-5">
        <div className="row">
          <div className="col-lg-8 col-md-12">
            {blogs.map((blog, index) => (
              <div className="blog-item my-4" key={index}>
                <div className="d-md-flex ">
                  <div className="position-relative">
                    <img
                      src={blog.image}
                      alt={blog.url}
                      className="mr-3 main-blog-img"
                    />
                    <div className="image-overlay" />
                  </div>
                  <h5 className="mt-1 ms-md-1">{blog.blogCategory}</h5>
                  <div className="ms-md-4">
                    <h1
                      onClick={() => {
                        (increasePopularity(blog.url),
                          router.push(`/blog/${blog.url}`));
                      }}
                      className="blogTitle"
                    >
                      {blog.title}
                    </h1>
                    <div className="blog-details">
                      <p>
                        {blog.created_by}{" "}
                        <span>
                          &#128337; {formatDate(blog.CreatedOn)}{" "}
                          <span>
                            {" "}
                            <FaRegEye className="ms-2 me-1" />
                            {blog.popularity}
                          </span>{" "}
                        </span>
                      </p>
                      <p>{blog.summary}</p>
                      <div className="">
                        <Link
                          href={`/blog/${blog.url}`}
                          onClick={() => increasePopularity(blog.url)}
                        >
                          Read More...
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="col-lg-4 col-md-12">
            <div className="popular-section">
              <h4>Popular Posts</h4>
              {popularPosts.map((blog, index) => (
                <div className="popular-post d-flex my-3" key={index}>
                  <Link
                    href={`/blog/${blog.url}`}
                    onClick={() => increasePopularity(blog.url)}
                  >
                    <img
                      src={blog.image}
                      alt={blog.url}
                      className="mr-3 popular-blog-img"
                    />
                  </Link>
                  <div className="ms-3">
                    <h6
                      onClick={() => {
                        (increasePopularity(blog.url),
                          router.push(`/blog/${blog.url}`));
                      }}
                      className="blogTitle"
                    >
                      {blog.title}
                    </h6>
                    <p>
                      Gohoardings{" "}
                      <span>
                        &#128337; {formatDate(blog.CreatedOn)}{" "}
                        <span>
                          {" "}
                          <FaRegEye className="ms-2 me-1" />
                          {blog.popularity}
                        </span>
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
      .text-shadow{
      display: block;
    line-height: 28px;
    text-shadow: 0 0.5px 0.5px rgba(30, 30, 30, 0.4);
    font-size: 21px;
    font-weight: 400;
    margin: 10px 0 5px 0;
      }
       .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black color */
  }
  h1, h6, p {
    color: #333;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    transition: color 0.2s;
  }

  h1 {
    font-size: 22px;
    font-weight: 500;
  }

  h6 {
    font-size: 14px;
    font-weight: 500;
  }
  
  h5{
    background-color: #0291b1;
    display: inline-block;
    position: absolute;
    font-size: 11px;
    font-weight: 400;
    color: #fff;
    height: 1.8em;
    line-height: 1.8;
    padding: 0 12px;
    border-radius: 2px;
    cursor: pointer;
    pointer-events: auto;
    white-space: nowrap;
    z-index: 100;
  }
  p {
    color: #888;
    font-size: 13px;
    font-weight: 400;
    margin-top: 10px;
    -webkit-line-clamp: 4;
  }

  .btn-left, .btn-right {
    position: absolute;
    top: 50%;

    transform: translateY(-50%);
  }

  .btn-left {
    left: 20px;
  }

  .btn-right {
    right: 20px;
  }

  .image-container {
    position: relative;
  }

  .blogTitle:hover {
    cursor: pointer;
    color: rgb(0 126 255 / 65%);
  }

  .blog-summary {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    width: 80%;
    padding: 5px 10px;
    text-align: center;
  }

  .main-blog-img {
    width: 400px;
    height: 266px;
  }

  .popular-blog-img {
    max-width: 100px;
  }
  @media screen and (max-width: 768px) {
    h5{
     
      position: relative;
  }
`}</style>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const response = await fetch("https://gohoardings.com/api/blogs");
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const blogs = await response.json();

    return {
      props: {
        blogs: blogs.data,
      },
    };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return {
      props: {
        blogs: [],
      },
    };
  }
}
