import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';

function SubmitComplaint() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [photo, setPhoto] = useState(null);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('category', category);
    if (photo) {
      formData.append('photo', photo);
    }

    const token = localStorage.getItem('token');

    const response = await axios.post(
      'http://127.0.0.1:8000/api/complaints/submit',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    setTicketId(response.data.ticket_id);
    setSubmitted(true);

  } catch (err) {
    setError(err.response?.data?.detail || 'Something went wrong!');
  }
};

  return (
    <div className="auth-container">
      <div className="navbar">
        <h2> Digital Grievance Redressal System</h2>
      </div>

      <div className="auth-box" style={{maxWidth: '550px'}}>

        {/* Complaint submitted successfully */}
        {submitted ? (
          <div style={{textAlign: 'center'}}>
            <h2 style={{color: '#1a237e'}}>✅ Complaint Submitted!</h2>
            <p>Your complaint has been registered successfully.</p>
            <div className="ticket-box">
              <p>Your Ticket ID:</p>
              <h2 style={{color: '#081497'}}>{ticketId}</h2>
              <p style={{fontSize: '13px', color: '#777'}}>
                Please save this Ticket ID to track your complaint status.
              </p>
            </div>
            <button 
              className="btn-primary" 
              onClick={() => window.location.href='/track'}>
              Track Complaint
            </button>
            <button 
              className="btn-secondary" 
              style={{color: '#081497', border: '2px solid #081497', marginLeft: '10px'}}
              onClick={() => window.location.href='/'}>
              Back to Home
            </button>
          </div>
        ) : (
          <>
            <h2>📝 Submit Complaint</h2>
            <p>Fill the form below to register your complaint</p>

            {error && <div className="error-msg">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  placeholder="Enter complaint title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Water">Water</option>
                  <option value="Sanitation">Sanitation</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  placeholder="Enter location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Describe your complaint in detail"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                />
              </div>
              <div className="form-group">
                 <label>Photo (Optional)</label>
                  <input
                         type="file"
                         accept="image/*,video/*"
                        onChange={(e) => setPhoto(e.target.files[0])}
                         />
                </div>


              <button type="submit" className="btn-primary btn-full">
                Submit Complaint
              </button>
            </form>

            <p className="auth-link">
              <a href="/">← Back to Home</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default SubmitComplaint;