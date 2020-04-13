const mongoose = require("mongoose");
const passport = require("passport");
const Users = require("../Users/users.model");

const signup = async (req, res) => {
  const { username, password } = req.body;
  const userExists = await Users.findOne({ username });
  if (userExists) {
    res.statusCode = 400;
    res.statusMessage = "An user with that username already exists";
    res.send();
  }
  const user = new Users({ username });
  user.setPassword(password);

  try {
    await user.save();
    res.json({ user: user.toAuthJSON() });
  } catch (e) {
    res.statusCode = 500;
    res.statusMessage = e;
    res.send();
  }
};

const login = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.statusCode = 400;
    res.statusMessage = "username and password are required";
    res.send();
    return;
  }

  return passport.authenticate(
    "local",
    { session: false },
    (err, user, info) => {
      if (err) {
        res.send(err);
      }
      user.token = user.generateJWT();
      res.json({
        data: {
          user: user.toAuthJSON(),
        },
      });
    }
  )(req, res, next);
};

module.exports = {
  login,
  signup,
};
