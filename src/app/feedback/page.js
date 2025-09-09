// app/feedback/page.jsx
"use client";

import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Link from "next/link";
import "./feedback.css";

export default function Feedback() {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feedback.trim() || !rating) return;

    // Placeholder API call (replace with DB or backend later)
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user?.user_email || "guest",
        message: feedback,
        rating,
      }),
    });

    if (res.ok) {
      setSubmitted(true);
      setFeedback("");
      setRating("");
    } else {
      alert("Failed to submit feedback. Try again.");
    }
  };

  return (
    <div>
      <header>
        <h1>Feedback</h1>
        <div className="search-bar">
          <input type="text" placeholder="Search…" />
          <span className="search-icon">🔍</span>
        </div>
      </header>

      <main className="feedback-container">
        {submitted ? (
          <div>
            <h2>✅ Thank you for your feedback!</h2>
            <button onClick={() => setSubmitted(false)}>Submit More</button>
            <p>
              <Link href="/chatbot">⬅ Back to Chatbot</Link>
            </p>
          </div>
        ) : (
          <form id="feedbackForm" onSubmit={handleSubmit}>
            <label htmlFor="feedbackText">Your Feedback</label>
            <textarea
              id="feedbackText"
              placeholder="Write your feedback here…"
              rows="5"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
            />

            <label htmlFor="rating">Rate your experience</label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            >
              <option value="">Select rating</option>
              <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
              <option value="4">⭐⭐⭐⭐ Good</option>
              <option value="3">⭐⭐⭐ Average</option>
              <option value="2">⭐⭐ Poor</option>
              <option value="1">⭐ Very Bad</option>
            </select>

            <button type="submit">Submit Feedback</button>
          </form>
        )}
      </main>
    </div>
  );
}

