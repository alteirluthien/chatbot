'use client';

import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ChatGPTInterface from '../../components/ChatGPTInterface';
import './chatbot.css';

export default function ChatbotPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="chatbot-page-loading">
        <span>Loading...</span>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="chatbot-page">
      {/* Top bar */}
      <header className="top-bar">
        <h1>College Enquiry</h1>
        <div className="right-section">
          <span id="user-status" className="logged-in">{user.name}</span>
          <div className="dropdown-container">
            <div className="menu-icon" onClick={() => {
              document.getElementById('dropdownMenu').classList.toggle('show');
            }}>☰</div>
            <div className="dropdown" id="dropdownMenu">
              <button onClick={() => window.location.reload()}>Clear Chat</button>
              <button onClick={logout}>Logout</button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="chatbot-container">
        <div className="left-section">
          <div className="logo-circle">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4712/4712100.png"
              alt="Chatbot Logo"
            />
          </div>
        </div>

        <div className="right-section">
          <ChatGPTInterface />
        </div>
      </main>

 <footer>
  <input
    type="text"
    placeholder="Send a message…"
    id="chat-input"
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const msg = e.target.value.trim();
        if (msg) {
          // Send the message using your ChatGPTInterface
          ChatGPTInterface.sendMessage(msg);
          e.target.value = '';
        }
      }
    }}
  />
  <span
    className="send-icon"
    onClick={() => {
      const inputEl = document.getElementById('chat-input');
      const msg = inputEl.value.trim();
      if (msg) {
        ChatGPTInterface.sendMessage(msg);
        inputEl.value = '';
      }
    }}
  >
    🔍
  </span>
</footer>
    </div>
  );
}
