
const mongoose = require('mongoose');

const signup = async (req, res) => {
  const Users = mongoose.model("user");
  const { email, password } = req.body;
  const userExists = await Users.findOne({ email });
  if (userExists) {
    res.statusCode = 400;
    res.statusMessage = "An user with that email already exists";
    res.send();
  }
  const user = new Users({ email });
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
  const { email, password } = req.body;

  if (!email || !password) {
    res.statusCode = 400;
    res.statusMessage = "Email and password are required";
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
      res.json({ user: user.toAuthJSON() });
    }
  )(req, res, next);
};

module.exports = {
  login,
  signup,
};
