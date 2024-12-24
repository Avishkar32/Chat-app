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

const allmessages = {};

const chatMap = new Map();


const onlineUserslist = [];

const users = {}; // To map usernames to socket IDs

io.on('connection', (socket) => {
  console.log(socket.id);

  socket.on('register', (username) => {
    users[username] = socket.id; // Store username and socket ID
    console.log(`User ${username} connected with ID ${socket.id}`);
    console.log(users);
    io.emit('onlineUserswithnames', users);
  });

  // When a new user connects
  onlineUserslist.push(socket.id);

  // Emit to all connected sockets
  io.emit('onlineUsers', onlineUserslist);

 

  // Emit to the newly connected user
  socket.emit('onlineUsers', onlineUserslist);

  

  socket.on('sendMessage',({listner,message} )=> {

   console.log(listner);

   console.log(message);

   console.log(socket.id);

   // Normalize the key by sorting the array
   const key = [listner, socket.id].sort().join('|'); // Use '|' as separator for unique key string

   console.log(key);

   // Check if the chat already exists between these two users
   if (!chatMap.has(key)) {
       // If not, initialize an empty array for their chat
       chatMap.set(key, []);
   }

    // Add the message along with sender ID to the chat
    chatMap.get(key).push({ sender: socket.id , message , senderUsername: Object.keys(users).find(key => users[key] === socket.id)});

    //CHECK HERE

    console.log(chatMap); // To debug the current state of chats

    // Emit the message to the sender
    io.to(listner).emit('receive_message_sec',chatMap.get(key),socket.id); 
   //CHECK HERE

    socket.emit('receive_message',chatMap.get(key),); 
    //CHECK HERE


    


  })

  socket.on('getchathistory', (userKey) => {

    const key = [userKey, socket.id].sort().join('|'); 

    

   // Check if the chat already exists between these two users
    if (!chatMap.has(key)) {
        // If not, initialize an empty array for their chat
        chatMap.set(key, []);
    }

    
    socket.emit('receive_message',chatMap.get(key));



  })



  




  // Handle user disconnect
  socket.on('disconnect', () => {
    const index = onlineUserslist.indexOf(socket.id);
    if (index !== -1) {
      onlineUserslist.splice(index, 1);
    }
    io.emit('onlineUsers', onlineUserslist);

    const username = Object.keys(users).find(key => users[key] === socket.id);
    if (username) {
      delete users[username];
      console.log(`User ${username} disconnected`);
    }
    console.log(users);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
