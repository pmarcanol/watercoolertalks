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
  const { name, password } = req.body;
  const owner = req.payload.id;
  try {
    const roomExists = await Room.count({ name: RegExp(`/^${name}$/i`) });
    console.log(roomExists);
    if (roomExists) {
      res.status(400).json({
        errors: [`Room ${name} already exists`],
      });
      return;
    }
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
  const { roomName, password } = req.body;
  const reqUserId = req.payload.id;
  if (!roomName || !password) {
    res.status(400);
    res.statusMessage = `That combination of Room and Password doesn't exist`;
    res.send();
  }
  try {
    const room = await Room.findOne({ name: roomName });
    const isOwner = room.owner == reqUserId;
    const passwordIsValid = isOwner || room.validatePassword(password);
    if (passwordIsValid) {
      const accessToken = new AccessToken(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_API_SID,
        process.env.TWILIO_API_SECRET,
        // Token additional settings, such as ttl and room
        { ttl: MAX_SESSION_TIME }
      );

      accessToken.identity = reqUserId;
      const grant = new VideoGrant({ room: roomName });
      accessToken.addGrant(grant);
      res.json({ data: { token: accessToken.toJwt() } });
    } else {
      res.status(400).json({
        errors: [`That combination of Room and Password doesn't exist`],
      });
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
