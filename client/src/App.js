import React, { useState, createContext } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Client from "./Client";

import "./reset.css";

import { Login } from "./Login";
export const AuthContext = createContext({
  currentUser: null,
  setCurrentUser: () => {},
});

function App() {
  return (
    <Router>
      <AppWithAuth></AppWithAuth>
    </Router>
  );
}

function AppWithAuth() {
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
        <>
          <div>Hello {currentUser.username}!</div>
          <Switch>
            <Route path="/:id" component={Client} />
          </Switch>
        </>
      ) : (
        <Login setUsername setPassword setPasswordConfirm />
      )}
    </AuthContext.Provider>
  );
}
export default App;
