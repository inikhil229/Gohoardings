import { latLongApi } from "@/allApi/apis";
import React,{useState} from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
import styles from "../../styles/filter.module.scss";
import {MdOutlineLocationOn } from "react-icons/md";

function SearchGoogle({setSearch, search})  {
  const [address, setAddress] = useState("");
 

  const handleSelect = async(value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    const latitude = latLng.lat
    const longitude = latLng.lng
    if(latitude && longitude){

      const data = await latLongApi(latitude,longitude)
     setSearch()
      setSearch(data);
    }
  };

  return (
    <div>
      <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input className="w-100 "   id={styles.select_media_box} {...getInputProps({ placeholder: "Type location" })} />
            <div>

              <div className={address ? "dropdown-menu show ms-2 text-dark" :"dropdown-menu"  }>
              {/* {loading ? <div>...loading</div> : null} */}

              {suggestions.map((suggestion,i) => (
      
                  <div {...getSuggestionItemProps(suggestion)} key={i}>
                   <MdOutlineLocationOn className="icon-clr "   id={styles.select_location_icon}/>   {suggestion.description}
                  </div>
                   ))}
                   </div>
                   
                
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    </div>
  );
}

export default SearchGoogle;