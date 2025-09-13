import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { useAuth } from '../../contexts/AuthContext';
import '../styles/auth.css'; // Import the CSS file

const ChatGPTInterface = forwardRef((props, ref) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      { role: "assistant", content: "Hello! I'm your college enquiry assistant. How can I help you today?" }
    ]);
  }, []);

  // Function to send message
  const sendMessage = async (msg) => {
    if (!msg.trim()) return;
    
    // Add user message
    const userMessage = { role: "user", content: msg };
    setMessages(prev => [...prev, userMessage]);
    
    setIsLoading(true);
    
    try {
      // Prepare messages for API
      const apiMessages = [
        { role: "system", content: "You are a helpful assistant for a college enquiry chatbot. Provide accurate and concise information." },
        ...messages,
        userMessage
      ];
      
      // Call API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: apiMessages }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Add bot response
        setMessages(prev => [...prev, { role: "assistant", content: data.content }]);
      } else {
        // Handle error
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: `Sorry, I encountered an error: ${data.error || 'Unknown error'}` 
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Sorry, I couldn't connect to the server. Please try again later." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to clear messages
  const clearMessages = () => {
    setMessages([
      { role: "assistant", content: "Chat cleared. How can I help you today?" }
    ]);
  };
  
  // Expose functions to parent via ref
  useImperativeHandle(ref, () => ({
    sendMessage,
    clearMessages,
    getMessages: () => messages,
  }));

  return (
    <div className="chat-container">
      {messages.map((m, i) => (
        <div key={i} className={`message ${m.role}`}>
          {m.content}
        </div>
      ))}
      {isLoading && <div className="message assistant">Thinking...</div>}
    </div>
  );
});

export default ChatGPTInterface;