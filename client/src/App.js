import React, { useState } from "react";
import styled from "styled-components";
import logo from "./logo.svg";
import "./reset.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onButtonClick() {
    fetch("http://localhost:3000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    }).then(console.log);
  }
  return (
    <Login>
      <label htmlFor="email">Email</label>
      <input
        id="username"
        onChange={(e) => setEmail(e.currentTarget.value)}
      ></input>
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        onChange={(e) => setPassword(e.currentTarget.value)}
      ></input>
      <button type="button" onClick={onButtonClick}>
        Signup
      </button>
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
