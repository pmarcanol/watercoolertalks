import React, { useState, createContext } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Client from "./Client";

import "./reset.css";

import Login from "./Login";
import Dashboard from "./Dashboard";
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
            <Route path="/room/:id" component={Client} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/" component={Dashboard} />
          </Switch>
        </>
      ) : (
        <Login setUsername setPassword setPasswordConfirm />
      )}
    </AuthContext.Provider>
  );
}
export default App;
