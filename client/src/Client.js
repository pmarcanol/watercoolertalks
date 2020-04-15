import React from "react";
import { useParams } from "react-router-dom";

function Client() {
  const { id } = useParams();
  return <div>Room: {id}</div>;
}

export default Client;
