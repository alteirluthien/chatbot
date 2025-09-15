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

// Function to get bot response based on user message
function getBotReply(message) {
  // Convert message to lowercase for case-insensitive matching
  const lowerMessage = message.toLowerCase().trim();
  
  // Check if the message matches any FAQ question exactly
  for (const question in faqResponses) {
    if (lowerMessage === question.toLowerCase()) {
      return faqResponses[question];
    }
  }
  
  // Check for keywords in the message
  if (lowerMessage.includes("admission") || lowerMessage.includes("apply")) {
    return 'You can apply online through our website. Applications usually close in November. <a href="https://www.vu.edu.au/enquire-now" target="_blank" rel="noopener noreferrer"><u>Click Here ➚</u></a> to enquire now';
  }
  else if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
    return `Hello! What can I do for you?`;
  }
  else if (lowerMessage.includes("course") || lowerMessage.includes("program")) {
    return 'We offer IT, Business, Nursing, Engineering, and more. You can find details <a href="https://www.vu.edu.au/study-at-vu/courses/browse-study-areas/all-courses-a-to-z" target="_blank" rel="noopener noreferrer"><u>Here ➚</u></a>.';
  } else if (lowerMessage.includes("fee") || lowerMessage.includes("tuition")) {
    return 'Fees vary by course. International students typically pay from $18,000/year. <a href="https://www.vu.edu.au/study-at-vu/fees-scholarships/course-tuition-fees" target="_blank" rel="noopener noreferrer"><u>Click Here ➚</u></a> for more information';
  } else if (lowerMessage.includes("contact") || lowerMessage.includes("email") || lowerMessage.includes("phone")) {
    return "You can contact us at enquiry@vu.edu.au or call +61 3 9919 6100. Monday to Friday from 8 am to 5 pm";
  } else if (lowerMessage.includes("scholarship")) {
    return 'Yes, we offer both merit- and need-based scholarships. Visit our website for more details <a href="https://www.vu.edu.au/study-at-vu/fees-scholarships/scholarships" target="_blank" rel="noopener noreferrer"><u>Click Here ➚</u></a>';
  } else if (lowerMessage.includes("login")) {
    return 'You can log in using your student ID on the student portal. <a href="https://login.vu.edu.au/cas/login?service=https%3A%2F%2Fidpweb1.vu.edu.au%2Fidp%2FAuthn%2FExternal%3Fconversation%3De1s2%26entityId%3Dhttps%3A%2F%2Fmyvu.edu.au%2Fmyvu" target="_blank" rel="noopener noreferrer"><u>Click Here ➚</u></a> for student login portal';
  } else {
    return 'I am sorry, I did not understand that. You can ask about admissions, courses, fees, contact details or any frequently asked questions.';
  }
}

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
    // Add the user's question
    addMessage('user', question);
    // Add the bot's answer
    addMessage('bot', faqResponses[question]);
  };
  
  // Function to add messages
  const addMessage = (sender, content) => {
    setMessages(prev => [...prev, { sender, content }]);
  };
  
  // src/app/chatbot/guest/page.js

// Function to send a message
const sendMessage = async () => {
  if (!input.trim()) return;
  
  // Add user message
  addMessage('user', input);
  
  // Clear input
  const userMessage = input;
  setInput('');
  
  // Try to get a response from ChatGPT API
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [...messages, { sender: 'user', content: userMessage }] })
    });
    
    if (res.ok) {
      const data = await res.json();
      addMessage('bot', data.response);
    } else {
      throw new Error('API request failed');
    }
  } catch (error) {
    console.error('Error with ChatGPT API:', error);
    // Fallback to static responses
    const botResponse = getBotReply(userMessage);
    addMessage('bot', botResponse);
  }
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