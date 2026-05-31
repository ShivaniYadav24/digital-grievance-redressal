import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';

function TrackComplaint() {
  const [ticketId, setTicketId] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    setError('');
    setComplaint(null);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/complaints/track/${ticketId}`
      );
      setComplaint(response.data);
    } catch (err) {
      setError('Ticket not found! Please check your Ticket ID.');
    }
  };
const handleConfirmation = async (confirmed) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/complaints/confirm/${complaint.ticket_id}`,
        { confirmed: confirmed }
      );
      const response = await axios.get(
        `http://127.0.0.1:8000/api/complaints/track/${complaint.ticket_id}`
      );
      setComplaint({...response.data});
      setError('');
    } catch (err) {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/complaints/track/${complaint.ticket_id}`
      );
      setComplaint({...response.data});
      setError('');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      open: '#e53935',
      in_progress: '#ff6f00',
      resolved: '#1a9e75',
      rejected: '#555'
    };
    return colors[status] || '#555';
  };

  return (
    <div className="auth-container">
      <div className="navbar">
        <h2> Digital Grievance Redressal System</h2>
      </div>

      <div className="auth-box" style={{maxWidth: '600px'}}>
        <h2>🔍 Track Complaint</h2>
        <p>Enter your Ticket ID to track complaint status</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleTrack}>
          <div className="form-group">
            <label>Ticket ID</label>
            <input
              type="text"
              placeholder="Enter Ticket ID (e.g. GRV-2026-A3B4C)"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary btn-full">
            Track Complaint
          </button>
        </form>

        {complaint && (
          <div className="complaint-details">
            <h3>Complaint Details</h3>

            <div className="detail-row">
              <span className="detail-label">Ticket ID</span>
              <span className="detail-value" style={{color: '#081497', fontWeight: 'bold'}}>
                {complaint.ticket_id}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Status</span>
              <span className="status-badge" style={{backgroundColor: getStatusColor(complaint.status)}}>
                {complaint.status.toUpperCase()}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Title</span>
              <span className="detail-value">{complaint.title}</span>
            </div>
            <div className="detail-row">
  <span className="detail-label">Description</span>
  <span className="detail-value">{complaint.description}</span>
</div>

            <div className="detail-row">
              <span className="detail-label">Category</span>
              <span className="detail-value">{complaint.category}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Location</span>
              <span className="detail-value">{complaint.location}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Priority</span>
              <span className="detail-value">{complaint.priority.toUpperCase()}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Submitted</span>
              <span className="detail-value">
                {new Date(complaint.created_at).toLocaleDateString()}
              </span>
            </div>

            {complaint.department && (
              <div className="detail-row">
                <span className="detail-label">Department</span>
                <span className="detail-value">{complaint.department}</span>
              </div>
            )}

            {complaint.admin_reply && (
              <div className="admin-reply">
                <strong>Admin Reply:</strong>
                <p>{complaint.admin_reply}</p>
              </div>
            )}

{complaint.status === 'resolved' && !complaint.citizen_confirmed && complaint.citizen_confirmed !== false && (              <div style={{
                background: '#e8eaf6',
                padding: '15px',
                borderRadius: '10px',
                marginTop: '15px',
                textAlign: 'center'
              }}>
                <p style={{fontWeight: 'bold', color: '#1a237e', marginBottom: '10px'}}>
                  Is your complaint resolved?
                </p>
                <button
                  className="btn-primary"
                  style={{marginRight: '10px'}}
                  onClick={() => handleConfirmation(true)}>
                  ✅ Yes, Resolved
                </button>
                <button
                  className="btn-secondary"
                  style={{color: '#fffdfd'}}
                  onClick={() => handleConfirmation(false)}>
                  ❌ No, Reopen
                </button>
              </div>
            )}

            {complaint.citizen_confirmed === true && (
              <div style={{
                background: '#e1f5ee',
                padding: '10px',
                borderRadius: '8px',
                marginTop: '10px',
                textAlign: 'center',
                color: '#085041'
              }}>
                ✅ You have confirmed this complaint as resolved!
              </div>
            )}

            {complaint.citizen_confirmed === false && (
              <div style={{
                background: '#ffebee',
                padding: '10px',
                borderRadius: '8px',
                marginTop: '10px',
                textAlign: 'center',
                color: '#c62828'
              }}>
                ❌ Complaint reopened with High Priority!
              </div>
            )}
          </div>
        )}

        <p className="auth-link" style={{marginTop: '20px'}}>
          <a href="/">← Back to Home</a>
        </p>
      </div>
    </div>
  );
}

export default TrackComplaint;