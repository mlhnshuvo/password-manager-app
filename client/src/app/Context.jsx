import React, { useState, createContext } from "react";
import jwt_decode from "jwt-decode";
import setAuthToken from "../utils/setAuthToken";
import Axios from "../utils/axios";

export const Context = createContext();

const Index = ({ children }) => {
  const [user, setUser] = useState({
    isAuthenticate: false,
    user: {},
    error: null,
  });
  const [listPassword, setListPassword] = useState([]);

  const isAuthenticateHandler = () => {
    const token = localStorage.getItem("token");
    if (token) {
      var decoded = jwt_decode(token);
      var dateNow = new Date();
      if (decoded.exp * 1000 < dateNow.getTime()) {
        setUser({ isAuthenticate: false });
        localStorage.removeItem("token");
        setAuthToken("");
      } else {
        setUser({ isAuthenticate: true });
        setAuthToken(token);
      }
    } else {
      setUser({ isAuthenticate: false });
      setAuthToken("");
    }
  };

  const logoutHandler = () => {
    setUser({ isAuthenticate: false, user: {}, error: null });
    setListPassword([]);
    localStorage.removeItem("token");
    setAuthToken("");
  };

  const addPassHandler = (password) => {
    const temp = [...listPassword];
    temp.push(password);
    setListPassword(temp);
  };

  const getPassLists = () => {
    Axios.get("/password/get")
      .then((res) => {
        setListPassword(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updatePassHandler = (password) => {
    const temp = [...listPassword];
    const findIndex = temp.findIndex((el) => el._id === password._id);
    temp[findIndex] = password;
    setListPassword(temp);
  };

  const deletePassHandler = (id) => {
    const temp = [...listPassword];
    const deleteArr = temp.filter((el) => el._id !== id);
    setListPassword(deleteArr);
  };

  return (
    <Context.Provider
      value={{
        user: user,
        isAuthenticateHandler: isAuthenticateHandler,
        logoutHandler: logoutHandler,
        listPassword: listPassword,
        addPassHandler: addPassHandler,
        getPassLists: getPassLists,
        updatePassHandler: updatePassHandler,
        deletePassHandler: deletePassHandler,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Index;
