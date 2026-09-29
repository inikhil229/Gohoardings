import React, { useEffect } from "react";
import { signIn} from 'next-auth/react'
import { FcGoogle } from "react-icons/fc";
import styles from '../../styles/login.module.scss'  ;
import Image from "next/image";
const LoginOauth = ({ googleSignIn, afterLogin,setWithOtp ,withOtp,success}) => {


  return (
    <>
      <div className={`ps-0 mt-3 text-center ${styles.login_auth} mt-2`}>
        <div className="row">
        </div>
        {withOtp?
        <Image
                           width={500}
                           height={500}
        alt="phone_otp"
          src="/images/web_pics/gpmpas.png"
          className={`${styles.otp_icon} offset-1`}
           onClick={()=>setWithOtp(!withOtp)}
         
        />:
        <Image
                           width={500}
                           height={500}
        alt="phone_otp"
          src="/images/web_pics/otp.png"
          className={`${styles.otp_icon} offset-1`}
           onClick={()=>setWithOtp(!withOtp)}
         
        />

        }
       <Image
                           width={500}
                           height={500}
        alt="linkdin"
          src="/images/web_pics/linkdin.png"
          className={`${styles.linkdin_icon} offset-1`}
          onClick={() =>signIn()}
        />
       
        
     <FcGoogle className={`${styles.google_icon} offset-1`} onClick={googleSignIn}  />
      </div>
    </>
  );
};

export default LoginOauth;
