import React, { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useSession, signIn, signOut } from "next-auth/react";
import { useGoogleOneTapLogin } from "react-google-one-tap-login";
import {
  clientId,
  googleLogin,
  logoutUser,

  userDetails,
} from "@/allApi/apis";
import Image from "next/image";
import { AccountContext } from "@/allApi/apicontext";
import Dropdown from "react-bootstrap/Dropdown";
import styles from "../../styles/navbarHome.module.scss";
import { MdDashboard } from "react-icons/md";
import { CgUserlane } from "react-icons/cg";
import { BiLogOut, BiLogIn } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/router";
import instance from "@/allApi/axios";
import { getCookie, setCookie, removeCookies } from "cookies-next";

const Userdetail = () => {
  const route = useRouter();
  const { data: session } = useSession();
  const { handleShow, addRemove, initalState } = useContext(AccountContext);
  const pth = route.asPath;
  const [posts, setPosts] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [user, setUser] = useState([]);

  useEffect(() => {
    if (session) {
      const data = async () => await instance.post("linkedin", { session });
      data().then(async () => {
        setCookie("permissions", true);

        addRemove({ type: "DECR" });
        handleClose();
        setUser();
      });
    }
  }, [session]);

  const handelLogout = async () => {
    signOut();
    await logoutUser();
    removeCookies("permissions");
  };

  const value = getCookie("permissions");
  const userData = async () => {
    if (value) {
      const data = await userDetails();
      setUser(data);
    }
  };

  useEffect(() => {
    userData();
  }, [value]);



  const oneTap = async (response) => {
    const data = await googleLogin(response);
    if (data.success == true) {
      setCookie("permissions", true);
      addRemove({ type: "DECR" });
      setUser(!user);
    }
  };

  if (typeof window !== "undefined") {
  }
  useGoogleOneTapLogin({
    onSuccess: (response) => oneTap(response),
    onError: (response) => toast(response.message),
    disabled: getCookie("permissions"),
    googleAccountConfigs: {
      client_id: clientId,
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (scrollY >= 500 || pth !== "/") {
      setPosts(false);
    } else {
      setPosts(true);
    }
  }, [scrollY]);



  if (value) {
    return (
      <>
        <div className={styles.userDetail2_dekstop}>
          <div
            className={`p-0 m-0  d-flex ${styles.userDetail2}   my-2 my-lg-0 usrdtl`}
          >
            <Dropdown className={`${styles.login_profile}  me-2`}>
              <Dropdown.Toggle
                variant="transparent"
                aria-expanded={posts}
                className={styles.drop_togel}
              >
                <FaUserCircle className={`${styles.login_icon}  pt-0 mb-1 `} />
              </Dropdown.Toggle>

              <Dropdown.Menu className={`pt-0 pb-0 `}>
                <Dropdown.Item
                  onClick={() => route.push("/profile")}
                  className={`${styles.drop_item} rounded-top  ps-2 pt-2 pb-2 text-light`}
                >
                  <CgUserlane className={`mb-1 me-1 text-light`} />
                  {user && user.map((el) => el.firstname.toUpperCase())}
                </Dropdown.Item>
                <hr className=" m-0" />
                <Dropdown.Item
                  onClick={() => route.push("/mydashboard")}
                  className={`${styles.drop_item}  ps-2 pt-2 pb-2 text-light`}
                >
                  {" "}
                  <MdDashboard className={`mb-1 text-light`} /> My Dashboard
                </Dropdown.Item>
                <hr className=" m-0" />
                <Dropdown.Item
                  onClick={() => handelLogout()}
                  className={`${styles.drop_item} rounded-bottom ps-2 pt-2 pb-2 text-light`}
                >
                  <BiLogOut className=" text-light" /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <div
              className={`${styles.cart} ms-2 `}
              onClick={() => route.push("/cart")}
            >
              <span>
                <Image
                  width={50}
                  height={10}
                  aria-expanded={posts}
                  src="/images/web_pics/hoarding.png"
                  className={`${styles.login_icon_cart} `}
                />
              </span>
              <span aria-expanded={posts}>{initalState}</span>
            </div>
          </div>
        </div>
        {/* for mobile */}
        <div className={styles.userDetail2_mbil}>
          <div className={`p-0 m-0  d-flex ${styles.userDetail2} usrdtl`}>
            <Dropdown className={`${styles.login_profile}`}>
              <Dropdown.Toggle
                variant="transparent"
                className={styles.drop_togel}
              >
                <FaUserCircle className={`${styles.login_icon}`} />
              </Dropdown.Toggle>

              <Dropdown.Menu className={`pt-0 pb-0 `}>
                <Dropdown.Item
                  onClick={() => route.push("/profile")}
                  className={`${styles.drop_item} rounded-top  ps-2 pt-2 pb-2 text-light`}
                >
                  <CgUserlane className={`mb-1  text-light `} />
                  {"  "}
                  {user && user.map((el) => el.firstname.toUpperCase())}
                </Dropdown.Item>
                <hr className=" m-0" />
                <Dropdown.Item
                  onClick={() => route.push("/mydashboard")}
                  className={`${styles.drop_item}  ps-2 pt-2 pb-2 text-light`}
                >
                  {" "}
                  <MdDashboard className={`mb-1 text-light`} /> My Dashboard
                </Dropdown.Item>
                <hr className=" m-0" />
                <Dropdown.Item
                  onClick={() => handelLogout()}
                  className={`${styles.drop_item} rounded-bottom ps-2 pt-2 pb-2 text-light`}
                >
                  <BiLogOut className=" text-light" /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <div
              className={`${styles.cart} `}
              onClick={() => route.push("/cart")}
            >
              <span>
                <Image
                  width={10}
                  height={10}
                  aria-expanded={posts}
                  src="/images/web_pics/hoarding.png"
                  className={`${styles.login_icon_cart} `}
                />
              </span>
              <span aria-expanded={posts}>{initalState}</span>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div
          aria-expanded={posts}
          className={`pt-0 ${styles.drop_togel} border-0 usrdtl ${styles.userDetail2_dekstop}`}
          onClick={handleShow}
        >
          Login{" "}
          <FaUserCircle
            aria-expanded={posts}
            className={`${styles.login_icon} ps-0 p-0  ms-0 mb-1`}
          />
        </div>
 

        {/* for mobile */}

        <div className={`pt-0 ${styles.userDetail2_mbil} border-0 usrdtl`}>
          <FaUserCircle
            onClick={handleShow}
            className={`${styles.login_icon} `}
          />
        </div>
      </>
    );
  }
};

export default Userdetail;
