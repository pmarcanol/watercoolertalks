import React, { useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";

import { AuthContext } from "./App";
import { useFetch } from "./api";

export default function Dashboard() {
  const history = useHistory();

  const [rooms, setRooms] = useState([]);
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const { GET, POST } = useFetch();
  const [showCreateRoom, setShowCreateRoom] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function getUserRooms() {
      if (currentUser && currentUser._id && !cancelled) {
        try {
          const rooms = await GET(`user/${currentUser._id}/rooms`);
          setRooms(rooms.body);
        } catch(e) {
          if (!cancelled) {
            console.log('could not cosos');
          }
        }
      }
    }

    if (!cancelled) {
      getUserRooms();
    }

    return () => {
      cancelled = true;
    }
  }, [currentUser]);

  async function JoinRoom(room) {
    const r = await POST(`room/join`, {
      roomName: room.name,
      password: "1234",
    });
    history.push(`room/${room.name}`);
    console.log(r.body.roomToken)
    setCurrentUser({ ...currentUser, roomToken: r.body.token });
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
      <label htmlFor="roomName">Room Name</label>
      <input
        onChange={(e) => setRoomName(e.currentTarget.value)}
        id="roomName"
      ></input>
      <label htmlFor="roomPassword">Room Password</label>
      <input
        onChange={(e) => setRoomPassword(e.currentTarget.value)}
        id="roomPassword"
      ></input>
      <label htmlFor="confirmRoomPassword">Confirm Room Password</label>
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
