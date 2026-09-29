import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import NavbarBlog from "@/components/navbar/blognav";
import { FaRegEye } from "react-icons/fa";
import Head from "next/head";

const Blog = ({ blogs, blogsp, headtag }) => {
  const router = useRouter();
  const { asPath } = useRouter();
  const formatDate = (dateTimeString) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour12: true,
    };
    const formattedDateTime = new Date(dateTimeString).toLocaleString(
      "en-US",
      options
    );
    return formattedDateTime;
  };

  const sortByPopularity = (a, b) => b.popularity - a.popularity;

  const popularPosts = blogsp.sort(sortByPopularity).slice(0, 5);

  return (
    <>
      <Head>
        <link rel="canonical" href={`https://www.gohoardings.com${asPath}`} />
        <title>{headtag.title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content={headtag.descrp} />
        <meta
          name="google-site-verification"
          content="fLT70DRZGdH5FUdrS8w1k2Zg_VTzNJGDF9ie9v4FAzM"
        />
        <meta name="keywords" content={headtag.keywrd} />
        <meta property="og:title" content={headtag.title} />
        <meta property="og:siteName" content="www.gohoardings.com" />
        <meta property="og:description" content={headtag.descrp} />
        <meta property="og:type" content="en_US" />
        <meta property="og:url" href={`https://www.gohoardings.com${asPath}`} />
        <meta property="og:property" content="en_US" />
        <meta property="twitter:title" content={headtag.title} />
        <meta property="twitter:siteName" content="www.gohoardings.com" />
        <meta property="twitter:description" content={headtag.descrp} />
        <meta property="twitter:type" content="en_US" />
        <meta
          property="twitter:url"
          href={`https://www.gohoardings.com${asPath}`}
        />
        <meta property="twitter:property" content="en_US" />
      </Head>

      <NavbarBlog />

      <div className="container mb-5 mt-3">
        <div className="row">
          <div className="col-lg-8 col-md-12">
            {blogs.length > 1 ? (
              blogs.map((blog, index) => (
                <div className="blog-item my-4" key={index}>
                  <div className="d-md-flex">
                    <div className="position-relative">
                      <img
                        src={blog.image}
                        alt={blog.url}
                        className="mr-3 main-blog-img2"
                      />
                      <div className="image-overlay" />
                    </div>
                    <h5 className="mt-1 ms-1">{blog.blogCategory}</h5>
                    <div className="ms-4">
                      <h1
                        onClick={() => router.push(`/blog/${blog.url}`)}
                        className="blogTitle"
                      >
                        {blog.title}
                      </h1>
                      <div className="blog-details">
                        <p>
                          {blog.created_by}{" "}
                          <span>&#128337; {formatDate(blog.CreatedOn)}</span>{" "}
                          <span>
                            <FaRegEye className="ms-2 me-1" />
                            {blog.popularity}
                          </span>
                        </p>
                        <p>{blog.summary}</p>
                        <div className="">
                          <Link href={`/blog/${blog.url}`}>Read More...</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>
                {blogs.map((blog, index) => (
                  <div className="blog-item my-4" key={index}>
                    <h1>{blog.title}</h1>
                    <h2 className="fw-bold">{blog.summary}</h2>
                    <div className="blog-details">
                      <p>
                        {blog.created_by}{" "}
                        <span>&#128337; {formatDate(blog.CreatedOn)}</span>{" "}
                        <span>
                          <FaRegEye className="ms-2 me-1" />
                          {blog.popularity}
                        </span>
                      </p>
                    </div>
                    <center>
                      <img
                        src={blog.image}
                        alt={blog.url}
                        className="main-blog-img mb-4"
                      />
                    </center>
                    <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                  </div>
                ))}
              </>
            )}
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
                        increasePopularity(blog.url),
                          router.push(`/blog/${blog.url}`);
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
        <style jsx>{`
          .image-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(
              0,
              0,
              0,
              0.5
            ); /* Semi-transparent black color */
          }
          h1,
          h6,
          p {
            color: #333;
            line-height: 1.4;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            transition: color 0.2s;
          }

          h1 {
            font-size: 30px;
            font-weight: 400;
          }

          h3 {
            font-weight: 400;
          }

          h2,
          h6 {
            font-size: 14px;
            font-weight: 500;
          }

          h5 {
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

          .btn-left,
          .btn-right {
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
            height: 360px;
            width: 600px;
            // max-width: 600px;
          }
          @media screen and (max-width: 768px) {
            .main-blog-img {
              max-width: 100%;
            }
          }
          .main-blog-img2 {
            max-width: 400px;
          }

          .popular-blog-img {
            max-width: 100px;
          }
        `}</style>
      </div>
    </>
  );
};

export async function getServerSideProps({ params }) {
  const blogUrl = params.blog_url;

  try {
    const response1 = await fetch("https://www.gohoardings.com/api/blogs");
    const response2 = await fetch("https://www.gohoardings.com/api/blogs", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: blogUrl, limit: 10000 }),
    });

    if (!response1.ok || !response2.ok) {
      throw new Error("Failed to fetch data");
    }

    const blogsp = await response1.json();
    const blogs = await response2.json();

    const capturl = `${blogUrl.charAt(0).toUpperCase() + blogUrl.slice(1)} -`;

    const headtagsbycat = {
      title: `${capturl} Top Outdoor Advertising Agencies in Noida - Best Outdoor Media Management Services Delhi near me - Gohoardings.com - Top Outdoor Advertising Agencies in Noida - Best Outdoor Media Management Services Delhi near me - Gohoardings.com`,
      descrp: `${capturl} Outdoor Advertising Agencies in Noida, Delhi. Find ✓Advertising Agencies, ✓Printing Services, ✓Flex Printing Services, ✓Newspaper Advertising Agencies, ✓Pamphlet Printers in Noida, Delhi. Get Phone Numbers, Address, Reviews, Photos, Maps , FAQs for top Outdoor Advertising Agencies near me in Noida, Delhi on Gohoardings.com`,
      keywrd: `${capturl} List of Outdoor Advertising Agencies in Noida, Delhi, Reviews, Map, Address, Phone number, Contact Number, local, popular Outdoor Advertising Agencies, Outdoor Advertising Agencies, outdoor advertising agencies in Noida, outdoor advertising companies in Noida, an outdoor advertising agency in Noida, an outdoor ad agency in Noida, outdoor ad agencies in Noida, an outdoor advertising company in Noida, outdoor advertising services in Noida, outdoor ad company in Noida, outdoor ad services in Noida `,
    };

    const headtagsbyurl = {
      title: blogs.data[0].title,
      descrp: blogs.data[0].summary,
      keywrd: blogs.data[0].keywords,
    };

    let headtag;
    if (blogs.data.length > 1) {
      headtag = headtagsbycat;
    } else {
      headtag = headtagsbyurl;
    }

    return {
      props: {
        blogsp: blogsp.data,
        blogs: blogs.data,
        headtag: headtag,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        blogs: [],
        blogsp: [],
        headtag: {},
      },
    };
  }
}

export default Blog;
