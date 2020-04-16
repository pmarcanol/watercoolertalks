import React, { useEffect, useContext, useState } from "react";

import { AuthContext } from "./App";
import { useFetch } from "./api";

export default function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { GET, POST } = useFetch();
  useEffect(() => {
    async function getUserRooms() {
      if (currentUser && currentUser._id) {
        const rooms = await GET(`user/${currentUser._id}/rooms`);
        setRooms(rooms.body);
      }
    }

    getUserRooms();
  }, [currentUser]);

  async function JoinRoom(room) {
    const r = await POST(`room/join`, {
      roomName: room.name,
      password: "1234",
    });
    console.log(r);
  }
  return (
    <div>
      {rooms &&
        rooms.map((r) => <button onClick={() => JoinRoom(r)}>{r.name}</button>)}
    </div>
  );
}
