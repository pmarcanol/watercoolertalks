const { Router } = require("express");
const {getRooms} = require('./users.controller')
const r = Router();

r.get("/:id/rooms", getRooms);

module.exports = r


