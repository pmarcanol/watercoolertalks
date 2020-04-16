const {Room} = require('../Rooms/rooms.model')

module.exports.getRooms = async function(req, res) {
    const userId = req.params.id;
    if (!userId) {
        res.status(400).json({errors: "Invalid User ID"})
    }
    try {
        const rooms = await Room.find({owner: userId});
        res.json({data: rooms});
    } catch(e) {
        res.status(500).json({errors: e})
    }
}