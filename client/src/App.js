import React, { useState, createContext } from "react";
import styled from "styled-components";

import "./reset.css";

import { Login } from "./Login";
export const AuthContext = createContext({
  currentUser: null,
  setCurrentUser: () => {},
});

function App() {
  const [currentUser, setCurrentUser] = useState({
    isLoggedIn: false,
    username: "John Doe",
  });
  return (
    <AuthContext.Provider
      value={{
        currentUser: currentUser,
        setCurrentUser: setCurrentUser,
      }}
    >
      {currentUser.isLoggedIn ? (
        <div>Hello {currentUser.username}!</div>
      ) : (
        <Login setUsername setPassword setPasswordConfirm />
      )}
    </AuthContext.Provider>
  );
}

export default App;
