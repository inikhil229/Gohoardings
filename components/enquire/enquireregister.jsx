import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import styles from '../../styles/enquire.module.scss';
import { enquiryApi, emailformate } from "../../allApi/apis";

const Enquireregister = () => {
  const [name, setName] = useState("");
  const [phone, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setEror] = useState(false);

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
        setNumber("");
        setEmail("");
        setMessage("");
        setEror(false);
        toast(data.message);
      }
    }
  };

  return (
    <>
        <h2 className={styles.txt_clr_tlk}>Talk to us!</h2>
      <h6 className={styles.txt_clr}>*Please fill all the details.</h6>
      <form className='mt-md-4  mt-2 position-relative' onSubmit={onSubmit}>
        <div className="form-group py-md-3 py-1">
          <label htmlFor="formGroupExampleInput">Name*</label>
          <input
            autoComplete="off"
            type="text"
            className="form-control ps-0 rounded-0"
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
        <div className="row py-md-3 py-1">
          <div className="col">
            <label htmlFor="Last-name">Email*</label>
            <input
              type="text"
              autoComplete="off"
              className="form-control ps-0 rounded-0"
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
            <label htmlFor="Last-name">phone*</label>
            <input
              autoComplete="off"
              type="number"
              className="form-control ps-0 rounded-0"
              placeholder="012 3456 789"
              value={phone}
              onChange={(e) => setNumber(e.target.value)}
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
        <div className="form-group py-md-3 py-1">
          <label htmlFor="formGroupExampleInput2">Message*</label>
          <input
            autoComplete="off"
            type="text"
            className="form-control ps-0 rounded-0"
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
        <div className=" p-0 mt-1 mt-md-0 position-relative ">
          <button
            type="submit"
            className={`btn btn-lg ${styles.message_btn}  float-end`}
            role="button"
          >
            Send Message
          </button>
          <ToastContainer />
        </div>
      </form> 
      <style jsx>
{`
 .form-control {
  border: none !important;
  border-bottom: 1px solid #b5b4b4 !important;
}
label {
  color: #6c757d !important;
  font-size: 0.9rem;
}
::-webkit-input-placeholder {
  font-size: 1rem !important;
}
.form-control:focus {
  border-color: rgba(100, 100, 100, 1) !important;
  -webkit-box-shadow: none !important;
  -moz-box-shadow: none !important;
  box-shadow: none !important;
}
@media screen and (max-width: 540px) {

  .txt-clr-tlk {
      color: #373435;
      font-size: 1.6rem;
    }
    .txt-clr {
      color: #373435;
    }

    ::-webkit-input-placeholder {
      font-size: 0.9rem !important;
    }
    .message-btn {
      font-size: 0.9rem;
      
    }

}
`}
      </style>
    </>
  );
};

export default Enquireregister;
