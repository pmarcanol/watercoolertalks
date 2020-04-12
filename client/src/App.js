import React, { useState } from "react";
import styled from "styled-components";
import logo from "./logo.svg";
import "./reset.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  function onButtonClick() {
    fetch('/signup', {
      method: "POST",
      body: JSON.stringify({
        username,
        password
      })
    }).then(console.log)
  }
  return (
    <Login>
      <label for="username">Username</label>
      <input id="username"></input>
      <label for="password">Password</label>
      <input id="password"></input>
      <button type="button" onClick={onButtonClick}>Enter</button>
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
