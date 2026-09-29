import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { fetchBlogs } from "@/allApi/apis";
import { FaArrowRight } from "react-icons/fa";

const GohBlog = () => {
  const route = useRouter();
  const [posts, setPosts] = useState([]);

  const allBlog = async () => {
    const data = await fetchBlogs();
    setPosts(data.data);
  };

  useEffect(() => {
    allBlog();
  }, []);

  return (
    <div className="container">
      <h2 className="mt-md-5 mt-3 mb-4">
        <strong>Popular Blog Posts</strong>{" "}
        <button
          className="float-end"
          onClick={() =>
            route.push({
              pathname: "/blog",
              query: { posts: JSON.stringify(posts) },
            })
          }
        >
          View All <FaArrowRight className="ms-1" />
        </button>
      </h2>
      <div className="image-row">
        {posts &&
          posts.slice(0, 6).map((blog, index) => (
            <a
              key={index}
              href={`https://gohoardings.com/blog/${blog.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="image-container pnt text-decoration-none text-dark"
            >
              <img src={blog.image} alt={blog.url} />
              <p className="card-title mt-2 ">{blog.title}</p>
            </a>
          ))}
      </div>
      <style jsx>{`
        .image-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .image-container {
          width: calc(33.33% - 20px);
          margin-bottom: 20px;
        }
        img {
          // max-width: 100%;
          width: 400px;
          height: 280px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        a:hover {
          color: #000100 !important;
        }
        .card-title {
          font-size: 16px;
          // color: rgb(57, 55, 55);
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        h2 button {
          font-size: 16px;
          padding: 9px;
          border: none;
          background: none;
          border-radius: 5px;
        }
        @media screen and (max-width: 768px) {
          .image-container {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default GohBlog;
