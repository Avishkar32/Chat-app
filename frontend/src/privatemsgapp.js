import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Backend URL

function App() {
  
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [onlineUsers, setOnlineuser] = useState([]);

  const [listner, setListner] = useState('');

  const [allchat, setAllchat] = useState([]);

  

  


  useEffect(() => {
    

    const handleOnlineUsers = (onlineUserslist) => {
      setOnlineuser(onlineUserslist);
    };


    // Listen for online users
    socket.on('onlineUsers', handleOnlineUsers);

    const handleAllchat = (allchat) => {
      setAllchat(allchat);
      
    };

    socket.on('receive_message', handleAllchat);

    const handleAllchattwo = (allchat,socketid) => {
      
      console.log("The listner is");
      console.log(listner); 

      console.log("The socket id is");
      console.log(socketid);
      if(listner === socketid)
      {
        setAllchat(allchat);
      }
    }
    socket.on('receive_message_sec', handleAllchattwo );

    return () => {
      socket.off('onlineUsers', handleOnlineUsers);
      socket.off('receive_message', handleAllchat);
      socket.off('receive_message_sec', handleAllchattwo);
    };
  }, [listner]);

  const sendtext = () => {
    socket.emit('sendMessage', { listner, message });
    setMessage('');
  };

  

  const startChat = (userKey) => {
    console.log(socket.id);
    console.log(`Starting chat with user: ${userKey}`);
    setListner(userKey);
    
    socket.emit('getchathistory',userKey);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Simple Chat App</h1>
      <div>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: '10px', width: '300px' }}
        />
      </div>
      
      <div>
        <div style={{ display: "flex" }}>
          <div style={{ border: '1px solid #ccc', padding: '10px', height: '280px', overflowY: 'scroll', width: '30vw', marginTop: "65px" }}>
          <div>
            {onlineUsers
              .filter(user => user !== socket.id) // Filter out the current user's socket.id
              .map((user) => (
                <div 
                  key={user} 
                  style={{ display: "flex", border: '1px solid #ccc', justifyContent: "space-around" }}
                  onClick={() => startChat(user)}>
                  {user}
                </div>
              ))}
          </div>
          </div>
          <div>
            <h2 style={{ textAlign: "center" }}>Messages: {listner}</h2> 
            <div style={{ border: '1px solid #ccc', padding: '10px', minHeight: '300px', overflowY: 'scroll', width: '50vw' }}>
              

              {
                allchat.map(({ sender, message }, idx) => (
                  <div key={`${sender}-${idx}`}>
                    <strong>{sender}:</strong> {message}
                  </div>
                ))
              }
            </div>
            <div style={{ margin: '20px 0' }}>
              <input
                type="text"
                placeholder="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ padding: '10px', width: '300px' }}
              />
              <button onClick={sendtext} style={{ padding: '10px' }}>Send</button> 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;