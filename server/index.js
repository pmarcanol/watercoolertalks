const cors = require("cors");
const AccessToken = require("twilio").jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const express = require("express");
const env = require("dotenv");
const bodyParser = require("body-parser");
const { auth } = require("./utils/auth");
const User = require("./Users/users.model");
const mongoose = require("mongoose");
const passport = require('passport');

env.config();

mongoose.connect(`mongodb://${process.env.MONGO_URL}/${process.env.MONGO_DB}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("debug", true);
const Users = mongoose.model('Users');

require("./Users/users.model");
require("./utils/passport");

const MAX_SESSION_TIME = 3600;

const app = express();
app.use(cors());
app.use("/", express.static("../client/build"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.listen(3000, async () => {
  console.log("app Listening on 3000");
});

app.post("/signup", auth.optional, async (req, res) => {
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
});
// Step 1: generate access token from the user name, and validate
// against twilio servers. Return to the user
app.post("/login",auth.optional, (req, res, next) => {
  const { email, password } = req.body;

  // console.log(req.body);
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

    console.log('USER', info);
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
});

app.get('/user', auth.required, async (req, res, next) => {
  return res.json(await Users.find({}));
})
