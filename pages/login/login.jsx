import React from 'react';
import GoogleLinkdinAuthentication from "./googleLogin";
import styles from '../../styles/login.module.scss'  ;
const Login = ({ onSignIn,sendOtp, withOtp,success, setWithOtp, email, setEmail, googleSignIn, toggleSignUp, ToastContainer, clickforget, afterLogin, AiFillEyeInvisible, onVisible, AiFillEye, eyeViseble, emailsValidate, password, setPassword, passwordValidate, onForget, setOtp, setNumber, checkOTPForLogin }) => {
  return (
    <>
      <h2 className=" fw-bold ">Login to Continue</h2>
      <h5 className="mt-3">Please login to access your account</h5>
      {withOtp ? <>
        <div className="form-floating mt-5 d-flex">
          <input
            type="number"
            className="form-control"
            id='mnd'
            autoComplete="off"
            placeholder="123-456-789" 
            // value={number}
            pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" onChange={e => setNumber(e.target.value)}
          /><button className=' border-0 ' id={styles.sendf} onClick={onForget} >Send</button>
          <p className={`ms-2 p-0 ${styles.text} `}>{emailsValidate}</p>
          <label htmlFor="floatingInput">Phone number</label>
        </div>
        {sendOtp &&    <div className="form-floating  mt-3 mb-1">
          <input
            type="password"
            className="form-control"
            autoComplete="off"
            placeholder="otp"
            onChange={e => setOtp(e.target.value)}
          />
          <label htmlFor="floatingPassword" >OTP</label>
        </div>}
     
        <div className="d-grid mt-5">
          <button
onClick={checkOTPForLogin}
            className="border-0 rounded btn-lg  mb-2 "
          >
            Login
          </button>{" "}
        
        </div>
      </> : <>
        <form onSubmit={onSignIn}>
          <div className="form-floating mt-5">
            <input
              type="email"
              className="form-control"
              autoComplete="off"
              placeholder="name@example.com"
              value={email}
              pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            {/* <p className={`ms-2 p-0 ${styles.text} `}>{emailsValidate}</p> */}
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className="form-floating  mt-3 mb-1">
            <input
              type="password"
              className="form-control"
              autoComplete="off"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>
          <p
            className={styles.forgetpass}
            onClick={() => clickforget()}
          >
            Forget Password?
          </p>
          <div className="d-grid mt-5">
            {success?<button
              
              type="submit"
              className="border-0 rounded btn-lg  mb-2 "
            >
              Login
            </button> : <button
            
              type="submit"
              className="border-0 rounded btn-lg  mb-2 "
            >
              Login
            </button> }
            
           
          </div>

        </form>
      </>

      }


      <h6 className="mt-2">
        Don’t have an account? <span className={`fw-bold ${styles.switch} `} onClick={ toggleSignUp}>Sign Up</span>
      </h6>

      <GoogleLinkdinAuthentication googleSignIn={googleSignIn} afterLogin={afterLogin} setNumber={setNumber} onForget={onForget} setOtp={setOtp} checkOTPForLogin={checkOTPForLogin} setWithOtp={setWithOtp}  success={success}
        withOtp={withOtp}
      />
    </>
  );
}

export default Login;
