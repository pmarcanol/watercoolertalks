import React, { useEffect, useContext, useState } from "react";

import { AuthContext } from "./App";
import { useFetch } from "./api";

export default function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { GET, POST } = useFetch();
  const [showCreateRoom, setShowCreateRoom] = useState(false);

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
      <div>
        My Rooms
        {rooms &&
          rooms.map((r) => (
            <button onClick={() => JoinRoom(r)}>{r.name}</button>
          ))}
      </div>
      <div>
        <button onClick={() => setShowCreateRoom(true)}>Create New Room</button>
        {showCreateRoom && (
          <div>
            <button onClick={() => setShowCreateRoom(false)}>Hide</button>
            <CreateRoom />
          </div>
        )}
      </div>
    </div>
  );
}
function CreateRoom() {
  const { POST } = useFetch();
  const [roomName, setRoomName] = useState("");
  const [roomPassword, setRoomPassword] = useState();
  const [confirmRoomPassword, setConfirmRoomPassword] = useState("");
  const [errors, setErrors] = useState();

  async function createRoom() {
    if (roomName && roomPassword && confirmRoomPassword == roomPassword) {
      const res = await POST("room", {
        name: roomName,
        password: roomPassword,
      });
    } else {
      setErrors("Room name, password and password confirm must be defined");
    }
  }
  return (
    <form>
      <label for="roomName">Room Name</label>
      <input
        onChange={(e) => setRoomName(e.currentTarget.value)}
        id="roomName"
      ></input>
      <label for="roomPassword">Room Password</label>
      <input
        onChange={(e) => setRoomPassword(e.currentTarget.value)}
        id="roomPassword"
      ></input>
      <label for="confirmRoomPassword">Confirm Room Password</label>
      <input
        onChange={(e) => setConfirmRoomPassword(e.currentTarget.value)}
        id="confirmRoomPassword"
      ></input>
      <button type="button" onClick={createRoom}>
        Create Room
      </button>
      <div>{errors}</div>
    </form>
  );
}
