// src/components/FAQComponent.js
import React, { useEffect, useRef } from 'react';

const FAQComponent = ({ faqResponses, onQuestionClick }) => {
  const faqContainerRef = useRef(null);

  useEffect(() => {
    if (faqContainerRef.current) {
      // Clear existing content
      faqContainerRef.current.innerHTML = '';
      
      // Create buttons for each FAQ question
      Object.keys(faqResponses).forEach((question) => {
        const qBtn = document.createElement("button");
        qBtn.className = "faq-question";
        qBtn.innerHTML = question;

        qBtn.onclick = () => {
          onQuestionClick(question);
        };

        faqContainerRef.current.appendChild(qBtn);
      });
    }
  }, [faqResponses, onQuestionClick]);

  return <div ref={faqContainerRef} className="faq-list"></div>;
};

export default FAQComponent;