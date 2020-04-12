const { Router } = require("express");
const { createRoom, deleteRoom, getRoom, joinRoom } = require("./rooms.controller");
const r = Router();

r.route("/")
    .post(createRoom)
    .delete(deleteRoom)
    .get(getRoom);
r.route('/join').post(joinRoom)

module.exports = r;
