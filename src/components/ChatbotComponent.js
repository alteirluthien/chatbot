'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatGPTInterface from './ChatGPTInterface';
import '../app/styles/auth.css';

export default function ChatbotComponent({ user, isGuest, logout }) {
  const [input, setInput] = useState('');
  const router = useRouter();

  const faqResponses = {
    "What are the entry requirements?": "Entry requirements vary depending on the course.",
    "How do I apply for an undergraduate program?": 'Apply via <a href="https://www.vu.edu.au/enquire-now" target="_blank"><u>Click Here ➚</u></a>',
    "I'm having trouble enrolling": "Contact Student Services at enquiry@vu.edu.au or +61 3 9919 6100."
  };

  function addMessage(sender, text) {
    const chatContainer = document.getElementById('chat-container');
    if (!chatContainer) return;

    const wrapper = document.createElement('div');
    wrapper.className = `chat-message ${sender}`;

    const avatar = document.createElement('div');
    avatar.className = `avatar ${sender === 'user' ? 'user-avatar' : 'bot-avatar'}`;

    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${sender === 'bot' ? 'bot-bubble' : ''}`;
    bubble.innerHTML = text;

    if (sender === 'user') {
      wrapper.appendChild(bubble);
      wrapper.appendChild(avatar);
    } else {
      wrapper.appendChild(avatar);
      wrapper.appendChild(bubble);
    }

    chatContainer.appendChild(wrapper);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  async function sendMessage() {
    if (!input.trim()) return;
    addMessage('user', input);
    const message = input;
    setInput('');

    try {
      const reply = await ChatGPTInterface.sendMessage(message);
      addMessage('bot', reply || 'No reply.');
    } catch {
      addMessage('bot', '⚠️ AI unavailable.');
    }
  }

  function showFAQs() {
    if (!user && !isGuest) return alert("Login to access FAQs");

    const chatContainer = document.getElementById('chat-container');
    const wrapper = document.createElement('div');
    wrapper.className = "chat-message bot";

    const avatar = document.createElement('div');
    avatar.className = "avatar bot-avatar";

    const bubble = document.createElement('div');
    bubble.className = "message-bubble bot-bubble";
    bubble.innerHTML = "Here are some frequently asked questions:";

    const faqContainer = document.createElement('div');
    faqContainer.className = "faq-buttons";

    Object.keys(faqResponses).forEach(q => {
      const btn = document.createElement('button');
      btn.className = "faq-button";
      btn.innerText = q;
      btn.onclick = () => {
        setInput(q);
        sendMessage();
      };
      faqContainer.appendChild(btn);
    });

    bubble.appendChild(faqContainer);
    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);
    chatContainer.appendChild(wrapper);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function clearChat() {
    const chatContainer = document.getElementById('chat-container');
    chatContainer.innerHTML = '';
    addMessage('bot', 'Chat cleared.');
  }

  return (
    <div className="chatbot-page-wrapper">
      <header className="top-bar">
        <h1>College Enquiry</h1>
        {user && (
          <div className="right-section">
            <span>Welcome, {user.name}</span>
            <div className="dropdown-container">
              <div className="menu-icon" onClick={() => document.getElementById("dropdownMenu").classList.toggle("show")}>☰</div>
              <div className="dropdown" id="dropdownMenu">
                <button onClick={clearChat}>Clear Chat</button>
                {user && <>
                  <button onClick={() => alert('Save Chat (mock)')}>Save Chat</button>
                  <button onClick={() => alert('Open Previous Chat (mock)')}>Open Previous Chat</button>
                  <button onClick={() => alert('Feedback (mock)')}>Feedback</button>
                  <button onClick={logout}>Logout</button>
                </>}
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="chatbot-page">
        <div className="chatbot-container" id="chat-container">
          {user && <div className="chat-message bot"><div className="avatar bot-avatar"></div><div className="message-bubble bot-bubble">Welcome, {user.name}!</div></div>}
        </div>

        <div className="button-bar">
          <button onClick={showFAQs}>FAQ</button>
          {!user && !isGuest && <button onClick={() => router.push('/login')}>Login</button>}
        </div>
      </main>

      <footer>
        <input type="text" placeholder="Send a message…" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} />
        <span className="send-icon" onClick={sendMessage}>🔍</span>
      </footer>
    </div>
  );
}
