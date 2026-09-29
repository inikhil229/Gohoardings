import React, { useEffect, useContext, useState } from "react";
import Login from "./login";
import Image from "next/image";
import Sign from "./signup";
import ForgetPass from "./forgetPass";
import { toast, ToastContainer } from "react-toastify";
import {
  changePasswordApi,
  clientId,
  emailOTP,
  googleLogin,
  loginOTP,
  loginUser,
  mobileOTP,
  OtpRegister,
  registerUser,
  sendOTP,
  emailformate,
} from "@/allApi/apis";
import { useGoogleLogin } from "react-google-login";

import { MdOutlineError } from "react-icons/md";

import { useRouter } from "next/navigation";
import styles from "../../styles/login.module.scss";
import { setCookie } from "cookies-next";
import { AccountContext } from "@/allApi/apicontext";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const LoginN = () => {
  const [name, setName] = useState("");
  const [nameValidate, setNameValidate] = useState("");
  const [email, setEmail] = useState("");
  const [emailsValidate, setEmailsValidate] = useState("");
  const [password, setPassword] = useState("");
  const [passwordsValidate, setPasswordsValidate] = useState("");
  const [phone, setNumber] = useState("");
  const { handleClose, addRemove } = useContext(AccountContext);
  const [numbervalidate, setNumbervalidate] = useState("");
  const [forget, setForget] = useState(false);
  const [pass, setPass] = useState(false);
  const [fnotify, setFnotify] = useState("");
  const [signin, setSignIn] = useState(true);
  const [otp, setOtp] = useState("");
  const [sendOtp, setSendOtp] = useState(false);
  const [expire, setexpire] = useState("");
  const [confirmpasswords, setconfirmPasswords] = useState("");
  const [withOtp, setWithOtp] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useRouter();

  const afterLogin = async () => {
    setCookie("permissions", true);
    addRemove({ type: "DECR" });
    handleClose();
    setSuccess(true);
    setSendOtp(false);
  };

  // Google Login Request
  const onSuccess = async (res) => {
    const profile = res.profileObj;
    const data = await googleLogin(profile);
    if (data.success === true) {
      afterLogin();
    } else {
      toast(data.message);
    }
  };

  // Google Login failures
  const onFailure = async (res) => {
    return false;
  };

  const { signIn } = useGoogleLogin({
    onSuccess,
    clientId,
    onFailure,
  });

  const checkOTPForLogin = async (e) => {
    e.preventDefault();
    const data = await loginOTP(otp);
    if (data.success === true) {
      afterLogin();
    } else {
      toast(data.message);
    }
  };

  let count = 0;
  const [eyeViseble, setEyeViseble] = useState(true);
  const onVisible = () => {
    let x = document.getElementById("inputPassword");
    if (x.type == "password") {
      x.type = "text";
      setEyeViseble(!eyeViseble);
    } else {
      x.type = "password";
      setEyeViseble(!eyeViseble);
    }
  };
  //validation and submit  for signIn

  const onSignIn = async (e) => {
    if (email === "") {
      count = +1;
      setEmailsValidate(<MdOutlineError className="text-danger" />);
    } else if (!emailformate.test(email)) {
      count = +1;
      setEmailsValidate("Type your email corectly");
    } else if (password === "") {
      count = +1;
      setPasswordsValidate(<MdOutlineError className="text-danger" />);
    } else if (count === 0) {
      e.preventDefault();
      const data = await loginUser(email, password);
      if (data.success === true) {
        afterLogin();
      } else {
        toast(data.message);
      }
    }
    e.preventDefault();
  };

  //toggle between signIn & register
  const toggleSignUp = () => {
    setSignIn(!signin);
  };

  //foget password
  const clickforget = () => {
    setForget(true);
  };

  const onForget = async (e) => {
    e.preventDefault();
    if (isNaN(parseInt(phone))) {
      const data = await emailOTP(phone);
      if (data.success == true) {
        setSendOtp(true);
      } else {
        toast(data.message);
      }
    } else {
      const data = await mobileOTP(phone);
      if (data.success == true) {
        setSendOtp(true);
      } else {
        toast(data.message);
      }
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    const data = await changePasswordApi(password, confirmpasswords, expire);

    setPassword(" ");
    setconfirmPasswords(" ");
    if (data.success === true) {
      afterLogin();
    } else {
      toast(data.message);
    }
  };

  const checkOTP = async (e) => {
    e.preventDefault();
    const data = await sendOTP(otp);

    if (data.success === true) {
      setexpire(data.message);
      setPass(true);
    } else {
      toast(data.message);
    }
  };

  const onRegister = async (e) => {
    e.preventDefault();
    if (phone.length <= 0) {
      count = +1;
      setNumbervalidate(<MdOutlineError className="text-danger" />);
    } else if (phone.length != 10) {
      count = +1;
      setNumbervalidate("Type your 10 digit no correctly");
    } else if (email === "") {
      count = +1;
      setEmailsValidate(<MdOutlineError className="text-danger" />);
    } else if (!emailformate.test(email)) {
      count = +1;
      setEmailsValidate("Type your email corectly");
    } else if (password === "") {
      count = +1;
      setPasswordsValidate(<MdOutlineError className="text-danger" />);
    } else if (count === 0) {
      e.preventDefault();
      const data = await registerUser(email, phone);
      if (data.success === true) {
        setSendOtp(true);
        return true;
      } else {
        toast(data.message);
      }
    }
  };

  const registerOtp = async (e) => {
    e.preventDefault();
    if (name === "") {
      count = +1;
      setNameValidate(<MdOutlineError className="text-danger" />);
    } else if (phone.length <= 0) {
      count = +1;
      setNumbervalidate(<MdOutlineError className="text-danger" />);
    } else if (phone.length != 10) {
      count = +1;
      setNumbervalidate("Type your 10 digit no correctly");
    } else if (email === "") {
      count = +1;
      setEmailsValidate(<MdOutlineError className="text-danger" />);
    } else if (!emailformate.test(email)) {
      count = +1;
      setEmailsValidate("Type your email corectly");
    } else if (password === "") {
      count = +1;
      setPasswordsValidate(<MdOutlineError className="text-danger" />);
    } else if (password.length <= 3) {
      setPasswordsValidate("Password should be atleast 4 digit ");
    } else if (count === 0 && sendOTP) {
      const data = await OtpRegister(name, email, phone, password, otp);
      if (data.success === true) {
        afterLogin();
      } else {
        toast(data.message);
      }
    }
  };

  return (
    <div className="lgn">
      <div className=" d-flex">
        <div className="col-md-6 ">
          <div className={styles.wrapper}>
            <div className={`${styles.opacitydiv} rounded-4 `}>
              {signin ? (
                <>
                  {" "}
                  <div className={`${styles.title} pt-3 ps-4  `}>
                    <h2>
                      Promote <br />
                      your brand
                    </h2>
                    <h4>in just one click</h4>
                  </div>
                  <Image
                    width={500}
                    height={500}
                    src="/images/web_pics/login1.png"
                    className={styles.img_responsive}
                    alt="Registraion"
                  />
                </>
              ) : (
                <>
                  <div className={`${styles.title} pt-3 ps-4 `}>
                    <h2>
                      Gohoardings <br />
                      OOH Advertising
                    </h2>
                    <h4>made easy & affordable</h4>
                    <h6>
                      Create an account for best OOH media <br />
                      solutions in just a few clicks.
                    </h6>
                  </div>
                  <Image
                    width={500}
                    height={500}
                    src="/images/web_pics/login2.png"
                    className={styles.img_responsive2}
                    alt="Login image"
                  />
                </>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-6 p-4 m-0">
          <div
            className={`container-xxl  container-xl container-lg container-md  ${styles.login_container2}`}
          >
            {/* Image
                           width={500}
                           height={500} src="/images/web_pics/logo.png" alt="gohoardings" id={styles.brand_logo} /> */}

            {forget ? (
              <>
                <ForgetPass
                  setconfirmPasswords={setconfirmPasswords}
                  expire={expire}
                  setOtp={setOtp}
                  otp={otp}
                  setNumber={setNumber}
                  checkOTP={checkOTP}
                  changePassword={changePassword}
                  phone={phone}
                  success={success}
                  sendOtp={sendOtp}
                  setSendOtp={setSendOtp}
                  onForget={onForget}
                  fnotif={fnotify}
                  emailsValidate={emailsValidate}
                  password={password}
                  setPassword={setPassword}
                  setForget={setForget}
                  setPass={setPass}
                  pass={pass}
                />
              </>
            ) : (
              <>
                {signin ? (
                  <Login
                    setEmailValidate={setEmailsValidate}
                    onSignIn={onSignIn}
                    afterLogin={afterLogin}
                    setEmail={setEmail}
                    email={email}
                    setWithOtp={setWithOtp}
                    success={success}
                    withOtp={withOtp}
                    sendOtp={sendOtp}
                    emailsValidate={emailsValidate}
                    passwordsValidate={passwordsValidate}
                    setPassword={setPassword}
                    password={password}
                    onVisible={onVisible}
                    eyeViseble={eyeViseble}
                    AiFillEye={AiFillEye}
                    AiFillEyeInvisible={AiFillEyeInvisible}
                    clickforget={clickforget}
                    ToastContainer={ToastContainer}
                    googleSignIn={signIn}
                    toggleSignUp={toggleSignUp}
                    onForget={onForget}
                    setOtp={setOtp}
                    setNumber={setNumber}
                    checkOTPForLogin={checkOTPForLogin}
                  />
                ) : (
                  <Sign
                    onVisible={onVisible}
                    afterLogin={afterLogin}
                    eyeViseble={eyeViseble}
                    toggleSignUp={toggleSignUp}
                    signIn={signIn}
                    toast={toast}
                    success={success}
                    sendOtp={sendOtp}
                    passwordsValidate={passwordsValidate}
                    setPassword={setPassword}
                    password={password}
                    setEmail={setEmail}
                    email={email}
                    emailsValidate={emailsValidate}
                    numbervalidate={numbervalidate}
                    phone={phone}
                    AiFillEyeInvisible={AiFillEyeInvisible}
                    AiFillEye={AiFillEye}
                    setNumber={setNumber}
                    nameValidate={nameValidate}
                    setName={setName}
                    name={name}
                    onRegister={onRegister}
                    onForget={onForget}
                    setOtp={setOtp}
                    checkOTPForLogin={checkOTPForLogin}
                    registerOtp={registerOtp}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginN;
