const mongoose = require('mongoose');

const ChatRoomSchema = mongoose.Schema(
    {
        roomID: String,
        usernames: [String],
        messages: [{
          username: String,
          datetime: { type: Date, default: Date.now },
          message: String,
        }],
    }
)

module.exports = ChatRoomSchema