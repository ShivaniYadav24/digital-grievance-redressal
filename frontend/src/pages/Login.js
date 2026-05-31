import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/auth/login', {
  email,
  password
});

// Token, role aur name save karo
localStorage.setItem('token', response.data.access_token);
localStorage.setItem('role', response.data.role);
localStorage.setItem('name', response.data.name);

if (response.data.role === 'junior_admin' || response.data.role === 'senior_admin') {
  navigate('/admin');
} else {
  navigate('/');
}
      
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong!');
    }
  };

  return (
    <div className="auth-container">
      <div className="navbar">
        <h2> Digital Grievance Redressal System</h2>
      </div>

      <div className="auth-box">
        <h2>Login</h2>
        <p>Welcome back! Please login to your account</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary btn-full">
            Login
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <a href="/register">Register here</a>
        </p>
        <p className="auth-link">
          <a href="/">← Back to Home</a>
        </p>
      </div>
    </div>
  );
}

export default Login;