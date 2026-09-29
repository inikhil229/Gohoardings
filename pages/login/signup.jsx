import React from "react";
import GoogleLinkdinAuthentication from "./googleLogin";
import styles from "../../styles/login.module.scss";
import { toast, ToastContainer } from "react-toastify";
const Sign = ({
  passwordsValidate,
  googleSignIn,
  toggleSignUp,
  sendOtp,
  setPassword,
  afterLogin,
  password,
  setEmail,
  email,
  emailsValidate,
  numbervalidate,
  phone,
  AiFillEye,
  AiFillEyeInvisible,
  setNumber,
  nameValidate,
  setName,
  name,
  onRegister,
  onForget,
  setOtp,
  checkOTPForLogin,
  registerOtp,
}) => {
  return (
    <>
      <h2 className=" fw-bold ">Sign up to Continue</h2>
      {/* <h5 className="mt-3">Please fill all the fields</h5> */}
      <form onSubmit={registerOtp}>
        <div className="form-floating mt-4">
          <input
            type="text"
            className="form-control"
            autoComplete="off"
            placeholder="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <p className="ms-3 p-0 text text-danger">{nameValidate}</p>
          <label htmlFor="floatingInput">Full Name</label>
        </div>
        <div className="form-floating mt-2">
          <input
            type="email"
            className="form-control"
            autoComplete="off"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <p className="ms-2 p-0 text text-danger">{emailsValidate}</p>
          <label htmlFor="floatingInput">Email</label>
        </div>
        <div className="form-floating mt-2 d-flex pe-0 ">
          <input
            type="number"
            className="form-control"
            autoComplete="off"
            placeholder="0123456789"
            id="mnd"
            onChange={(e) => {
              setNumber(e.target.value);
            }}
          />{" "}
          <button
            className="border-0"
            id={styles.sendf}
            onClick={(e) => {
              onRegister(e);
            }}
          >
            Send
          </button>
          <label htmlFor="floatingInput">Phone</label>
        </div>
        <p className="ms-2 p-0 text text-danger">{numbervalidate}</p>
        {sendOtp && (
          <div className="form-floating mt-2">
            <input
              type="number"
              className="form-control"
              autoComplete="off"
              placeholder="OTP"
              pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
              onChange={(e) => setOtp(e.target.value)}
            />

            <label htmlFor="floatingInput">OTP</label>
          </div>
        )}
        <div className="form-floating  mt-2 ">
          <input
            type="password"
            className="form-control"
            autoComplete="off"
            id="num"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>
        <p className="ms-2 p-0 text text-danger">{passwordsValidate}</p>

        {sendOtp ? (
          <div className="d-grid mt-3">
            <button type="submit" className="border-0 rounded btn-lg  mb-2 ">
              Sign up
            </button>{" "}
          </div>
        ) : (
          <div className="d-grid mt-3">
            <button
              disabled={true}
              className="border-0 rounded btn-lg  mb-2 "
              id="noget"
            >
              Sign up
            </button>{" "}
          </div>
        )}
      </form>

      <h6 className="mt-2">
        Already have an account?{" "}
        <span
          className={`fw-bold ${styles.switch} `}
          onClick={() => toggleSignUp()}
        >
          Login
        </span>
      </h6>

      <GoogleLinkdinAuthentication
        googleSignIn={googleSignIn}
        afterLogin={afterLogin}
        setNumber={setNumber}
        onForget={onForget}
        setOtp={setOtp}
        checkOTPForLogin={checkOTPForLogin}
      />
    </>
  );
};

export default Sign;
