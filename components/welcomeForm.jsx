import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import styles from "../styles/login.module.scss";
import { toast } from "react-toastify";
import { enquiryApi } from "@/allApi/apis";
const WelcomeForm = () => {
  const [show, setShow] = useState(false);
  const [welcomeForm, setWelcomeForm] = useState({
    name: "unknown",
    email: "unknown",
    phone: "",
    message: "not provided",
  });
  const handleChange = (e) => {
    setWelcomeForm({ ...welcomeForm, [e.target.name]: e.target.value });
  };
  const handleClose = () => {
    setShow(false);
    localStorage.setItem("forceClosed", "true");
  };
  const handleShow = () => {
    setShow(true);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
  
    for (const key in welcomeForm) {
      if (!welcomeForm[key]) {
        toast.error(`Please fill in the ${key.replace(/_/g, " ")} number.`);

        return;
      }
      if (key === "phone" && welcomeForm[key].length < 10) {
       toast.error(
          `Please enter a valid ${key.replace(
            /_/g,
            " "
          )} number.`
        );
        return;
      }
     
    }
    const data = await enquiryApi(
      welcomeForm.name,
      welcomeForm.email,
      welcomeForm.phone,
      welcomeForm.message
    );

    if (data.success == true) {
      toast.success("Thanks,our expert will contact you soon!");
      setShow(false);
      localStorage.setItem("forceClosed", "false");
    }
  };

  useEffect(() => {
    // Check if the flag is present in localStorage
    const formClosed = localStorage.getItem("forceClosed");

    if (!formClosed) {
      // Show the modal after 6 seconds
      const timeoutId = setTimeout(() => {
        handleShow();
      }, 6000);

      // Cleanup the timeout on component unmount
      return () => clearTimeout(timeoutId);
    }
  }, []);

  useEffect(() => {
    // Handle cleanup when the user closes the browser
    const handleBeforeUnload = () => {
      localStorage.removeItem("forceClosed");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        id="welcomeModal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div className="lgn">
          <div className="row">
     
            <div className=" p-4  col-12">
            <button
            title="Close"
                  className="float-end m-1 close-btn"
                  onClick={handleClose}
                >
                  x
                </button>
              <div
                className={`container-xxl  container-xl container-lg container-md  ${styles.login_container2}`}
              >
                <>
                  <h6 className={styles.txt_clr}>*Connect instantly by submitting your contact no.  </h6>
                  <form
                    className="mt-md-0  mt-2 position-relative"
                    onSubmit={onSubmit}
                  >
                   
                    <div className="form-group py-md-3 py-1">
                      <input
                        autoComplete="off"
                        type="number"
                        className="form-control ps-0 rounded-0"
                        placeholder="012 3456 789"
                        name="phone"
                        value={welcomeForm.phone}
                        onChange={handleChange}
                      />
                    </div>

                   
                    <div className=" p-0 mt-1 mt-md-0 position-relative ">
                      <button
                        type="submit"
                        className="btn w-100 message-btn"
                        role="button"
                      >
                        SUBMIT
                      </button>
                    </div>
                  </form>
                </>
              </div>
            </div>
       
          </div>
        </div>
      </Modal>
      <style jsx>
        {`
          .form-control {
            border: none !important;
            border-bottom: 1px solid #b5b4b4 !important;
          }

          ::-webkit-input-placeholder {
            font-size: 0.85rem !important;
          }
          .form-control:focus {
            border-color: rgba(100, 100, 100, 1) !important;
            -webkit-box-shadow: none !important;
            -moz-box-shadow: none !important;
            box-shadow: none !important;
          }
          .message-btn {
            letter-spacing: 1px;
          }
          .message-btn:hover {
            background-color: #373435;
            color: #fff212;
            font-size: 20px;
            padding-bottom: 5px;
          }
          .close-btn {
            border: none;
            opacity: 0.6;
            font-size: 14px;
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
      h2{
        font-size: 1.4rem!important;
      }
          }
        `}
      </style>
    </>
  );
};

export default WelcomeForm;
