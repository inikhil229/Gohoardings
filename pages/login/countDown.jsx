import { useState, useEffect } from 'react';
import { ToastContainer, toast } from "react-toastify";
import { emailOTP, mobileOTP } from '@/allApi/apis';

const Countdown = ({initialTime, email, setSendOtp}) => {
  const [time, setTime] = useState(initialTime);
  const [tme, setTme] = useState(true);
 const Completionist = () => <span className="text-success" onClick={()=>resend()}>Resend OTP</span>;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(time => {
        if (time === 1) {
          clearInterval(intervalId);
          return <Completionist/>;
        }
        return time - 1;
      });
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [tme]);

  const resend = async() =>{
    if (isNaN(parseInt(email))) {
      const data = await emailOTP(email)
      if (data.success == true) { 
        setSendOtp(true)
      } else {
        toast(data.message)
      }
    } else { 
      const data = await mobileOTP(email);
      if (data.success == true) {
        setSendOtp(true)
      } else {
        toast(data.message)
      }
    }     
    setTme(!tme)
    setTime(120)
    }
  
  
  return <>
  <span className='text-danger'>{time} </span> <ToastContainer/>
  </>;
}


export default Countdown;