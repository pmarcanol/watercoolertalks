const {Room} = require('../Rooms/rooms.model')

module.exports.getRooms = async function(req, res) {
    const userId = req.params.id;
    console.log(req);
    const rooms = await Room.find({owner: userId});

    console.log(rooms)
    res.json({data: rooms});
}