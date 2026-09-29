import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Fixednavbar from "../../components/navbar/fixednavbar";
const Leads = () => {
  const route = useRouter();


  const hotjarTrackingCode = `(function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:3781905,hjsv:6};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`;
  return (
    <>
      <Head>
        <script dangerouslySetInnerHTML={{ __html: hotjarTrackingCode }} />
      </Head>
      <Fixednavbar />
      <div className="container-fluid p-0">
        <section>
          <div className="full-page-image"></div>

          <div className="content-overlay">
            <div className="row text-center">
          
            <img
            className="mt-5"
              alt="home-img"
              src="/images/web_pics/Animation - 1703059084854.gif"
            />
           
            </div>
          </div>
        </section>

        <section>
          <div className="container my-md-5 py-md-3">
            <div className="row text-center">
                <h6 className="my-2">Thank You !</h6>

                <p className="fw-bold my-3">Details submited successfully</p>
                <p className="text-small thnk">
                    Thank you for submited your details,<br/>
                    Our experts will contact you soon
                </p>
                <div class="d-grid gap-2 d-md-block">
                <button className="my-2 button " onClick={()=>route.push("/")}>
                    Take me to Home
                </button>
                </div>
            </div>
          </div>
        </section>
      </div>
      <style jsx>{`
        .container-fluid {
          margin-top: 4.5%;
        }
        h6 {
          line-height: 1.5rem;
          font-size: 1.4rem;
        }
        .thnk{
            font-size: .8rem;
        }
        .button{
            width: fit-content;
            border-radius: 4px;
             border: 2px solid #fff32c;
            padding:.7em 1.3em;
            background-color: #fff32c;
            cursor: pointer;
            transition: 0.3s;
          }
          button:hover {
            border: 2px solid #373435;
            background-color: #373435;
            color: #fff;
            
          }
        .full-page-image {
          position: relative;
          background: url("/images/web_pics/why2.jpg") center/cover no-repeat;
          width: 100%;
          height: 34vh;
        }

        .full-page-image::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
        }

        .content-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 34vh;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
        }

      
        
        @media screen and (max-width: 720px) {
      
        
        
         
        }
      `}</style>
    </>
  );
};

export default Leads;
