// ════════════════════════════════════════════════════
// IRCTC FRONTEND - LOGIN COMPONENT
// ════════════════════════════════════════════════════

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {



  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');  // 'success' or 'error'
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    

    setIsLoading(true);
    setMessage('');

    try {
      console.log('📤 Sending login request...');
      console.log('Username:', username);

      // Send POST request to backend
      const response = await axios.post('http://localhost:5000/api/login', {
        username: username,
        password: password
      });

      

      console.log('📥 Response received:', response.data);

      if (response.data.success) {
        // Login successful! ✅

        // Save token to localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.user.username);
        localStorage.setItem('role', response.data.user.role);

        

        setMessage('✅ Login Successful! Welcome ' + response.data.user.username + '!');
        setMessageType('success');

        // Redirect to dashboard after 1.5 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);

      }

    } catch (error) {
      // Login failed! ❌
      console.log('❌ Login error:', error);

      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage('❌ Cannot connect to server! Make sure backend is running.');
      }
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">

      {/* Animated Background Elements */}
      <div className="bg-animation">
        <div className="train-track"></div>
        <div className="floating-element fe-1">🚂</div>
        <div className="floating-element fe-2">🚃</div>
        <div className="floating-element fe-3">🚃</div>
        <div className="floating-element fe-4">🛤️</div>
      </div>

      <div className="login-box">

        {/* Logo & Header */}
        <div className="login-header">
          <div className="logo-container">
            <div className="logo">🚂</div>
            <div className="logo-glow"></div>
          </div>
          <h1 className="app-title">IRCTC</h1>
          <p className="app-subtitle">Indian Railway Catering & Tourism</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="login-form">

          {/* Username Input */}
          <div className="input-group">
            <label htmlFor="username">
              <span className="label-icon">👤</span>
              Username
            </label>
            <div className="input-wrapper">
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                autoComplete="username"
              />
            </div>
        
          </div>

          {/* Password Input */}
          <div className="input-group">
            <label htmlFor="password">
              <span className="label-icon">🔒</span>
              Password
            </label>
            <div className="input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className={`login-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="btn-loading">
                <span className="spinner"></span>
                Logging in...
              </span>
            ) : (
              <span>🔐 Login</span>
            )}
          </button>

        </form>

        {/* Message Box */}
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        

        {/* Register Link */}
        <div className="register-link">
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>

      </div>

    </div>
  );
}

export default Login;
