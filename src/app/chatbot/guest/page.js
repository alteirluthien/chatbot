// src/app/chatbot/guest/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FAQComponent from '../../../components/FAQComponent';
import { isValidElement } from 'react';
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
  const [messages, setMessages] = useState([]);
  const router = useRouter();

  // Initialize with welcome message
  useEffect(() => {
    setMessages([{ 
      sender: 'bot', 
      content: 'Welcome to College Enquiry! How can I help you today?' 
    }]);
  }, []);

  // Handle FAQ question click
  const handleFaqQuestionClick = (question) => {
    // Add the bot's response to the FAQ question
    addMessage('bot', faqResponses[question]);
  };

  // Function to add messages
  const addMessage = (sender, content) => {
    setMessages(prev => [...prev, { sender, content }]);
  };

  // Function to send a message
  const sendMessage = () => {
    if (!input.trim()) return;
    addMessage('user', input);
    setInput('');
    
    // Simulate bot response
    setTimeout(() => {
      addMessage('bot', "⚠️ AI unavailable. You can explore FAQs.");
    }, 500);
  };

  // Function to show FAQs
  const showFAQs = () => {
    // Add a message with the FAQ component
    addMessage('bot', (
      <FAQComponent 
        faqResponses={faqResponses} 
        onQuestionClick={handleFaqQuestionClick} 
      />
    ));
  };

  // Function to clear chat
  const clearChat = () => {
    setMessages([{ 
      sender: 'bot', 
      content: 'Chat cleared. You can start a new conversation.' 
    }]);
  };

  // Function to render message content safely
  const renderMessageContent = (content) => {
    if (typeof content === 'string') {
      return <span dangerouslySetInnerHTML={{ __html: content }} />;
    } else if (isValidElement(content)) {
      return content;
    } else {
      return <span>{String(content)}</span>;
    }
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
        <div className="chatbot-container" id="chat-container">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              <div className={`avatar ${msg.sender}-avatar`}></div>
              <div className={`message-bubble ${msg.sender}-bubble`}>
                {renderMessageContent(msg.content)}
              </div>
            </div>
          ))}
        </div>
        <div className="button-bar">
          <button onClick={showFAQs}>FAQ</button>
          <button onClick={() => router.push('/login')}>Login</button>
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