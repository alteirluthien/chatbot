'use client';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../styles/auth.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    // Trim passwords for comparison but keep original for submission
    if (formData.password.trim() !== formData.confirmPassword.trim()) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any previous errors
    setError('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Submitting registration with:', {
        name: formData.name,
        email: formData.email,
        passwordLength: formData.password.length
      });
      
      const result = await register(
        formData.name, 
        formData.email, 
        formData.password
      );
      
      console.log('Registration result:', result);
      
      if (result.success) {
        setSuccess(true);
        // Clear form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Network error. Please try again later.');
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
        
        {/* Right section with register form */}
        <div className="right-section">
          {success ? (
            <div className="success-message">
              <h2>Registration Successful!</h2>
              <p>Redirecting to login page...</p>
            </div>
          ) : (
            <form className="login-form" onSubmit={handleSubmit}>
              <h2>Create your account</h2>
              
              {error && <div className="error-message">{error}</div>}
              
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
              />
              
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
              
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
              
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
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
          )}
        </div>
      </div>
    </div>
  );
}