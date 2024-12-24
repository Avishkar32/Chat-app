import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './index.css';


const socket = io('http://localhost:5000');

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

    socket.on('onlineUsers', handleOnlineUsers);

    const handleAllchat = (allchat) => {
      setAllchat(allchat);
    };

    socket.on('receive_message', handleAllchat);

    const handleAllchattwo = (allchat, socketid) => {
      if (listner === socketid) {
        setAllchat(allchat);
      }
    };
    socket.on('receive_message_sec', handleAllchattwo);

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
    setListner(userKey);
    socket.emit('getchathistory', userKey);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Real-Time Chat
        </h1>
        
        <div className="flex gap-6">
          {/* Online Users Sidebar */}
          <div className="w-1/4 bg-white rounded-lg shadow-lg h-[80vh]">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700">Online Users</h2>
            </div>
            <div className="overflow-y-auto h-[calc(100%-60px)]">
              {onlineUsers
                .filter(user => user !== socket.id)
                .map((user) => (
                  <div
                    key={user}
                    onClick={() => startChat(user)}
                    className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 ${
                      listner === user ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                        {user.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="ml-3 text-sm text-gray-700 truncate">
                        {user}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 bg-white rounded-lg shadow-lg h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700">
                {listner ? `Chat with: ${listner}` : 'Select a user to start chatting'}
              </h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {allchat.map(({ sender, message }, idx) => (
                <div
                  key={`${sender}-${idx}`}
                  className={`flex ${sender === socket.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      sender === socket.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {sender === socket.id ? 'You' : sender}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={sendtext}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-150"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;