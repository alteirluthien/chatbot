'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/auth.css';

const faqResponses = {
  "What are the entry requirements?": "Entry requirements vary depending on the course. Please check the specific program page on our website or contact admissions for more details.",
  "How do I apply for an undergraduate program?": 'You can apply via our online application portal. <a href="https://www.vu.edu.au/enquire-now" target="_blank" rel="noopener noreferrer"><u>Click Here ➚</u></a>',
  "I'm having trouble enrolling": "If you're experiencing issues with enrolment, please contact Student Services or contact us at enquiry@vu.edu.au or call +61 3 9919 6100.",
  "How do I submit an application for admission?": "Applications can be submitted through the online portal. Make sure to upload your academic transcripts and other required documents.",
  "How do I enrol in subjects?": "Log in to your student portal, go to 'Enrolment', and select your subjects. A step-by-step guide is available if needed.",
  "How much are the course fees?": "Course fees vary by course and student type. Please visit the fee schedule section on the college website.",
  "How do I pay my fees?": "Fees can be paid through your student portal using credit card, bank transfer, or other listed methods.",
  "How do I accept my offer?": "Log into the application portal, click 'Accept Offer', and follow the instructions to confirm your place.",
  "My student ID card is lost or stolen": "Report the loss to Student Services. You can request a replacement through the student portal or at the help desk."
};

export default function GuestChatbotPage() {
  const [input, setInput] = useState('');
  const [faqVisible, setFaqVisible] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  const addMessage = (sender, content) => {
    const chatContainer = document.getElementById("chat-container");
    if (!chatContainer) return;

    const messageWrapper = document.createElement("div");
    messageWrapper.className = `chat-message ${sender}`;

    const avatar = document.createElement("div");
    avatar.className = `avatar ${sender}-avatar`;

    const bubble = document.createElement("div");
    bubble.className = `message-bubble ${sender}-bubble`;

    if (typeof content === "string") {
      bubble.innerHTML = content;
    } else {
      bubble.appendChild(content);
    }

    if (sender === "user") {
      messageWrapper.appendChild(bubble);
      messageWrapper.appendChild(avatar);
    } else {
      messageWrapper.appendChild(avatar);
      messageWrapper.appendChild(bubble);
    }

    chatContainer.appendChild(messageWrapper);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    addMessage('user', input);
    setInput('');

    setTimeout(() => {
      addMessage('bot', "⚠️ AI unavailable. You can explore FAQs.");
    }, 500);
  };

  const showFAQs = () => setFaqVisible(!faqVisible);

  const handleFaqClick = (question) => {
    addMessage('bot', faqResponses[question]);
    setFaqVisible(false);
  };

  const clearChat = () => {
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) chatContainer.innerHTML = "";
    addMessage('bot', 'Chat cleared. You can start a new conversation.');
  };

  const saveChat = async () => {
    if (!user) return alert("Login first to save chat.");

    const chatContainer = document.getElementById("chat-container");
    const messages = Array.from(chatContainer.children).map(div => {
      const sender = div.classList.contains('user') ? 'user' : 'bot';
      const text = div.querySelector('.message-bubble').innerText;
      return { sender, text };
    });

    const sessionId = Date.now().toString();

    const res = await fetch('/api/auth/savechat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat: messages, userEmail: user.email, sessionId })
    });

    const result = await res.json();
    alert(result.message);
  };

  const openPreviousChat = async () => {
    if (!user) return alert("Login first to open previous chat.");

    const res = await fetch("/api/auth/getPreviousChat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userEmail: user.email })
    });

    const result = await res.json();

    if (result.status === "success") {
      clearChat();
      result.chat.forEach(msg => addMessage(msg.sender, msg.chat_message));
    } else {
      alert(result.message);
    }
  };

  const feedback = () => alert("Open feedback modal (mock function).");

  return (
    <div className="chatbot-page-wrapper">
      <header className="top-bar">
        <h1>College Enquiry (Guest)</h1>
        <div className="dropdown-container">
          <div className="menu-icon" onClick={() => document.getElementById("dropdownMenu").classList.toggle("show")}>☰</div>
          <div className="dropdown" id="dropdownMenu">
            <button onClick={saveChat}>Save Chat</button>
            <button onClick={openPreviousChat}>Open Previous Chat</button>
            <button onClick={clearChat}>Clear Chat</button>
            <button onClick={feedback}>Feedback</button>
            <button onClick={() => { logout(); router.push('/login'); }}>Logout</button>
          </div>
        </div>
      </header>

      <main className="chatbot-page">
        <div className="chatbot-container" id="chat-container"></div>

        <div className="button-bar">
          <button onClick={showFAQs}>FAQ</button>
          <button onClick={() => router.push('/login')}>Login</button>
          {faqVisible && (
            <div className="faq-container">
              <b>Frequently Asked Questions:</b>
              {Object.keys(faqResponses).map((q) => (
                <button key={q} className="faq-question" onClick={() => handleFaqClick(q)}>
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="chat-footer">
        <div className="input-bubble">
          <input
            type="text"
            placeholder="Send your message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage}>🔍</button>
        </div>
      </footer>
    </div>
  );
}
