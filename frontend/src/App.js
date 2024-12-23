import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Backend URL

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [roomName, setRoomname] = useState("");

  useEffect(() => {

    const handlePreviousMessages = (msgs) => {
      setMessages(msgs);
    };

    const handleChatMessage = (msg) => {
      console.log(msg);
      setMessages((prev) => [...prev, msg]);
    };

    // Load previous messages
    socket.on('previousMessages', handlePreviousMessages);

    // Listen for new messages
    socket.on('chatMessage', handleChatMessage);

    socket.on('message',handleChatMessage);

    return () => {
      socket.off('previousMessages', handlePreviousMessages);
      socket.off('chatMessage', handleChatMessage);
    };
  }, []);

  // const sendMessage = () => {
  //   if (message.trim() && username.trim()) {
  //     socket.emit('chatMessage', { username, message });
  //     setMessage('');
  //   }
  // };

  const sendtext = () =>
  {
    socket.emit('sendMessage',{roomName,username,message});
    // setMessages((prev) => [...prev, msg]);
  }

  const joinRoom = (roomname) => {

    
    
    
    socket.emit('joinRoom',{roomName,username,roomname})
    //here roomname is the new roomname
    //and roomName is the old roomname, kinda, cause we have not updated it...u get it
    setRoomname(roomname);
  }

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
      <div style={{display:"flex"}}>
        
        <div style={{ border: '1px solid #ccc', padding: '10px', height: '280px', overflowY: 'scroll',width:'30vw' , marginTop:"65px"}}>
          <div style={{display:"flex", border: '1px solid #ccc', justifyContent:"space-around"}}>
            <p>Room 1</p>
            <button onClick={() => joinRoom("room1")}>Join Room</button>
            
          </div>
          <div style={{display:"flex", border: '1px solid #ccc', justifyContent:"space-around"}}>
            <p>Room 2</p>
            <button onClick={() => joinRoom("room2")}>Join Room</button>
           
          </div>
        </div>
        <div>
          <h2 style={{textAlign:"center"}}>Messages:</h2>
          <div style={{ border: '1px solid #ccc', padding: '10px', minHeight: '300px', overflowY: 'scroll',width:'50vw' }}>
          {messages.map((msg, idx) => (
            <div key={idx}>
              <strong>{msg.username}:</strong> {msg.message}
            </div>
          ))}
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
