import React, { useState, useEffect } from "react";
import { allcompanydata, companydata } from "@/allApi/apis";
import { toast} from "react-toastify";

const initalState = {
  company: " ",
  city: " ",
  phone: " ",
  address: " ",
  website: " ",
  state: " ",
  zip_code: " ",
  pan: " ",
  gstin: " ",
};

const Companyprofile = () => {
  const [stateData, setState] = useState(initalState);
  const [data, setData] = useState([]);
  const {
    company,
    city,
    phone,
    address,
    website,
    state,
    zip_code,
    pan,
    gstin,
  } = stateData;

  const handleChange = async (e) => {
    setState({ ...stateData, [e.target.name]: e.target.value });
  };

  const allData = async () => {
    const company = await allcompanydata();
    setData(company);
  };
  useEffect(() => {
    allData();
  }, []);

  const getComapnayData = async () => {
    const data = await companydata(stateData);
    if (data.sucess == true) {
      toast(data.message);
      // window.location.reload();
    } else {
      toast(data.message);
    }
  };
  useEffect(() => {
    setState({ ...data[0] });
  }, [data]);
  return (
    <div className=" row p-3">
      <div className="col-md-12">
        <div className="form-group my-1">
          <label for="company" className="control-label ps-2">
            Company Name
          </label>
          <input
            placeholder="company Name"
            value={company}
            onChange={handleChange}
            type="text"
            className="form-control"
            name="company"
          />
        </div>
        <div className="form-group my-1">
          <label className="control-label ps-2" for="website">
            Website
          </label>
          <input
            onChange={handleChange}
            placeholder="www.org.com"
            value={website}
            type="text"
            className="form-control"
            name="website"
            id="website"
          />
        </div>
        <div
          className="form-group my-1"
          app-field-wrapper="custom_fields[customers][10]"
        >
          <label for="custom_fields[customers][10]" className="control-label ps-2">
            PAN
          </label>
          <input
            placeholder="PAN"
            onChange={handleChange}
            value={pan}
            type="text"
            id="custom_fields[customers][10]"
            name="pan"
            className="form-control"
            data-fieldto="customers"
            data-fieldid="10"
          />
        </div>
        <div
          className="form-group my-1"
          app-field-wrapper="custom_fields[customers][11]"
        >
          <label for="custom_fields[customers][11]" className="control-label ps-2">
            GSTIN
          </label>
          <input
            type="text"
            id="custom_fields[customers][11]"
            name="gstin"
            onChange={handleChange}
            placeholder="GSTIN"
            value={gstin}
            className="form-control"
            data-fieldto="customers"
            data-fieldid="11"
          />
        </div>
        <div className="form-group my-1">
          <label className="control-label ps-2" for="phonenumber">
            Phone
          </label>
          <input
            type="number"
            onChange={handleChange}
            placeholder="+91 898 9899 898"
            value={phone}
            className="form-control"
            name="phone"
            id="phonenumber"
          />
        </div>
      </div>

      <div className="col-md-4 ">
        <div className="form-group my-1">
          <label for="city" className="ps-2">City</label>
          <input
            onChange={handleChange}
            placeholder="City"
            value={city}
            type="text"
            className="form-control"
            name="city"
            id="city"
          />
        </div>
      </div>
      <div className="col-md-4 ">
        <div className="form-group my-1">
          <label for="state" className="ps-2">State</label>
          <input
            onChange={handleChange}
            placeholder="State"
            value={state}
            type="text"
            className="form-control"
            name="state"
            id="state"
          />
        </div>
      </div>
      <div className="col-md-4 ">
        <div className="form-group my-1">
          <label for="zip" className="ps-2">Zip Code</label>
          <input
            placeholder="124507"
            onChange={handleChange}
            value={zip_code}
            type="number"
            className="form-control"
            name="zip_code"
            id="zip"
          />
        </div>
      </div>
      <div className="form-group my-1">
        <label for="address" className="ps-2">Address</label>
        <textarea
          onChange={handleChange}
          placeholder="address"
          value={address}
          name="address"
          id="address"
          className="form-control"
          rows="3"
        ></textarea>
      </div>

      <div className="col-md-12 ">
        <div className="form-group my-2 mb-0 text-center  rounded">
          <button
            type="submit"
            className="btn update-btn w-50"
            onClick={getComapnayData}
          >
            Update
          </button>
        </div>
      </div>
      <style jsx>
        {`
          .update-btn {
            background-color: #393939 !important;
            color: #f0f0f0 !important;
          }
        `}
      </style>
    </div>
  );
};

export default Companyprofile;
