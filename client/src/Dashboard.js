import React, { useEffect, useContext, useState } from "react";

import { AuthContext } from "./App";
import { useFetch } from "./api";

export default function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { GET } = useFetch();
  useEffect(() => {
    async function getUserRooms() {
      if (currentUser && currentUser._id) {
        const rooms = await GET(`user/${currentUser._id}/rooms`);
        setRooms(rooms.body);
      }
    }

    getUserRooms();
  }, [currentUser]);

  return (
    <div>
      {rooms && rooms.map((r) => (
        <div>{r.name}</div>
      ))}
    </div>
  );
}
