import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { updateProfile } from "@/allApi/apis";
import { toast, ToastContainer } from "react-toastify";
import instance from "@/allApi/axios";

const initalState = {
  firstname: "",
  phonenumber: "",
  email: "",
  newPassword: "",
  confirmPassword: ""
};
const Userprofile = () => {
  const [posts, setPosts] = useState([]);
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const getUser = async () => {
    const { data } = await instance.get("loginApis");
    setPosts(data);
  };
  useEffect(() => {
    getUser();
  }, []);
  const [state, setState] = useState(initalState);
  const { firstname, phonenumber, email } = state;
  const handelSubmit = async (e) => {
    e.preventDefault();
    const data = await updateProfile(firstname, phonenumber,newPassword, confirmPassword);
    if (data.sucess == true) {
      toast(data.message);
      window.location.reload();
    } else {
      toast(data.message);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  useEffect(() => {
    setState({ ...posts[0] });
  }, [posts]);

  return (
    <>
     <div className="card profile-detail p-3">
        <div className="panel-body">
          <div className="row">
            <form onSubmit={handelSubmit}>
              <div className="col-md-12">
                <div className="form-group ">
                  <label htmlFor="firstname" className="ps-2">Name</label>
                  <Form.Control
                    type="text"
                    className="form-control"
                    placeholder="firstname"
                    id="firstname"
                    name="firstname"
                    value={firstname}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group my-3">
                  <label htmlFor="email" className="ps-2">E-mail</label>
                  <Form.Control
                    type="text"
                    className="form-control"
                    name="email"
                    disabled={true}
                    value={email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group my-3">
                  <label htmlFor="phonenumber" className="ps-2">Phone No.</label>
                  <Form.Control
                    type="number"
                    className="form-control"
                    name="phonenumber"
                    id="phonenumber"
                    value={phonenumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group my-3">
                  <label htmlFor="newPassword" className="ps-2">New Password</label>
                  <Form.Control
                    type="password"
                    className="form-control"
                    id="newPassword"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) =>setNewPassword(e.target.value)}
                  />
                </div>
                <div className="form-group my-3">
                  <label htmlFor="confirmPassword" className="ps-2">Confirm Password</label>
                  <Form.Control
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) =>setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-12 ">
                <div className="form-group mb-0 text-center my-3 rounded">
                  <button
                    type="submit"
                    className="btn update-btn w-50"
                    onClick={handelSubmit}
                  >
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <style jsx>
          {`
            .update-btn {
              background-color: #393939 !important;
              color: white !important;
            }
            .campaign-box {
              td {
                padding: 2px 6px;
              }
              th {
                padding: 2px 6px;
              }
              p {
                cursor: pointer;
                font-size: 16px;
                color: rgb(57, 55, 55);
              }
              .down {
                float: right;
                color: rgb(89, 85, 85);
              }
              .point {
                font-size: 14px;
                color: rgb(136, 133, 133);
              }
            }

            #booked_media {
              height: 10vh;
            }
            .prf-btn {
              width: auto !important;
              border-radius: 5px;
              background-color: #000000;
              cursor: pointer;
            }
            .nav-tabs {
              padding-bottom: 0;
              margin-bottom: 25px;
              background: 0 0;
              border-radius: 1px;
              padding-left: 0;
              padding-right: 0;
              border-top: 1px solid #f0f0f0;
              border-bottom: 1px solid #f0f0f0;
            }
            .nav-tabs > li.active > a,
            .nav-tabs > li.active > a:focus,
            .nav-tabs > li.active > a:hover,
            .nav-tabs > li > a:focus,
            .nav-tabs > li > a:hover {
              border: 0;
              border-radius: 0;
              border-bottom: 2px solid #000000;
              background: 0 0;
              color: #000000;
            }
            .tab-content > .active {
              display: block;
            }

            .tab-content > .tab-pane {
              display: none;
            }

            .tab-pane {
              min-height: 462px;
              overflow-x: hidden;
              overflow-y: scroll;
              padding: 0px 5px;
            }

            .nav-tabs > li > a {
              margin-right: 2px;
              line-height: 1.42857143;
              border: 1px solid transparent;
              border-radius: 4px 4px 0 0;
              border: 0;
              border-bottom: 2px solid transparent;
              background: 0 0;
              color: #333;
              padding: 12px 13px 12px 13px;
              font-weight: 400;
              margin-right: 2px;
              line-height: 1.42857143;
              border-radius: 4px 4px 0 0;
            }

            .nav > li > a {
              position: relative;
              display: block;
              padding: 10px 15px;
              text-decoration: none;
            }
            table.dataTable thead tr > th {
              color: #4e75ad;
            }

            table.table tr th {
              padding: 0;
              text-align: left;
              height: 25px;
            }
            .table thead tr th {
              border: 1px solid #f0f0f0 !important;
              border-left: 0 !important;
              border-right: 0 !important;
            }
            .table > thead > tr > th {
              vertical-align: bottom;
              border-bottom: 2px solid #ddd;
            }

            // .profile-detail {
            //   height: 605px !important;
            // }
            .panel_s .panel-body {
              background: #fff;
              border: 1px solid #e4e5e7;
              border-radius: 4px;
              padding: 20px;
              position: relative;
            }
            p,
            a,
            li,
            span,
            label,
            tr,
            td,
            th,
            input {
              color: #636363;
              font-size: 15px;

              font-weight: 400;
            }

            table.dataTable thead tr > th {
              color: #4e75ad;
            }

            table.table tr th {
              padding: 0;
              text-align: left;
              height: 25px;
            }
            .table thead tr th {
              border: 1px solid #f0f0f0 !important;
              border-left: 0 !important;
              border-right: 0 !important;
            }
            a,
            abbr,
            acronym,
            address,
            applet,
            article,
            aside,
            audio,
            b,
            big,
            blockquote,
            body,
            canvas,
            caption,
            center,
            cite,
            code,
            dd,
            del,
            details,
            dfn,
            div,
            dl,
            dt,
            em,
            embed,
            fieldset,
            figcaption,
            figure,
            footer,
            form,
            h1,
            h2,
            h3,
            h4,
            h5,
            h6,
            header,
            hgroup,
            html,
            i,
            iframe,
            img,
            ins,
            kbd,
            label,
            legend,
            li,
            mark,
            menu,
            nav,
            object,
            ol,
            output,
            p,
            pre,
            q,
            ruby,
            s,
            samp,
            section,
            small,
            span,
            strike,
            strong,
            sub,
            summary,
            sup,
            table,
            tbody,
            td,
            tfoot,
            th,
            thead,
            time,
            tr,
            tt,
            u,
            ul,
            var,
            video {
              margin: 0;
              padding: 0;
              border: 0;
              font-size: 100%;
              font: inherit;
              vertical-align: baseline;
            }

            .text-right {
              text-align: right;
            }

            .password-data {
              .panel_s .panel-body {
                background: #fff;
                border: 1px solid #e4e5e7;
                border-radius: 4px;
                padding: 20px;
                position: relative;
              }
              .btn {
                text-transform: uppercase;
                font-size: 13.5px;
                outline-offset: 0;
                border: 1px solid transparent;
                transition: all 0.15s ease-in-out;
                -o-transition: all 0.15s ease-in-out;
                -moz-transition: all 0.15s ease-in-out;
                -webkit-transition: all 0.15s ease-in-out;
              }

              .btn-info {
                color: #fff;
                background-color: #000000;
                border: 0;
              }
              .btn-block {
                display: block;
                width: 100%;
              }
            }

            #list-tab {
              .list-group-item {
                border: transparent !important;
              }
              .list-group-item.active {
                background-color: #000000 !important ;
              }
            }
            .camp-ppt {
              button {
                font-size: 12px;
              }
            }
          `}
        </style>
      </div> 
    </>
  );
};

export default Userprofile;
