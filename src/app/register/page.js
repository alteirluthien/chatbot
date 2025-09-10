'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../styles/auth.css';
; // ✅ reuse the same css as login

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    const result = await register(name, email, password);

    if (result.success) {
      // ✅ after registering, go to login page
      router.push('/login');
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  };

  return (
    <div className="login-page">
      {/* Top bar */}
      <div className="top-bar">
        <h1>College Enquiry</h1>
      </div>

      <div className="login-container">
        {/* Left section with logo */}
        <div className="left-section">
          <div className="logo-circle">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4712/4712100.png"
              alt="Chatbot Icon"
            />
          </div>
        </div>

        {/* Right section with register form */}
        <div className="right-section">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Create your account</h2>

            {error && <div className="error-message">{error}</div>}

            <label>Full name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label>Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label>Confirm password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="register-btn"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
            <p className="signup-link">
              Already have an account? <Link href="/login">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
