import React, { useEffect, useState } from "react";
import { emailformate, enquiryApi } from "@/allApi/apis";
import { toast, ToastContainer } from "react-toastify";
import {MdKeyboardArrowRight } from "react-icons/md";
import { useRouter } from "next/router";
import Head from "next/head";
import { BsWhatsapp } from "react-icons/bs";
import Fixednavbar from "@/components/navbar/fixednavbar";
import styles from '../../styles/contactUs.module.scss'  ;

const Contact = () => {
  const [name, setName] = useState(""); 
  const route = useRouter()
  const [phone, setphone] = useState("");
  const [phone2, setphone2] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setEror] = useState(false);
  const [conect,setConect]=useState(false);

  let count = 0;
  const onSubmit = async (e) => {
    e.preventDefault();

    if (name === "") {
      setEror(true);
      count = +1;
    } else if (phone.length !== 10) {
      count = +1;
      setEror(true);
    } else if (!emailformate.test(email)) {
      count = +1;
      setEror(true);
    } else if (message === "") {
      count = +1;
      setEror(true);
    } else if (count === 0) {
      const data = await enquiryApi(name, email, phone, message);
      if (data.success == true) {
        setName("");
        setphone("");
        setEmail("");
        setMessage("");
        setEror(false);
        toast(data.message);
      } else {
        toast(data.err);
      }
    }
  };

  // Function to generate WhatsApp URL
  const getWhatsAppLink = (phoneNumber, message) => {
      const whatsappUrl = `https://wa.me/${encodeURIComponent(
        phoneNumber
      )}?text=${encodeURIComponent(message)}`;
      return whatsappUrl;
  };

  const onNumbersubmit =  async (e) => {
   if(phone2.length!==10){
    toast.error("Enter valid phone number");
    return ;
   }
   const data = await enquiryApi("unknown", "unknown", phone2, "not provided");
   if (data.success == true) {
    toast.success(data.message);
    setphone2('');
    setConect(false);
   }
  }
  
//   <a
//   href={getWhatsAppLink(
//     7777871717,
//     "Hello, I'm interested in your advertising services. Could you please provide more details and pricing information?"
//   )}
//   target="_blank"
//   rel="noopener noreferrer"
// >
//   <div className="btn btn-success">
//     Connect on <BsWhatsapp className="" />
//   </div>
//               </a>
  const {asPath} = useRouter();
  const hotjarTrackingCode = `(function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:3792413,hjsv:6};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`;
  return (
    <>
      <Head>
        <link rel="canonical" href={`https://www.gohoardings.com${asPath}`} />
        <title>
          Contact: Gohoardings | Best Outdoor Advertising Agency in India
        </title>
        <meta charSet="utf-8" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Get in touch with GoHoardings, India's leading Outdoor Advertising Agency. We bring your brand to life outdoors. Contact The Best Advertising Agency in India"
        />
        <meta
          name="google-site-verification"
          content="fLT70DRZGdH5FUdrS8w1k2Zg_VTzNJGDF9ie9v4FAzM"
        />
        <meta
          name="keywords"
          content="gohoarings, gohoardin, go hoardings, advertising agency in india, best advertising agency in delhi, best advertising agency in noida, best advertising agency in mumbai, best advertising agency in pune, best advertising agency in bangalore, outdoor advertising agency, ooh media company, hoarding for rent, hoarding company in india"
        />
        <meta
          property="og:title"
          content="Gohoardings Solutions is the leading online media buying agency. Contact us to get exclusive media buying rates and make your brand visible."
        />
        <meta property="og:siteName" content="www.gohoardings.com/contact-us" />
        <meta
          property="og:description"
          content="India's Largest Outdoor Advertising Agency. We are helping business to grow offline with hoardings, billboards ads, bus shelters, metro pillars, airport, and office brandings | Gohoardings"
        />
        <meta property="og:type" content="en_US" />
        <meta property="og:url" href={`https://www.gohoardings.com${asPath}`} />
        <meta property="og:property" content="en_US" />
        <meta
          property="twitter:title"
          content="Gohoardings Solutions is the leading online media buying agency. Contact us to get exclusive media buying rates and make your brand visible."
        />
        <meta
          property="twitter:siteName"
          content="www.gohoardings.com/contact-us"
        /> 
        <meta
          property="twitter:description"
          content="India's Largest Outdoor Advertising Agency. We are helping business to grow offline with hoardings, billboards ads, bus shelters, metro pillars, airport, and office brandings | Gohoardings"
        />
        <meta property="twitter:type" content="en_US" />
        <meta
          property="twitter:url"
          href={`https://www.gohoardings.com${asPath}`}
        />
        <meta property="twitter:property" content="en_US" />
        <script dangerouslySetInnerHTML={{ __html: hotjarTrackingCode }} />
      </Head>
   <Fixednavbar/>

      <section>
        <div className={`container-xxl  container-xl container-lg container-md  my-5 ${styles.main_contact_all} contUs `}>
          <h1 className="text-center pt-2 pt-md-4">Contact Us</h1>
          <h5 className="text-center">
            Any question or remarks? Just write us a message or <br />
            visit our nearest office.
          </h5>
   <h6><span  onClick={()=>route.push("/")} className="bredcamp">Home</span><MdKeyboardArrowRight/><span className="bredcamp text-secondary">Contact-Us</span></h6>
          <div className={`row p-3 mt-md-5 rounded-3 ${styles.main_contact}`}>
            <div className="col-md-6 p-0">
           <div className="text-center">
           {conect ?
  <div className="justify-content-center d-flex my-2 animate__animated animate__fadeInUp ">
    <input type="number" placeholder="Enter your number" className={styles.conectInput} value={phone2} onChange={(e)=>setphone2(e.target.value)} />
    <div className={`btn ${styles.conectBtn}`} onClick={onNumbersubmit}>
      Connect
    </div>
  </div>
  :
  <button className={styles.justclick} onClick={()=>setConect(true)}>
    Click to Connect
  </button>
}

           

           </div>
           
              <p className={`text-center my-2 fw-bold ${styles.orr}`}>or</p>
              {/* <div className="d-flex justify-content-between pe-3">

      
             
     
             </div>

              </div> */}
              <h5 className="mt-4 mb-0 text-dark">
              Please fill out the form to specify your requirements
              </h5>
              <div className={`${styles.contact_form} pe-md-5`}>
                <form className='position-relative' onSubmit={onSubmit}>
                  
                  <div className="form-group py-3 pt-2">
                    <label htmlFor="formGroupExampleInput">Name*</label>
                    <input
                      autoComplete="off"
                      type="text"
                      className={`form-control ps-0 rounded-0`}
                      id="formGroupExampleInput"
                      placeholder="Your Full Name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    />
                    {error == true && name === "" ? (
                      <small className="p-0 text-danger text-small ">
                        Please enter your name
                      </small>
                    ) : (
                      <> </>
                    )}
                  </div>
                  <div className="row py-3">
                    <div className="col">
                      <label htmlFor="Last-name">Email*</label>
                      <input
                        type="text"
                        autoComplete="off"
                        className={`form-control ps-0 rounded-0`}
                        placeholder="Your Mail ID"
                        id="first-name"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                      />
                      <p className="error-msg">
                        {" "}
                        {error == true && !emailformate.test(email) ? (
                          <small className="p-0 p-0 text-danger text-small  ">
                            Type your email corectly
                          </small>
                        ) : (
                          <> </>
                        )}{" "}
                      </p>
                    </div>
                    <div className="col">
                      <label htmlFor="Last-name">Phone*</label>
                      <input
                        autoComplete="off"
                        type="number"
                        className={`form-control ps-0 rounded-0`}
                        placeholder="012 3456 789"
                        value={phone}
                        onChange={(e) => setphone(e.target.value)}
                      />
                      {error == true && phone.length !== 10 ? (
                        <small className="p-0 text-danger text-small  ">
                          Type your 10 digit phone corectly
                        </small>
                      ) : (
                        <> </>
                      )}
                    </div>
                  </div>
                  <div className="form-group py-3">
                    <label htmlFor="formGroupExampleInput2">Message*</label>
                    <input
                      autoComplete="off"
                      type="text"
                      className={`form-control ps-0 rounded-0`}
                      id="formGroupExampleInput2"
                      placeholder="Write your message.."
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                      }}
                    />
                    {error == true && message === "" ? (
                      <small className="p-0 text-danger text-small  p-0 ">
                        Please enter your message for our team
                      </small>
                    ) : (
                      <> </>
                    )}
                  </div>

                  <div className="d-grid  mt-3  ">
                    <button
                      type="submit"
                      className={`btn btn-lg  ${styles.message_btn}`}
                      role="button"
                    >
                      Send Message
                    </button>
                    <ToastContainer />
                  </div>
                </form>

                <p className={`text-center my-2 fw-bold ${styles.orr}`}>or</p>
                <h6 className="text-center my-2 ">Call us: +91 77778 71717</h6>
                <h6 className="text-center my-2 ">
                  Email: info@gohoardings.com
                </h6>
              </div>
            </div>
            <div className="col-md-6   p-0">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.203386323958!2d77.31864131492027!3d28.59367469258985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce4f0a89ce605%3A0xfd09bf1f744de96f!2sGohoardings!5e0!3m2!1sen!2sin!4v1667808584343!5m2!1sen!2sin"
                className={`${styles.google_map} rounded-3`}
                allowFullScreen={true}
                loading="lazy"
                title="google-map"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
  
    </>
  );
};

export default Contact;
