import React, { useState, useContext } from "react";
import styled from "styled-components";

import { useAuth } from "./api";
import { AuthContext } from "./App";

const ScreenTypes = {
  LOGIN: "LOGIN",
  SIGNUP: "SIGNUP",
};

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [type, setType] = useState(ScreenTypes.LOGIN);
  const { register, signIn } = useAuth();
  const authContext = useContext(AuthContext);
  async function onRegister() {
    if (username && password && passwordConfirm == password) {
      const { success, body, errors } = await register(username, password);
      if (success) {
        authContext.setCurrentUser({
          isLoggedIn: true,
          ...body.user,
        });
      } else {
        setError(errors);
      }
    } else {
      setError("Username, Password and Password confirmation are required");
    }
  }

  async function onLogin() {
    const { success, body, errors } = await signIn(username, password);
    if (success) {
      authContext.setCurrentUser({
        isLoggedIn: true,
        ...body.user,
      });
    } else {
      setError(errors);
    }
  }

  return (
    <StyledLogin>
      <label htmlFor="username">Username</label>
      <input
        id="username"
        onChange={(e) => setUsername(e.currentTarget.value)}
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
      {error && <div>{error}</div>}
      Or would you prefer to
      <a
        onClick={() => {
          type == ScreenTypes.LOGIN
            ? setType(ScreenTypes.SIGNUP)
            : setType(ScreenTypes.LOGIN);
        }}
      >
        {type == ScreenTypes.LOGIN ? "Register" : "Log In"}
      </a>
      instead?
    </StyledLogin>
  );
}

const StyledLogin = styled.div`
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
