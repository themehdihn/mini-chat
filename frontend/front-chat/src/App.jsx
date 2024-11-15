import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:5000');

const App = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('load_messages', (messages) => {
      setMessages(messages);
    });

    socket.on('new_message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('load_messages');
      socket.off('new_message');
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleLogin = () => {
    if (!username) {
      setErrorMessage('لطفاً یک یوزرنیم وارد کنید.');
      return;
    }

    socket.emit('set_username', username, (response) => {
      if (response.success) {
        setIsLoggedIn(true);
        setErrorMessage('');
      } else {
        setErrorMessage(response.message);
      }
    });
  };

  const handleUsernameChange = (e) => {
    const input = e.target.value;
    const regex = /^[a-zA-Z0-9_]*$/;
    if (regex.test(input)) {
      setUsername(input);
      setErrorMessage('');
    } else {
      setErrorMessage('فقط حروف لاتین، اعداد و زیرخط مجاز هستند.');
    }
  };

  const handleSendMessage = async () => {
    if (newMessage) {
      const messageData = {
        username: username,
        text: newMessage,
      };

      socket.emit('send_message', messageData);
      setNewMessage('');
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      <div className="chat-container">
        <h1>چت روم</h1>
        {!isLoggedIn ? (
          <div className="login-container">
            <input
              type="text"
              placeholder="نام کاربری دلخواه خود را وارد کنید"
              value={username}
              onChange={handleUsernameChange}
              className="username-input"
            />
            <button onClick={handleLogin} className="login-button">
              ورود
            </button>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
        ) : (
          <div>
            <div className="current-user">
              <p><strong>{username}</strong> نام کاربری</p>
            </div>
            <div className="messages-container" style={{ position: 'relative' }}>

              <ul className="messages-list">
                <div className='scroll-button-container'>
                  <button onClick={scrollToBottom} className="scroll-button">
                    رفتن به آخرین پیام
                  </button>
                </div>
                {messages.map((message, index) => (
                  <li
                    key={index}
                    className={
                      message.username === username ? 'my-message' : 'other-message'
                    }
                  >
                    <strong
                      className={
                        message.username === username
                          ? 'my-message-username'
                          : 'other-message-username'
                      }
                    >
                      {message.username !== username ? message.username : ''}
                    </strong>{' '}
                    {message.text}
                  </li>
                ))}

                <div ref={messagesEndRef}></div>
              </ul>
            </div>
            <div className="message-input-container">
              <input
                type="text"
                placeholder="... پیام خود را بنویسید"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="message-input"
              />
              <button onClick={handleSendMessage} className="send-button">
                ارسال
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Chat Section */}

      <div className='copyright'>
        <p>ساخته شده با ❤️ توسط مهدی حسینی</p>
      </div>
      {/* CopyRight */}

    </div>
  );
};

export default App;
