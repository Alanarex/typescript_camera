import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { socket } from '../context/socket';
import '../styles/Messages.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const Messages = () => {
  const navigate = useNavigate();

  interface Message {
    username: string;
    text: string;
    location?: string;
    dateTime?: string;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const username = localStorage.getItem('login') || 'Anonymous';
  const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [storedLocationData] = useState(() => {
    const data = localStorage.getItem('locationData');
    return data ? JSON.parse(data) : null;
  });

  useEffect(() => {
    if (!username) {
      navigate('/login');
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    fetch('http://localhost:8080/messages')
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error('Error fetching messages:', err));

    // Load existing users from localStorage
    setOnlineUsers(existingUsers);

    // Handle new messages
    const handleNewMessage = (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    // Handle user coming online
    const handleUserOnline = (login: string) => {
      if (login !== username) {
        toast(`${login} is now online!`, { position: 'top-right' });
      }
      setOnlineUsers((prevUsers) => [...new Set([...prevUsers, login])]);
    };

    // Handle user going offline
    const handleUserOffline = (login: string) => {
      setOnlineUsers((prevUsers) => prevUsers.filter((user) => user !== login));
    };

    socket.off('message').on('message', handleNewMessage);
    socket.off('user-online').on('user-online', handleUserOnline);
    socket.off('user-offline').on('user-offline', handleUserOffline);

    socket.emit('user-online', username);

    return () => {
      socket.off('message', handleNewMessage);
      socket.off('user-online', handleUserOnline);
      socket.off('user-offline', handleUserOffline);
    };
  }, [username, navigate]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        username,
        text: message,
        location: storedLocationData ? `${storedLocationData.city}, ${storedLocationData.country}` : 'Unknown location',
        dateTime: new Date().toLocaleString()
      };
      socket.emit('message', newMessage);
      setMessage('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      <div className="messages-page">
        <h1>Messages</h1>
        <div className="content">
          {/* Online Users List (Left Side) */}
          <div className="online-users">
            <h2>Online Users</h2>
            {onlineUsers.map((user, index) => (
              <div key={index} className="online-user">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user)}&background=random`}
                  alt={`${user}'s profile`}
                  className="profile-picture"
                />
                <span className="user-username">
                  {user}
                </span>
              </div>
            ))}
          </div>

          {/* Messages Container */}
          <div className="messages-container">
            <div className="messages-list">
              {messages.map((msg, index) => (
                <div key={index} className={`message-container ${msg.username === username ? 'my-message-container' : 'other-message-container'}`}>
                  {msg.username !== username ? (
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(msg.username)}&background=random`}
                      alt={`${msg.username}'s profile`}
                      className="profile-picture"
                    />
                  ) : null}

                  <div className={`message ${msg.username === username ? 'my-message' : 'other-message'}`}>
                    <div className="message-content">
                      <span className="message-text">{msg.text}</span>
                    </div>
                  </div>

                  {msg.username === username ? (
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(msg.username)}&background=random`}
                      alt={`${msg.username}'s profile`}
                      className="profile-picture"
                    />
                  ) : null}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="message-input-container">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="message-input"
              />
              <button onClick={handleSendMessage} className="send-button">
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Messages;
