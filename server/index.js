const cors = require("cors");
const AccessToken = require("twilio").jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const express = require("express");
const env = require("dotenv");
const {json, urlencoded} = require("body-parser");
const { auth, signup, login } = require("./utils/auth");
const User = require("./Users/users.model");
const mongoose = require("mongoose");

env.config();
const app = express();
require("./utils/passport");

app.use(cors());
app.use(json());
app.use(
  urlencoded({
    extended: true,
  })
);




const appRouter =  express.Router();


app.use('/auth', auth.optional);
app.use('/auth/signup', signup);
app.use('/auth/login', login);


const MAX_SESSION_TIME = 3600;

async function init() {  
  try {
    await mongoose.connect(`mongodb://${process.env.MONGO_URL}/${process.env.MONGO_DB}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoose.set("debug", true);
    app.listen(3000, async () => {
      console.log("app Listening on 3000");
    });
  } catch (e) {
    console.log(e);
    init();
  }
  
  // appRouter.get('/user', auth.required, async (req, res, next) => {
  //   return res.json(await Users.find({}));
  // })
  
  
  // app.use('/api', auth.required, appRouter)

}

init();




// Step 1: generate access token from the user name, and validate
// against twilio servers. Return to the user
// app.post("/login",auth.optional, );


