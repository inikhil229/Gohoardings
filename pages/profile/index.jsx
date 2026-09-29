import React, { useContext, useEffect, useState } from "react";
import { profileDetails, updateProfilePic, userDetails } from "@/allApi/apis";
import { useRouter } from "next/router";
import Companyprofile from "./companyprofile";
import { AccountContext } from "@/allApi/apicontext";
import Userprofile from "./userprofile";
import { getCookie } from "cookies-next";
import Head from "next/head";
import Image from "next/image";
import Fixednavbar from "@/components/navbar/fixednavbar";

const Profile = () => {
  const route = useRouter();
  const [profile, setProfile] = useState(true);
  const [companey, setCompaney] = useState(false);
  const {handleShow } = useContext(AccountContext);
  const [user, setUser] = useState([]);

  const value = getCookie("permissions");

  useEffect(() => {
    value ? (route.push("/profile"))
     :(route.push("/"),
     handleShow()
     ) 
   }, []);

  const getData = async () => {
    if (value) {
      const data = await userDetails();
      setUser(data);
    }
  };
   

  useEffect(() => {
    getData();
  }, [value]);

  const showCompaney = async () => {
    setCompaney(true);
    setProfile(false);
  };

  const showProfile = () => {
    setProfile(true);
    setCompaney(false);
  };

  const getUpdateImage = async (e) => {
    const data = await updateProfilePic(e);
    if (data.sucess == true) {
      getData();
      setUser();
    }
  };


  var welcome;  
  var date = new Date();  
  var hour = date.getHours();  
  var minute = date.getMinutes();  
  var second = date.getSeconds();  
  if (minute < 10) {  
    minute = "0" + minute;  
  }  
  if (second < 10) {  
    second = "0" + second;  
  }  
  if (hour < 12) {  
    welcome = "Good morning";  
  } else if (hour < 17) {  
    welcome = "Good afternoon";  
  } else {  
    welcome = "Good evening";  
  }  
  return (
    <>
         <Head>
      <link rel="canonical" href={`https://www.gohoardings.com${route.asPath}`}/>
       
      </Head>
      <Fixednavbar />
      <div className=" container-xxl  container-xl container-lg container-md my-md-5 my-4 prf-content animate__animated  animate__fadeIn">
        <div className="row  p-md-5  p-3">
        <div className="col-md-3 p-2 pt-0">
          </div>
          <div className="col-md-9 p-2 pt-0">

          <h1 className="text-center fw-bold ">{welcome}</h1>
          </div>
          <div className="col-md-3 p-2 pt-0 text-center">
   
            
               <label>
               <div className="img-wrap img-upload">
                 < Image
                           width={250}
                           height={250}
                    src={user && user.map((el) => el.profile_image)}
                    className="card-img-top"
                    alt="user-profile"
                    onError={(e) =>
                      (e.target.src = "/images/web_pics/user-profile.png")
                    }
                  />
                </div>
                <input
                  className="form-control"
                  type="file"
                  accept="image/png, image/jpg, image/jpeg"
                  name="photo"
                  id="photo-upload"
                  onChange={(e) => getUpdateImage(e.target.files[0])}
                />
     
               </label>
            
   <div className="my-4">


            <h4 onClick={showProfile} aria-expanded={profile} className="prf-btn">Profile</h4>


            <h4 onClick={showCompaney} aria-expanded={companey}  className="prf-btn">Company Details</h4>
   </div>


          </div>
          <div className="col-md-9 p-2 pt-0">
            <div className="card ">
              {profile ? (
                <>
                  <Userprofile />
                </>
              ) : (
                <>
                  <Companyprofile />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
        .prf-btn{
          border: 1.5px solid #393939;
          border-radius: 16px;
          font-size:1.1rem;
          padding: 4px;
          font-weight: 400;
          cursor: pointer;
          transition: all 0.3s ease-out;
        }
        .prf-btn:hover{
          background-color:#393939;
          color:white;
           }
        .prf-btn[aria-expanded="true"]{
       background-color:#393939;
       color:white;
        }
        #photo-upload[type="file"] {
          display: none;
        }
 
        .card-img-top{
          width: 220px;
          height: 220px;
          border-radius: 50%;
      }
        }
        @media screen and (max-width: 540px) {
          .card-img-top{
            width: 30vw;
          }
         h1{
          display:none;
         }
        }
        
        `}
      </style>
    </>
  );
};

export default Profile;
