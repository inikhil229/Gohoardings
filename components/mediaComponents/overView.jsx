import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useRouter } from "next/router";
import { removeCookies, setCookie, getCookie } from "cookies-next";
const OverView = ({ Media_content, category_name,city_name}) => {
  const route = useRouter();
  const countryCodeMapping = {
    AE: 'UAE',
    US: 'USA',
    IN: 'India',
    FR: 'France',
    // Add more mappings as needed
  };
  const { asPath } = useRouter();

    // Helper function to replace "India" with city_name
    // const replaceIndiaWithCity = (text) => {
    //   const uppercaseCity = city_name.charAt(0).toUpperCase() + city_name.slice(1);
    //   if (city_name && city_name.trim() !== "") {
    //     return text.replace(/India/g, uppercaseCity);
    //   }
    //   return text;
    // };

    // const replaceIndiaWithCity = (text, city_name) => {
    //   const selectedCountry = getCookie('selected_country'); // Using cookies-next
    //   const nameToUse = city_name && city_name.trim() !== ""
    //     ? city_name.charAt(0).toUpperCase() + city_name.slice(1)
    //     : selectedCountry && countryCodeMapping[selectedCountry]
    //       ? countryCodeMapping[selectedCountry]
    //       : selectedCountry || "India"; // Fallback to "India" if neither is provided
    
    //   return text.replace(/India/g, nameToUse);
    // };

    const replaceIndiaWithCity = (text, city_name) => {
      const selectedCountry = getCookie('selected_country'); // e.g., AE
    
      const countryMapped = countryCodeMapping[selectedCountry] || selectedCountry || "India";
    
      // Map Indian cities to UAE cities (adjust or add more as needed)
      const cityReplacementsForUAE = {
        mumbai: "Dubai",
        delhi: "Abu Dhabi",
        bengaluru: "Sharjah",
        kolkata: "Ajman",
        hyderabad: "Fujairah",
        pune: "Ras Al Khaimah",
        chennai: "Al Ain",
      };
    
      let result = text?.replace(/India/g, city_name || countryMapped);
    
      if (selectedCountry === "AE") {
        Object.keys(cityReplacementsForUAE).forEach((indianCity) => {
          const regex = new RegExp(indianCity, "gi"); // case-insensitive replace
          result = result.replace(regex, cityReplacementsForUAE[indianCity]);
        });
      }
    
      return result;
    };
    

  return (
    <>
      {Media_content.map((el, i) => {
        if  (category_name === el.value || city_name === el.city) {
          return (
            <div
              key={i}
              className="container-xxl  container-xl container-lg container-md  my-5 overview-container"
            >
              <div className="my-5">
                <h3 className="fw-bold" style={{ fontSize: "1.75rem" }}>
                  {replaceIndiaWithCity(el?.body_heading1,city_name)}
                </h3>
                <ul className="my-4">
                  {el.body_content_list.map((data, i) => (
                    <li key={i}>{replaceIndiaWithCity(data.list,city_name)}</li>
                  ))}
                </ul>
              </div>
              <div className="my-5">
                <h3 className="fw-bold">
                
                  <span >Why</span> {" "}
                  <span onClick={()=>route.push(asPath)} style={{cursor:"pointer"}}>{el.body_heading2} </span>
                  <span >Drive up the sales</span>
               
                </h3>
                <h6 className="my-2">{replaceIndiaWithCity(el.body_content2_description_top,city_name)}</h6>
                <ul className="my-4">
                  {el.body_content2_list.map((data, i) => (
                    <li key={i} className="my-2">
                      <span>
                        <span style={{ fontWeight: "600" }}>
                          {replaceIndiaWithCity(data.list.split(":")[0],city_name)}
                        </span>
                        :{replaceIndiaWithCity(data.list.split(":")[1],city_name)}
                      </span>
                    </li>
                  ))}
                </ul>
                <h6 className="my-2">{replaceIndiaWithCity(el.body_content2_description_bottom,city_name)}</h6>
              </div>
              <div className="my-5">
                <h3 className="fw-bold">{replaceIndiaWithCity(el.body_heading3,city_name)}</h3>

                <h6 className="my-2">{replaceIndiaWithCity(el.body_content3_description_top,city_name)}</h6>
                <ul className="my-4">
                  {el.body_content3_list.map((data, i) => (
                    <li key={i} className="my-2">
                      <span>
                        <span style={{ fontWeight: "600" }}>
                          {data.list.split(":")[0]}
                        </span>
                        :{data.list.split(":")[1]}
                      </span>
                    </li>
                  ))}
                </ul>
                <h6 className="my-2">{el.body_content3_description_bottom}</h6>
              </div>
              <div className="my-5">
                <h3 className="fw-bold">
                  {el.body_heading4 && replaceIndiaWithCity(el.body_heading4,city_name)}
                </h3>
                <ul className="my-4">
                  {el.body_content4_list &&
                    el.body_content4_list.map((data, i) => (
                      <li key={i} className="my-2">
                        <span>{replaceIndiaWithCity(data.list,city_name)}</span>
                      </li>
                    ))}
                </ul>
              </div>
              <div className="my-5">
                <h3 className="fw-bold">
                  {el.body_heading5 && replaceIndiaWithCity(el.body_heading5,city_name)}
                </h3>
                <ul className="my-4">
                  {el.body_content5_list &&
                    el.body_content5_list.map((data, i) => (
                      <li key={i} className="my-2">
                        <span>{replaceIndiaWithCity(data.list,city_name)}</span>
                      </li>
                    ))}
                </ul>
              </div>
              <div className="my-5">
                <h3 className="fw-bold">
                  {el.body_heading6 && replaceIndiaWithCity(el.body_heading6,city_name)}
                </h3>
                <h6 className="my-2">
                  {el.body_content6_description_top &&
                    replaceIndiaWithCity(el.body_content6_description_top,city_name)}
                </h6>
                <ul className="my-4">
                  {el.body_content6_list &&
                    el.body_content6_list.map((data, i) => (
                      <li className="my-1" key={i}>{replaceIndiaWithCity(data.list,city_name)}</li>
                    ))}
                </ul>
              </div>
              <div className="my-5">
                <h3 className="fw-bold">{el.body_link && replaceIndiaWithCity(el.body_link,city_name)}</h3>
                <h6 className="my-2">
  {el.body_content_link_description_top && replaceIndiaWithCity(el.body_content_link_description_top,city_name)}
</h6>

                <ul className="my-4">
                  {el.body_content_link &&
                    el.body_content_link.map((data, i) => (
                      <li
                      key={i}
                        className="my-1 link"
                        onClick={() => route.push("/contact-us")}
                      >
                        {replaceIndiaWithCity(data.list,city_name)}
                      </li>
                    ))}
                </ul>
              </div>

              <section className="my-5">
                <h3 className="fw-bold">{replaceIndiaWithCity(el.faqs_heading,city_name)}</h3>
                {el.faqs_content?.map((data, i) => {
                  let abc = "a" + data.id;
                  return (
                    <div className="question-box mt-3" key={i}>
                      <div
                        className=" toggle-btn p-3 ps-2 mb-0 "
                        data-bs-toggle="collapse"
                        data-bs-target={`#${abc}`}
                      >
                        <h4>
                        {replaceIndiaWithCity(data.faqs_qsn,city_name)}
                         
                          <IoIosArrowDown className="down float-end" />
                        </h4>
                      </div>
                      <div className="collapse" id={abc}>
                        <div className="card-body  pb-1 ps-5 pe-4">
                          <small>{replaceIndiaWithCity(data.faqs_ans,city_name)}</small>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </section>
              <h6 className="">
                Hire us as you&#39;re hoarding advertising partner we got
                covered, dial our number or whatsapp +91-777-787-1717 email us
                info@gohoardings.com, we will take care of your marketing.
              </h6>
            </div>
          );
        }
      })}
      <style jsx>
        {`
          .question-box {
            background-color: #fefefe;
            box-shadow: rgba(98, 98, 105, 0.2) 0px 7px 29px 0px;
          }

          .toggle-btn h4 {
            cursor: pointer;
            font-size: 19px;
            color: rgb(57, 55, 55);
          }

          .collapse {
            background: transparent;
          }

          h5 {
            font-weight: 700;
            cursor: pointer;
            font-size: 1.3rem;
            color: black;
          }

          .down {
            float: right;
            color: rgb(89, 85, 85);
          }

          .point {
            color: rgb(168, 162, 162);
          }
          .link {
            font-weight: 400;
            width: fit-content;
            border-bottom: 1.2px solid black;
            cursor: pointer;
          }
          .link:hover {
            font-weight: 600;
            width: fit-content;
            border-bottom: 2px solid black;
          }
          @media screen and (max-width: 1366px) {
            .toggle-btn h4 {
              font-size: 16px;
            }
            .card-body h5 {
              font-size: 14px;
            }
          }
        `}
      </style>
    </>
  );
};

export default OverView;
