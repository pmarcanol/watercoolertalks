const cors = require("cors");
const AccessToken = require("twilio").jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const express = require("express");
const env = require("dotenv");
const bodyParser = require('body-parser')

env.config();

const MAX_SESSION_TIME = 3600;

const app = express();
app.use(cors())
app.use("/", express.static("../client/build"));
app.use( bodyParser.json() );      
app.use(bodyParser.urlencoded({    
  extended: true
})); 

app.listen(3000, () => {
});

// Step 1: generate access token from the user name, and validate
// against twilio servers. Return to the user
app.post("/login", (req, res) => {
  const {username, room} = req.body;

  console.log(req.body)
  if (!username) {
    res.statusCode = 400;
    res.statusMessage = "No name was provided";
    res.send();
    return;
  }
  const accessToken = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
    // Token additional settings, such as ttl and room
    { ttl: MAX_SESSION_TIME, name: room }
  );

  accessToken.identity = username;
  const grant = new VideoGrant();
  accessToken.addGrant(grant);

  res.json({
    token: accessToken.toJwt(),
  });
});
