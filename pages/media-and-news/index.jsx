import React, {useEffect, useState} from "react";
import Branding from "@/components/branding";
import Fixednavbar from "@/components/navbar/fixednavbar";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { goh_media_and_newsApi } from "@/allApi/apis";
import {MdKeyboardArrowRight } from "react-icons/md";
import { useRouter } from "next/router";

const Newsmedia = () => {
  const route = useRouter()
  const [posts, setPosts] = useState([])
  const staff = async() =>{
    const data = await goh_media_and_newsApi()
    setPosts(data.data)
  }
 
  useEffect(()=>{
    staff()
  },[])
  const {asPath} = useRouter();
  return (
    <>
      <Head>
        <link rel="canonical" href={`https://www.gohoardings.com${asPath}`} />
        <title>
          Gohoardings | Hoarding Advertising Agency | News and Media
        </title>
        <meta charSet="utf-8" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Gohoardings: Your Premier Hoarding Company in India. Stay Informed with News and Media Updates. Elevate Your Outdoor Advertising Strategy Today"
        />
        <meta
          name="google-site-verification"
          content="fLT70DRZGdH5FUdrS8w1k2Zg_VTzNJGDF9ie9v4FAzM"
        />
        <meta
          name="keywords"
          content="gohoardings, gohoarding, outdoor advertising agency in, outdoor advertising agency, outdoor advertising agencies, outdoor ad agency, outdoor advertising companies in delhi, outdoor advertising agencies in delhi, outdoor advertising delhi, outdoor advertising agency in delhi, outdoor media agency, ad agency in delhi, outdoor advertising agencies in gurgaon, outdoor marketing companies, top 5 advertising agencies in delhi, outdoor advertising mumbai, advertising agencies in delhi ncr"
        />

        <meta
          property="og:title"
          content="  News and Media | Gohoardings.com"
        />
        <meta
          property="og:siteName"
          content="www.gohoardings.com/media-and-news"
        />
        <meta
          property="og:description"
          content="Gohoardings: Your Premier Hoarding Company in India. Stay Informed with News and Media Updates. Elevate Your Outdoor Advertising Strategy Today"
        />
        <meta property="og:type" content="en_US" />
        <meta property="og:url" href={`https://www.gohoardings.com${asPath}`} />
        <meta property="og:property" content="en_US" />
        <meta
          property="twitter:title"
          content="  News and Media | Gohoardings.com"
        />
        <meta
          property="twitter:siteName"
          content="www.gohoardings.com/media-and-news"
        />
        <meta
          property="twitter:description"
          content="Gohoardings: Your Premier Hoarding Company in India. Stay Informed with News and Media Updates. Elevate Your Outdoor Advertising Strategy Today"
        />
        <meta property="twitter:type" content="en_US" />
        <meta
          property="twitter:url"
          href={`https://www.gohoardings.com${asPath}`}
        />
        <meta property="twitter:property" content="en_US" />
      </Head>
  <Fixednavbar/>
  <div className="d-hide drop-nd" >
      </div>
      <Branding title="News & Media" />
      <section className="mt-5">
        <div className="container-fluid px-5 news ">
    
          
          {posts && posts.map((el,i) =>(
            <>
             <div className="row mt-3" key={i}>
             <div className="col-md-4">
               <Image
                           width={500}
                           height={500}
              
                 src={el.image}
                 className="img-fluid rounded-start"
                 alt="..."
                 id="news_events"
               />
             </div>
             <div className="col-md-8">
  <div className="card-body ">
    <Link href={el.url} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
      <h1 className="blogTitle">
        {el.title}
      </h1>
    </Link>
    <h2 className="text-muted">
      {`Last updated ${el.update_on.split("T", 1)}`}
    </h2>
    <h3 className="blog-summary">{el.summary}</h3>
    <Link className="text-decoration-none" href={el.url} target="_blank" rel="noopener noreferrer">Read More...</Link>
  </div>
</div>

           
           </div>
           
            </>
           ))}
         <h6 className="mt-3"><span  onClick={()=>route.push("/")} className="bredcamp">Home</span><MdKeyboardArrowRight/><span className="bredcamp text-secondary">Media-and-news</span></h6>
    
        
        </div>
      </section>
      <style jsx>
        {`
        
       h1, h6{
        color: #333;
        line-height: 1.5;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        transition: color 0.2s;
      }
      .drop-nd{
        height: 14px;
      }
      h1 {
        font-size: 22px;
        font-weight: 500;
      }
    
      h2 {
        color: #888;
        font-size: 14px;
        font-weight: 400;
      }
      h3{
      
        font-size: 15px;
        font-weight: 400;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 6;
        -webkit-box-orient: vertical;
        transition: color 0.2s;
      }
      .blogTitle:hover {
        cursor: pointer;
        color: rgb(0 126 255 / 65%);
      }
    
      .main-blog-img {
        max-height: 400px;
      }
      `}
      </style>
    </>
  );
};

export default Newsmedia;
