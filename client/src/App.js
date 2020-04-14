import React, { useState, createContext, useContext } from "react";
import styled from "styled-components";

import { useAuth } from "./api";
import "./reset.css";

const ScreenTypes = {
  LOGIN: "LOGIN",
  SIGNUP: "SIGNUP",
};
function App() {
  const [currentUser, setCurrentUser] = useState({
    isLoggedIn: false,
    username: "John Doe",
  });
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [type, setType] = useState(ScreenTypes.LOGIN);
  const { register, signIn } = useAuth();
  async function onRegister() {
    try {
      const user = await register(username, password);
      if (user && user._id) {
        setCurrentUser({
          isLoggedIn: true,
          ...user,
        });
      }
    } catch {
      console.log("could not register");
    }
  }

  async function onLogin() {
    try {
      const user = await signIn(username, password);
      if (user && user._id) {
        setCurrentUser({
          isLoggedIn: true,
          ...user,
        });
      }
    } catch {
      console.log("could not log in");
    }
  }
  return currentUser.isLoggedIn ? (
    <div>Hello {currentUser.username}!</div>
  ) : (
    <Login>
      <label htmlFor="username">Username</label>
      <input
        id="username"
        onChange={(e) => setusername(e.currentTarget.value)}
      ></input>
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        onChange={(e) => setPassword(e.currentTarget.value)}
      ></input>
      {type == ScreenTypes.SIGNUP ? (
        <>
          <label htmlFor="passwordConfirm">Confirm Password</label>
          <input
            id="passwordConfirm"
            type="password"
            onChange={(e) => setPasswordConfirm(e.currentTarget.value)}
          ></input>
          <button type="button" onClick={onRegister}>
            Register
          </button>
        </>
      ) : (
        <button type="button" onClick={onLogin}>
          Log In
        </button>
      )}
      Or would you prefer to
      <a
        onClick={() => {
          type == ScreenTypes.LOGIN
            ? setType(ScreenTypes.SIGNUP)
            : setType(ScreenTypes.LOGIN);
        }}
      >
        {type == ScreenTypes.SIGNUP ? "Register" : "Log In"} instead
      </a>
      ?
    </Login>
  );
}

const Login = styled.div`
  background: white;
  display: flex;
  width: 30%;
  margin: 1em;
  padding: 1em;
  border: 1px solid gray;
  border-radius: 5px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  label {
    display: flex;
    text-align: left;
    margin-bottom: 0.5em;
  }
  button {
    margin: 2em;
    width: 50%;
  }
`;

export default App;
