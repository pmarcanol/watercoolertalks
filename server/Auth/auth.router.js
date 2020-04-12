const {Router } = require('express');
const {login, signup} = require('./auth.controller');
const { auth} = require("../utils/authUtils");

const r = Router();

r.use(auth.optional);

r.post('/login',login)
r.post('/signup',signup)

module.exports = r; 