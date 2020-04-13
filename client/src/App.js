import React, { useState } from "react";
import styled from "styled-components";

import {useAuth, useFetch} from "./hooks";
import logo from "./logo.svg";
import "./reset.css";

function App() {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const {signIn} = useAuth()
  const {GET} = useFetch()
  async function onButtonClick() {
    const a = await signIn('pablo1012@outlook.com', 'yourpassword')
    console.log(a);
    const b = await GET(`user/${a._id}/rooms`);
    console.log(b)
  }
  return (
    <Login>
      <label htmlFor="username">username</label>
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
