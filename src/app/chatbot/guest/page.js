'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // <-- import this
import '../../styles/auth.css';
import ChatGPTInterface from '../../../components/ChatGPTInterface';



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
  const router = useRouter(); // <-- initialize router

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

  const showFAQs = () => {
    const faqBubble = document.createElement("div");
    faqBubble.className = "message-bubble bot-bubble faq-container";

    const header = document.createElement("div");
    header.innerHTML = "<b>Frequently Asked Questions:</b>";
    faqBubble.appendChild(header);

    Object.keys(faqResponses).forEach((question) => {
      const qBtn = document.createElement("button");
      qBtn.className = "faq-question";
      qBtn.innerHTML = question;
      qBtn.onclick = () => addMessage('bot', faqResponses[question]);
      faqBubble.appendChild(qBtn);
    });

    const wrapper = document.createElement("div");
    wrapper.className = "chat-message bot";
    const avatar = document.createElement("div");
    avatar.className = "avatar bot-avatar";

    wrapper.appendChild(avatar);
    wrapper.appendChild(faqBubble);

    const chatContainer = document.getElementById("chat-container");
    chatContainer.appendChild(wrapper);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  };

  const clearChat = () => {
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) chatContainer.innerHTML = "";
    addMessage('bot', 'Chat cleared. You can start a new conversation.');
  };

  return (
    <div className="chatbot-page-wrapper">
      <header className="top-bar">
        <h1>College Enquiry (Guest)</h1>
        <div className="dropdown-container">
            <div className="menu-icon" onClick={() => document.getElementById("dropdownMenu").classList.toggle("show")}>☰</div>
              <div className="dropdown" id="dropdownMenu">
                <button onClick={clearChat}>Clear Chat</button>
              </div>
        </div>
      </header>

      <main className="chatbot-page">
        <div className="chatbot-container" id="chat-container"></div>

        <div className="button-bar">
          <button onClick={showFAQs}>FAQ</button>
          <button onClick={() => router.push('/login')}>Login</button> {/* fixed */}
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
