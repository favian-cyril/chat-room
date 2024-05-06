const express = require('express');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const ChatRoomSchema = require('./schema');

const app = express();
const server = http.createServer(app);
const io = socketio(server, 
  {
    cors: {
      // origin: '*', // Use wildcard only for development or it will get CORS error
      origin: process.env.ORIGIN,
      methods: ['GET', 'POST'],
    },
});

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URL);

const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);

// Endpoint to check wether the user is already in chatroom
app.post('/join', async (req, res) => {
  const { username, roomID } = req.body;
  const existingRoom = await ChatRoom.findOne({ roomID }).exec();

  if (existingRoom && existingRoom.usernames.includes(username)) {
    return res.status(400).json({ error: 'Username already exists in this chat room' });
  }

  if (existingRoom) {
    existingRoom.usernames.push(username);
    await existingRoom.save();
  } else {
    await ChatRoom.create({ roomID, usernames: [username], messages: [] });
  }

  res.status(200).json({ message: 'User is able to join the chatroom' });
});

// Endpoint to retrieve all past messages
app.get('/messages/:roomID', async (req, res) => {
  const { roomID } = req.params;

  try {
    const chatRoom = await ChatRoom.findOne({ roomID });

    if (!chatRoom) {
      return res.status(404).json({ error: 'Chat room not found' });
    }

    res.json(chatRoom.messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

io.on('connection', (socket) => {
  console.log('User connected');
  // When a user joins the room, either create a chatroom or join an existing chatroom
  socket.on('joinRoom', async ({ username, roomID }) => {
    const chatRoom = await ChatRoom.findOne({ roomID });
    if (chatRoom) {
      chatRoom.usernames.push(username);
      await chatRoom.save();
    } else {
      const newChatroom = await ChatRoom.create({ roomID, usernames: [username], messages: [] });
      newChatroom.save();
    }
    socket.join(roomID);
  });
  // When a user sends a message store it and emit message to all other users
  socket.on('chatMessage', async ({ roomID, username, message }) => {
    const chatRoom = await ChatRoom.findOne({ roomID });

    if (chatRoom) {
      const newMessage = {
        username,
        datetime: new Date(),
        message,
      };

      chatRoom.messages.push(newMessage);
      await chatRoom.save();

      io.to(roomID).emit('message', newMessage);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
