import './messenger.css';
import Conversation from '../components/conversations/Conversation';
import Message from '../components/message/Message';
import ChatOnline from '../components/chatOnline/ChatOnline';
import { useContext, useEffect, useRef, useState } from 'react';

import axios from 'axios';
import { io } from 'socket.io-client';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { Button } from '@material-ui/core';

export default function Messenger() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [onBot, setOnBot] = useState(false);
  const [botMessages, setBotMessages] = useState([
    { sender: 'bot', text: 'Hi! I am tob' },
  ]);
  const [newBotMessage, setNewBotMessage] = useState('');

  const socket = useRef();
  const { user } = useContext(AuthContext);
  const scrollRef = useRef();

  useEffect(() => {
    socket.current = io('ws://localhost:8900');
    socket.current.on('getMessage', (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit('addUser', user._id);
    socket.current.on('getUsers', (users) => {
      setOnlineUsers(
        user.followings.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get('/conversations/' + user._id);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get('/messages/' + currentChat?._id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.current.emit('sendMessage', {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post('/messages', message);
      setMessages([...messages, res.data]);
      setNewMessage('');
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitBot = async (e) => {
    e.preventDefault();
    const message = {
      sender: 'user',
      text: newBotMessage,
    };

    try {
      const res = await axios.get('http://127.0.0.1:5000/?msg=message.text');
      console.log(res);
      setBotMessages([
        ...botMessages,
        message,
        { sender: 'bot', text: res.data },
      ]);
      setNewBotMessage('');
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      <Navbar />
      <div className='messenger'>
        <div className='chatMenu'>
          <div className='chatMenuWrapper'>
            <h5 style={{ marginTop: '10px' }}>Chat with Bot</h5>
            <Button onClick={() => setOnBot(!onBot)}> Chat With Tob</Button>
            <h5 style={{ marginTop: '10px' }}>Previous Conversations</h5>
            {conversations.map((c) => (
              <div onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className='chatBox'>
          <div className='chatBoxWrapper'>
            {onBot ? (
              <div>
                <div className='chatBoxTop'>
                  {botMessages.map((m) => (
                    <div ref={scrollRef}>
                      <Message message={m} own={m.sender === 'user'} />
                    </div>
                  ))}
                </div>
                <div className='chatBoxBottom'>
                  <textarea
                    className='chatMessageInput'
                    placeholder='write something...'
                    onChange={(e) => setNewBotMessage(e.target.value)}
                    value={newBotMessage}></textarea>
                  <button
                    className='chatSubmitButton'
                    onClick={handleSubmitBot}>
                    Send
                  </button>
                </div>
              </div>
            ) : currentChat ? (
              <>
                <div className='chatBoxTop'>
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message message={m} own={m.sender === user._id} />
                    </div>
                  ))}
                </div>
                <div className='chatBoxBottom'>
                  <textarea
                    className='chatMessageInput'
                    placeholder='write something...'
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}></textarea>
                  <button className='chatSubmitButton' onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className='noConversationText'>
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className='chatOnline'>
          <div className='chatOnlineWrapper'>
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user._id}
              setCurrentChat={setCurrentChat}
            />
          </div>
        </div>
      </div>
    </>
  );
}
