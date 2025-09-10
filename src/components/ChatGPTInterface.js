import { forwardRef, useImperativeHandle, useState } from "react";

const ChatGPTInterface = forwardRef((props, ref) => {
  const [messages, setMessages] = useState([]);

  // Function to send message
  const sendMessage = (msg) => {
    if (!msg.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: msg }]);

    // TODO: call API here to get bot response
    setMessages((prev) => [...prev, { role: "assistant", content: "Bot reply here..." }]);
  };

  // Expose sendMessage() to parent via ref
  useImperativeHandle(ref, () => ({
    sendMessage,
  }));

  return (
    <div className="chat-container">
      {messages.map((m, i) => (
        <div key={i} className={`message ${m.role}`}>
          {m.content}
        </div>
      ))}
    </div>
  );
});

export default ChatGPTInterface;
