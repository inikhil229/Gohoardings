import React, { useState,createContext, useReducer } from 'react';
import instance from './axios';
import { getCookie, removeCookies } from "cookies-next";

export const AccountContext = createContext(null);

export const AccountProvider = ({ children }) => {
  
  const [show, setShow] = useState(false);
  var [initalState, setInitalState] = useState(0)


  const item = async () => {
    const value = getCookie("permissions")
    if(value){
      const { data } = await instance.get(`forgetPass`)
      if(data.message == "InValid Token"){
        setInitalState(0);
      }else{
        setInitalState(data[0].item);
      }
    }
  
    }


  const reducer = (state, action) => {
    if (action.type === 'INCR') {
      state = state + 1;
    }
    if (state > 0 && action.type === 'DECR') {
      state = state - 1;
    }

    return state
  };

  const [state, addRemove] = useReducer(reducer, (item()))


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  return (
    <AccountContext.Provider value={{initalState,  state, addRemove,show, handleClose, handleShow }}>
      {children}
    </AccountContext.Provider>
  );
};

export default AccountProvider