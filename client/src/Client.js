import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { AuthContext } from "./App";

function Client() {
  const { id } = useParams();
  const auth = useContext(AuthContext);
  const [shouldAskforPassword, setShouldAskforPassword] = useState(true);

  useEffect(() => {
    if (!auth.currentUser.roomToken) {
      setShouldAskforPassword(true);
    } else {
      setShouldAskforPassword(false);
      console.log("connecting");
    }
  }, [auth.currentUser.roomToken]);

  async function joinRoom() {
    
  }

  return (
    <div>
      Room: {id}
      {shouldAskforPassword && (
        <div>
          <label htmlFor="password">Room Password</label>
          <input id="password"></input>
          <button type="button" onClick={() => joinRoom()}>Join</button>
        </div>
      )}
      <div></div>
    </div>
  );
}

export default Client;
