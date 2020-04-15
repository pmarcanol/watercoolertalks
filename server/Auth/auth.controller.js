const mongoose = require("mongoose");
const passport = require("passport");
const Users = require("../Users/users.model");

const signup = async (req, res) => {
  const { username, password } = req.body;
  const userExists = await Users.findOne({ username });
  if (userExists) {
    res.status(400).json({errors: "An user with that username already exists"})
  }

  const user = new Users({ username });
  user.setPassword(password);

  try {
    await user.save();
    res.json({ data: { user: user.toAuthJSON() } });
  } catch (e) {
    res.status(500).json({errors: e})
  }
};

const login = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({errors: "username and password are required"})
    return;
  }

  return passport.authenticate(
    "local",
    { session: false },
    (err, user, info) => {
      let error;
      if (err) {
        error = err;
      }
      if (info && info.errors) {
        error = info.errors;
      }

      if (error) {
        res.status(400).send(error).end();
      } else {
        res.json({
          data: {
            user: user.toAuthJSON(),
          },
        });
      }
    }
  )(req, res, next);
};

module.exports = {
  login,
  signup,
};
