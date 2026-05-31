import React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  
  // Token check karo — login hai ya nahi
   const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('name');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="app">

      {/* Navbar */}
      {/* Navbar */}
<div className="navbar">
  <div className="navbar-left">
    <h2>  Digital Grievance Redressal System</h2>
  </div>

  {token ? (
    <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
      <span style={{color: 'white', fontSize: '14px'}}>
        👤 {name}
      </span>
      {token && role === 'citizen' && (
  <button 
    className="btn-login" 
    style={{backgroundColor: '#fffefe', marginRight: '10px'}}
    onClick={() => navigate('/dashboard')}>
    My Complaints
  </button>
)}

{token && (role === 'junior_admin' || role === 'senior_admin') && (
  <button
    className="btn-login"
    style={{backgroundColor: '#fffefe', marginRight: '10px'}}
    onClick={() => navigate('/admin')}>
    Admin Dashboard
  </button>
)}
      <button className="btn-login" onClick={handleLogout}>
        Logout
      </button>
    </div>
  ) : (
    <button className="btn-login" onClick={() => navigate('/login')}>
      Login
    </button>
  )}
</div>

      {/* Hero Section */}
      <div className="hero">
        <h1>Digital Grievance Redressal System</h1>
        <p>Submit your complaint and track its resolution transparently</p>
        <button className="btn-primary" onClick={() => navigate('/submit')}>
          Submit Complaint
        </button>
        <button className="btn-secondary" onClick={() => navigate('/track')}>
          Track Complaint
        </button>
      </div>

      {/* Features Section */}
      <div className="features">
        <h2>Our Services</h2>
        <div className="features-grid">
          <div className="feature-card">
            <img src="https://img.icons8.com/fluency/48/complaint.png"
              alt="Submit Complaint" className="card-icon"/>
            <h3>Submit Complaint</h3>
            <p>Register your complaint anonymously or with your account</p>
          </div>
          <div className="feature-card">
            <img src="https://img.icons8.com/fluency/48/search.png"
              alt="Track Status" className="card-icon"/>
            <h3>Track Status</h3>
            <p>Track your complaint status anytime using Ticket ID</p>
          </div>
          <div className="feature-card">
            <img src="https://img.icons8.com/fluency/48/lightning-bolt.png"
              alt="Fast Resolution" className="card-icon"/>
            <h3>Fast Resolution</h3>
            <p>Get your complaints resolved within defined time limits</p>
          </div>
          <div className="feature-card">
            <img src="https://img.icons8.com/fluency/48/appointment-reminders.png"
              alt="Notifications" className="card-icon"/>
            <h3>Notifications</h3>
            <p>Receive email updates on every status change</p>
          </div>
        </div>
      </div>

      {/* Emergency Numbers */}
      <div className="emergency">
        <h3>⚠️ For Emergencies — Do NOT use this portal</h3>
        <div className="emergency-numbers">
          <span>🚨 Police — 100</span>
          <span>🚒 Fire — 101</span>
          <span>🚑 Ambulance — 108</span>
          <span>📞 Emergency — 112</span>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <p>© 2026 MP Online Limited | Government of Madhya Pradesh</p>
      </div>

    </div>
  );
}

export default Home;