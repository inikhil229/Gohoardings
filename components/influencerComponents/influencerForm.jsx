import { influencer_enquiry } from "@/allApi/apis";
import React, { useState } from "react";
import { toast } from "react-toastify";
const InfluencerForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profile: "",
    niche: "",
    charges: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const data = await  influencer_enquiry(
        formData.name,
        formData.email,
        formData.phone,
        formData.profile,
        formData.niche,
        formData.charges,
      );
      toast("Thanks,our expert will contact you soon!");
  setFormData({
    name: "",
    email: "",
    phone: "",
    profile: "",
    niche: "",
    charges: "",
  })
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-6 mb-3">
            <label htmlFor="name" className="form-label">
              Name<small className="req text-danger">* </small>
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-6 mb-3">
            <label htmlFor="email" className="form-label">
              Email<small className="req text-danger">* </small>
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-6 mb-3">
            <label htmlFor="phone" className="form-label">
              Phone<small className="req text-danger">* </small>
            </label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-6 mb-3">
            <label htmlFor="profile" className="form-label">
              Profile link<small className="req text-danger">* </small>
            </label>
            <input
              type="text"
              className="form-control"
              id="profile"
              name="profile"
              value={formData.profile}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12 mb-3">
            <label htmlFor="niche" className="form-label">
              What is your niche?
            </label>
            <input
              type="text"
              className="form-control"
              id="niche"
              name="niche"
              value={formData.niche}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12 mb-3">
            <label htmlFor="charges" className="form-label">
              What are your Commercials?
            </label>
            <input
              type="text"
              className="form-control"
              id="charges"
              name="charges"
              value={formData.charges}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <button type="submit" className="button mb-3 float-end me-0">
          Submit
        </button>
      </form>
      <style jsx>
        {`
          .button {
            padding: 0.4rem 1rem;
            letter-spacing: 1px;
            font-size: 1.1rem;
            border-radius: 0.375rem;
            font-weight: 400;
            -webkit-transition: 0.15s linear;
            transition: 0.25s linear;
            border: none;
            margin: 1rem;
            font-weight: 600;
            background-color: #fff212;
            box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
              rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
            color: #212121;
          }

          label {
            color: #ffffff;
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
          .req{
            font-size: 1.1rem;
          }
          @media screen and (max-width: 540px) {
            ::-webkit-input-placeholder {
              font-size: 0.9rem !important;
            }
            .message-btn {
              font-size: 0.9rem;
            }
          }
        `}
      </style>
    </div>
  );
};

export default InfluencerForm;
