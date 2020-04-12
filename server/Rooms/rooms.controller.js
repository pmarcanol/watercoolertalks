const { Room } = require("./rooms.model");
const AccessToken = require("twilio").jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const defaultQuestions = [
  {
    name: "Is this a question?",
    imageUrl: "it is bwoi",
  },
];

const MAX_SESSION_TIME = 3600;
async function createRoom(req, res) {
  const { name, owner, password } = req.body;

  try {
    const newRoom = new Room({ name, owner, questions: defaultQuestions });
    newRoom.setPassword(password);
    await newRoom.save();
    res.json({ data: newRoom.toAuthJSON() });
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}

function deleteRoom(req, res) {
  res.status(404).end();
}

function getRoom(req, res) {
  res.status(404).end();
}

async function joinRoom(req, res) {
  const { roomName, password, userId } = req.body;
  if (!roomName || !password) {
    res.status(400);
    res.statusMessage = `That combination of Room and Password doesn't exist`;
    res.send();
  }
  try {
    const room = await Room.findOne({ name: roomName });
    const passwordIsValid = room.validatePassword(password);
    if (passwordIsValid) {
      const accessToken = new AccessToken(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_API_SID,
        process.env.TWILIO_API_SECRET,
        // Token additional settings, such as ttl and room
        { ttl: MAX_SESSION_TIME, name: roomName }
      );

      accessToken.identity = userId;
      const grant = new VideoGrant();
      accessToken.addGrant(grant);
      res.json({ data: accessToken.toJwt() });
    } else {
      res.status(400);
      res.statusMessage = `That combination of Room and Password doesn't exist`;
      res.send();
    }
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}

module.exports = {
  createRoom,
  deleteRoom,
  getRoom,
  joinRoom,
};
