import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {MdKeyboardArrowRight } from "react-icons/md";
import Fixednavbar from "../../components/navbar/fixednavbar";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import Branding from "@/components/branding";
import Head from "next/head";
import Image from "next/image";
import { goh_testimonialsApi } from "@/allApi/apis";


const Testimonial = () => {
  const route = useRouter()
  const [posts, setPosts] = useState([]);

  const staff = async () => {
    const data = await goh_testimonialsApi();
    setPosts(data);
  };

  useEffect(() => {
    staff();
  }, []);
  
  return (
    <>
     <Head>
        <link rel="canonical" href={route.asPath} />
        <title>
          Client testimonials: Gohoarding | Best outdoor ad agency in India
        </title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Explore the voices of our very satisfied clients on Gohoardings testimonial page. India's largets outdoor ad agency and best hoarding advertising company."
        />
        <meta
          name="google-site-verification"
          content="fLT70DRZGdH5FUdrS8w1k2Zg_VTzNJGDF9ie9v4FAzM"
        />
        <meta
          name="keywords"
          content="gohoardings, best hoarding advertising company, hoardings for sell, outdoor hoarding company, best outdoor advertising company, media buyer company, media buyer agencies in india, ooh advertising, ooh ad agency, best ad agency in india, largest advertising agency in india, bus advertising, airport advertising, metro advertising, transit advertising"
        />
        <meta
          property="og:title"
          content="India's Largest Outdoor Advertising Agency | Gohoarding Solution"
        />
        <meta
          property="og:siteName"
          content="www.gohoardings.com - testimonial"
        />
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
          content="www.gohoardings.com - testimonial"
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
      <Branding title="Testimonials" />
      <div className="container  mt-5">
 <h6><span  onClick={()=>route.push("/")} className="bredcamp">Home</span><MdKeyboardArrowRight/><span className="bredcamp text-secondary">Testimonial</span></h6>

        <div className="row testimonial-row mt-5">
         
              {posts && posts.map((el, i) => (
                <div className="col-md-4" key={i}>
                  <div className="testimonials">
                    <Image
                           width={50}
                    height={50}
                      src={
                        el.image
                          ? `https://www.gohoardings.com/gohadmin/uploads/testimonials/${el.image}`
                          : `images/web_pics/user-profile.png`
                      }
                      alt="..."
                    />
                    <h3>{el.name}</h3>
                    <div className="stars">
                      <BsStarFill />
                      <BsStarFill />
                      <BsStarFill />
                      <BsStarHalf />
                      <BsStar />
                    </div>
                    <p dangerouslySetInnerHTML={{ __html: el.testimony }} />
                  </div>
                </div>
              ))}
          
        </div>
      </div>
      <style jsx>
{`

.testimonial-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
  .col{
    flex: 33.33%;
    max-width: 33.33%;
    box-sizing: border-box;
    padding: 15px;
 }
  .testimonials{
    padding: 20px 0;
    background-image: $card_background;
  text-align: center; 
  }
  img{
    width: 100px;
    height: 100px;
    border-radius: 50%;
 }
 .stars{
    color: $yellow;
    margin-bottom: 20px;
 }


`}
        
      </style>
    </>
  );
};

export default Testimonial;
