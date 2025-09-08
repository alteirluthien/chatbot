'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import "@/login/login.css";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(email, password);

    if (result.success) {
      router.push('/');
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  };

  return (
    <div className="login-container">
      {/* Left section with logo */}
      <div className="left-section">
        <div className="logo-circle">
          <img src="/logo.png" alt="Logo" />
        </div>
      </div>

      {/* Right section with login form */}
      <div className="right-section">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Sign in to your account</h2>

          {error && (
            <div style={{ color: "red", fontWeight: "bold" }}>{error}</div>
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

          <p className="signup-link">
            Don’t have an account? <Link href="/register">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
