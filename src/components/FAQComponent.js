// src/components/FAQComponent.js
'use client';

const FAQComponent = ({ faqResponses, onQuestionClick }) => {
  return (
    <div className="faq-container">
      <b>Frequently Asked Questions:</b>
      {Object.keys(faqResponses).map((question) => (
        <button
          key={question}
          className="faq-question"
          onClick={() => onQuestionClick(question)}
        >
          {question}
        </button>
      ))}
    </div>
  );
};

export default FAQComponent;