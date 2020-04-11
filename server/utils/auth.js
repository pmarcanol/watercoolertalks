const jwt = require("express-jwt");
// const Users =  require("../Users/users.model");
const mongoose = require('mongoose');
const passport = require('passport');

const getTokenFromHeaders = (req) => {
  const {
    headers: { authorization },
  } = req;

  if (authorization && authorization.split(" ")[0] === "Bearer") {
    return authorization.split(" ")[1];
  }
  return null;
};

const auth = {
  required: jwt({
    secret: "secret",
    userProperty: "payload",
    getToken: getTokenFromHeaders,
  }),
  optional: jwt({
    secret: "secret",
    userProperty: "payload",
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  }),
};


//  auth.optional
const signup =  async (req, res) => {
  const Users =  mongoose.model('user');
  const { email, password } = req.body;
  const userExists =  await Users.findOne({email});
  console.log(userExists);
  if (userExists) {
    res.statusCode = 400;
    res.statusMessage = 'An user with that email already exists';
    res.send()
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

  if (!email|| !password) {
    res.statusCode = 400;
    res.statusMessage = "Email and password are required";
    res.send();
    return;
  }

  return passport.authenticate('local', {session: false}, (err, user, info) => {
    if (err) {
      res.send(err)
    }
    user.token =  user.generateJWT();
    res.json({user: user.toAuthJSON()})
  })(req, res, next)
  // const accessToken = new AccessToken(
  //   process.env.TWILIO_ACCOUNT_SID,
  //   process.env.TWILIO_API_KEY,
  //   process.env.TWILIO_API_SECRET,
  //   // Token additional settings, such as ttl and room
  //   { ttl: MAX_SESSION_TIME, name: room }
  // );

  // accessToken.identity = username;
  // const grant = new VideoGrant();
  // accessToken.addGrant(grant);

  // res.json({
  //   token: accessToken.toJwt(),
  // });
}
module.exports = {
  auth,
  signup,
  login
}