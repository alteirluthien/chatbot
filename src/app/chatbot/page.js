// src/app/chatbot/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import FAQComponent from '../../components/FAQComponent';
import { isValidElement } from 'react';
import '../styles/auth.css';
import FeedbackModal from '../../components/FeedbackModal';

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

export default function ChatbotPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

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

  // Function to send a message
  const sendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    addMessage('user', input);
    
    // Get bot response
    const botResponse = getBotReply(input);
    
    // Add bot response after a short delay
    setTimeout(() => {
      addMessage('bot', botResponse);
    }, 500);
    
    // Clear input
    setInput('');
  };

  // Function to show FAQs
  const showFAQs = () => {
    // Add a message with the FAQ component
    addMessage('bot', (
      <div className="faq-bubble">
        <div className="faq-header">Here are some frequently asked questions:</div>
        <FAQComponent 
          faqResponses={faqResponses} 
          onQuestionClick={handleFaqQuestionClick} 
        />
      </div>
    ));
  };

  // Function to clear chat
  const clearChat = () => {
    setMessages([{ 
      sender: 'bot', 
      content: 'Chat cleared. You can start a new conversation.' 
    }]);
  };

  // Function to save chat
  const saveChat = async () => {
    if (!user) return alert("Login first to save chat.");
    
    try {
      // Only save messages with string content (filter out React elements)
      const stringMessages = messages.filter(msg => typeof msg.content === 'string');
      
      const formattedMessages = stringMessages.map(msg => ({
        sender: msg.sender,
        text: msg.content
      }));
      
      const res = await fetch('/api/auth/savechat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chat: formattedMessages, 
          userEmail: user.email, 
          sessionId: Date.now().toString() 
        })
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const result = await res.json();
      
      if (result.status === 'success') {
        alert(`Chat saved successfully! (${result.messagesSaved} messages)`);
      } else {
        alert(result.message || 'Failed to save chat');
      }
    } catch (error) {
      console.error('Error saving chat:', error);
      alert('Network error while saving chat');
    }
  };

  // Function to open previous chat
  const openPreviousChat = async () => {
    if (!user) return alert("Login first to open previous chat.");
    
    try {
      const res = await fetch("/api/auth/getPreviousChat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: user.email })
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const result = await res.json();
      
      if (result.status === "success") {
        // Clear existing messages
        setMessages([]);
        
        // Convert the retrieved messages to the format expected by the component
        const formattedMessages = result.chat.map(msg => ({
          sender: msg.sender,
          content: msg.text || msg.chat_message || ''  // Ensure we have a string
        }));
        
        // Set all messages at once
        setMessages(formattedMessages);
        
        // Show success message
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            sender: 'bot', 
            content: `Previous chat loaded (${result.chat.length} messages)` 
          }]);
        }, 100);
      } else {
        alert(result.message || "Failed to load previous chat");
      }
    } catch (error) {
      console.error("Error loading previous chat:", error);
      alert("Network error while loading previous chat");
    }
  };

  // Function to handle feedback
  const feedback = () => {
    setIsFeedbackModalOpen(true);
  };

  // Function to handle feedback submission
  const handleFeedbackSubmit = async (feedbackData) => {
    if (!user) return alert("Login first to submit feedback.");
    
    try {
      console.log('Submitting feedback:', feedbackData);
      
      const res = await fetch('/api/auth/feedback', {  // Changed to /api/auth/feedback
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...feedbackData, 
          userEmail: user.email,
          sessionId: Date.now().toString()
        })
      });
      
      console.log('Response status:', res.status);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
      
      const result = await res.json();
      console.log('Response data:', result);
      
      if (result.status === 'success') {
        alert('Thank you for your feedback!');
        setIsFeedbackModalOpen(false);
      } else {
        alert(result.message || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert(`Error submitting feedback: ${error.message}`);
    }
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
        <h1>College Enquiry</h1>
        <div className="dropdown-container">
          <div className="menu-icon" onClick={() => setShowDropdown(!showDropdown)}>☰</div>
          <div className={`dropdown ${showDropdown ? 'show' : ''}`} id="dropdownMenu">
            <button onClick={saveChat}>Save Chat</button>
            <button onClick={openPreviousChat}>Open Previous Chat</button>
            <button onClick={clearChat}>Clear Chat</button>
            <button onClick={feedback}>Feedback</button>
            <button onClick={() => { logout(); router.push('/login'); }}>Logout</button>
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
      
      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
}