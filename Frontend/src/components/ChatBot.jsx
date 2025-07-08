import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [activeSessionId, setActiveSessionId] = useState(() => localStorage.getItem('activeSessionId') || null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    toast.info('You have been logged out');
    navigate('/');
  };


  const saveSession = (title, msgs) => {
    const saved = JSON.parse(localStorage.getItem('chatSessions')) || [];
    const existingIndex = saved.findIndex(s => s.title === title);

    if (existingIndex !== -1) {
      saved[existingIndex].messages = msgs;
    } else {
      saved.push({ title, messages: msgs });
    }

    localStorage.setItem('chatSessions', JSON.stringify(saved));
    setSessions(saved);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const token = localStorage.getItem('token');
    const sessionId = activeSessionId;
    if (!token || !sessionId) {
      toast.error('Please login or start a new chat session.');
      return;
    }

    const userMessage = {
      sender: 'user',
      text: input,
      timestamp: new Date().toISOString(),
    };

    const updated = [...messages, userMessage];
    setMessages(updated);
    setInput('');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/query',
        { message: input, session_id: sessionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const botMessage = {
        sender: 'bot',
        text: res.data.reply || 'No reply from server.',
        timestamp: new Date().toISOString(),
      };

      const finalMsgs = [...updated, botMessage];
      setMessages(finalMsgs);
      saveSession(activeSession, finalMsgs);
    } catch (err) {
      const errorMsg = {
        sender: 'bot',
        text: 'Error: Something went wrong.',
        timestamp: new Date().toISOString(),
      };
      const finalMsgs = [...updated, errorMsg];
      setMessages(finalMsgs);
      saveSession(activeSession, finalMsgs);
    }
  };

  const handleReset = () => {
    setMessages([]);
    if (activeSession) {
      saveSession(activeSession, []);
    }
  };

  const startNewSession = async () => {
    const token = localStorage.getItem('token');
    if (!token) return toast.error('Please login to start a session');

    try {
      const title = 'Chat ' + new Date().toLocaleString();
      const res = await axios.post(
        'http://localhost:5000/api/sessions',
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const sessionId = res.data.session_id;
      localStorage.setItem('activeSessionId', sessionId);

      setActiveSession(title);
      setActiveSessionId(sessionId);
      setMessages([]);
      saveSession(title, []);
    } catch (err) {
      console.error('Failed to start session:', err);
      toast.error('Unable to start a new chat session.');
    }
  };

  const loadSession = (session) => {
    setActiveSession(session.title);
    setMessages(session.messages);
  };

  useEffect(() => {
  const token = localStorage.getItem('token');
  const sessionId = localStorage.getItem('activeSessionId');
  const savedSessions = JSON.parse(localStorage.getItem('chatSessions')) || [];

  setSessions(savedSessions);

  if (!token) return;

  if (!sessionId) {
    const title = 'Chat ' + new Date().toLocaleString();
    axios.post(
      'http://localhost:5000/api/sessions',
      { title },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(res => {
      const id = res.data.session_id;
      const newSession = { title, messages: [] };

      localStorage.setItem('activeSessionId', id);
      setActiveSessionId(id);
      setActiveSession(title);
      setMessages([]);

      const updatedSessions = [...savedSessions, newSession];
      localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
      setSessions(updatedSessions);
    })
    .catch(err => {
      console.error("Failed to auto-create session:", err);
      toast.error("Couldn't start a new session.");
    });
  } else {
    const found = savedSessions.find(s => s.title === activeSession);
    if (found) {
      setMessages(found.messages);
    }
  }

  // Dependencies included properly
}, [activeSession]); 


  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <h3 className="text-lg font-bold mb-4"> Sessions</h3>
        <button
          onClick={startNewSession}
          className="w-full bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
        >
          + New Chat
        </button>
        {sessions.map((session, idx) => (
          <div
            key={idx}
            className={`mb-3 p-2 rounded cursor-pointer ${
              session.title === activeSession ? 'bg-blue-200' : 'hover:bg-gray-100'
            }`}
            onClick={() => loadSession(session)}
          >
            <p className="text-sm font-semibold truncate">{session.title}</p>
            <p className="text-xs text-gray-500 truncate">
              {session.messages[0]?.text || 'No messages'}
            </p>
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-start py-10 px-4">
        <div className="w-full max-w-2xl flex justify-end mb-2">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-center mb-4"> Sales ChatBot</h2>
          <div className="h-80 overflow-y-auto border border-gray-200 p-4 rounded-md bg-gray-50 mb-4">
            {messages.map((msg, i) => (
              <div key={i} className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-2 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black'}`}>
                  <p>{msg.text}</p>
                  <div className="text-xs text-right mt-1 text-gray-600">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-400"
              placeholder="Type a message..."
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Send
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
