const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

// Middleware
app.use(cors());

// In-memory message storage
const messages = [];
const messagesByRoom = {};

// Socket.io
io.on('connection', (socket) => {
  console.log('A user connected');

  // console.log(socket.id);
  // console.log(messages);

  // Send previous messages to the connected user;
  // socket.emit('previousMessages', messages);

  // Listen for new messages
  socket.on('chatMessage', (msg) => {
    messages.push(msg); // Store the message in memory
    io.emit('chatMessage', msg); // Broadcast the message to all clients
  });

  socket.on('joinRoom',({roomName,username,roomname})=>{
    //here roomName represt the current room the client is in, we have to make the client leave from that room if he want to join another one.

    socket.leave(roomName);

    //roomname is the new room our client is going to join
    socket.join(roomname);
    console.log(`User ${username} joined room: ${roomname}`);

    socket.to(roomname).emit('chatMessage',{ username: "Alert", message:`User ${username} joined room: ${roomname}` });
    

    if (messagesByRoom[roomname]) {
      socket.emit('previousMessages', messagesByRoom[roomname]);
    } else {
      // Initialize an empty array for new rooms
      messagesByRoom[roomname] = [];
    }

  })

  socket.on("sendMessage",({roomName,username,message})=>{
    io.to(roomName).emit('chatMessage',{ username, message });
    console.log(`Msg to ${roomName}: ${message}`);

    if (!messagesByRoom[roomName]) {
      messagesByRoom[roomName] = [];
    }
    messagesByRoom[roomName].push({ username, message });
  })

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
