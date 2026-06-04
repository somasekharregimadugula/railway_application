

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Reusing Login styles for consistency

function Register() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('❌ Passwords do not match!');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await axios.post(`${API_URL}/api/register`, {
        username,
        password,
        role
      });

      if (response.data.success) {
        setMessage('✅ Registration Successful! Please login.');
        setMessageType('success');
        
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
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
      <div className="bg-animation">
        <div className="train-track"></div>
        <div className="floating-element fe-1">🚂</div>
        <div className="floating-element fe-2">🚃</div>
        <div className="floating-element fe-3">🚃</div>
        <div className="floating-element fe-4">🛤️</div>
      </div>

      <div className="login-box">
        <div className="login-header">
          <div className="logo-container">
            <div className="logo">📝</div>
            <div className="logo-glow"></div>
          </div>
          <h1 className="app-title">REGISTER</h1>
          <p className="app-subtitle">Create an IRCTC Account</p>
        </div>

        <form onSubmit={handleRegister} className="login-form">
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
                placeholder="Choose a username"
                required
                autoComplete="off"
              />
            </div>
          </div>

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
                placeholder="Create a password"
                required
                autoComplete="new-password"
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

          <div className="input-group">
            <label htmlFor="confirmPassword">
              <span className="label-icon">🔐</span>
              Confirm Password
            </label>
            <div className="input-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="input-group" style={{ display: 'none' }}>
             {/* Hidden role input for simplicity, defaults to user */}
             <input type="hidden" value={role} />
          </div>

          <button
            type="submit"
            className={`login-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="btn-loading">
                <span className="spinner"></span>
                Registering...
              </span>
            ) : (
              <span>✨ Create Account</span>
            )}
          </button>
        </form>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <div className="register-link">
          <p>Already have an account? <Link to="/">Login here</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
