'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import '../styles/auth.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');
  
  try {
    const result = await login(email, password);
    if (result.success) {
      router.push('/chatbot');
    } else {
      setError(result.error || 'Login failed');
    }
  } catch (err) {
    setError('Network error');
  } finally {
    setIsLoading(false);
  }
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
        {/* Right section with login form */}
        <div className="right-section">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Sign in to your account</h2>
            {error && (
              <div className="error-message">{error}</div>
            )}
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="primary-btn" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
            {/* Continue as Guest Button */}
            <button
              type="button"
              className="guest-btn"
              onClick={() => router.push('/chatbot/guest')}
              style={{ marginTop: '10px', backgroundColor: '#5d3d9c', color: 'white', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer' }}
            >
              Continue as Guest
            </button>
            <p className="signup-link">
              Don’t have an account? <Link href="/register">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}