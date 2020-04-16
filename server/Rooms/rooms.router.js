const { Router } = require("express");
const { createRoom, deleteRoom, getRoom, joinRoom } = require("./rooms.controller");
const r = Router();

r.route('/join').post(joinRoom)
r.route("/")
    .post(createRoom)
    .delete(deleteRoom)
    .get(getRoom);

module.exports = r;
