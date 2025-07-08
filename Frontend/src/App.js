import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import ChatBot from './components/ChatBot';
import Register from './components/Register';
import { ToastContainer } from 'react-toastify';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/register" element={<Register />} />
      </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;