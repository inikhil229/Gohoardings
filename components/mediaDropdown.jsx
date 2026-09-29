import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { CityNameImage } from "../allApi/apis";
import styles from '../styles/searchmedia.module.scss'
const Mediadropdown = ({ userType, setUserType }) => {

   let selecType;
  CityNameImage.map((el) => {
      if (el.value == userType) {
        selecType=el.label;
      }
    });


  return ( 
    
    <DropdownButton
      title={userType ? selecType : "Select your media type"}
      id={styles.select_media_box}
      onSelect={(e) => setUserType(e)}
    >
      {CityNameImage.map((el, i) => (
        <Dropdown.Item eventKey={el.value} className="p-2 mt-0 " key={i}>
            <span className={`${styles.select_media_icon} icon-clr`}> {el.icon} </span>
          {el.label}
        </Dropdown.Item>
      ))}

    </DropdownButton>
    
  );
};

export default Mediadropdown;