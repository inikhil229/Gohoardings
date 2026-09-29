import React from 'react'

const Branding = (props) => {
 
  return (
   <>
    <section className="inn-page-bg mt-5">
        <div className="container">
          <div className="row">
            {/* <a href="/">
              Image
                           width={500}
                           height={500}
                src="/images/web_pics/logo.png"
                alt="logo"
                className="logo ps-2" 
              />
            </a> */}
            <div className="inn-pag-ban">
              <h2>{props.title}</h2>
            </div>
          </div>
        </div>
      </section>
      <style jsx>
        {
          `
          .inn-page-bg:before {
            content: "";
            position: absolute;
            background: linear-gradient(
              to top,
              rgba(32, 52, 76, 0.64) 14%,
              #393939 66%
            );
            top: 0;
            bottom: 0;
            left: 0;
            width: 100%;
          }
          .inn-page-bg {
            background: url('../images/web_pics/branding.jpg') no-repeat;
            background-size: cover;
            position: relative;
            margin-top: 0px;
            background-color: none;
            
          
          }
          
          .logo {
            position: absolute;
            top: 35px;
            left: 50px;
            height: 38px;
          }
          .inn-pag-ban h2 {
            font-size: 50px;
       
            font-weight: 700;
            margin-top: 0;
            margin-bottom: 0;
            position: relative;
            overflow: hidden;
            margin: 0 auto;
            padding: 75px 35px;
            color: #fff;
            text-align: center;
          }
          
          @media screen and (max-width: 540px) {
              .logo {
                  position: absolute;
                  top: 15px;
                  left: 20px;
                  height: 14px;
                }
                .inn-pag-ban h2 {
                  font-size: 18px;
                  padding: 55px 17px;
                }
          }
          
          @media screen and (max-width: 768px) {
            .logo {
                position: absolute;
                top: 25px;
                left: 30px;
                height: 25px;
              }
              .inn-pag-ban h2 {
                font-size: 40px;
                padding: 55px 17px;
                font-weight: 600;
              }
          }
          
          `
        }
      </style>
   </>
  )
}

export default Branding;