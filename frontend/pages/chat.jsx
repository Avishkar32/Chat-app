import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io("http://localhost:5000");

function Chat(){
    const [messages, setMessages]=useState([]);
    const [messgae, setMessage]
}