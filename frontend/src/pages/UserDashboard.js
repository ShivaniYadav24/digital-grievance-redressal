import React, { useState, useEffect } from 'react';
import '../App.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const name = localStorage.getItem('name');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchMyComplaints();
    }
  }, []);

  const fetchMyComplaints = async () => {
    try {
      const response = await axios.get(
        'http://127.0.0.1:8000/api/complaints/my-complaints',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setComplaints(response.data);
    } catch (err) {
      setError('Failed to fetch complaints');
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

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#e53935',
      medium: '#ff6f00',
      low: '#1a9e75'
    };
    return colors[priority] || '#555';
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="app">
      {/* Navbar */}
      <div className="navbar">
        <h2>Digital Grievance Redressal System</h2>
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          <span style={{color: 'white', fontSize: '14px'}}>
            👤 {name}
          </span>
          <button className="btn-login" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={{padding: '30px'}}>
        <h2 style={{color: '#1a237e', marginBottom: '20px'}}>
          My Complaints
        </h2>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card" style={{borderTop: '4px solid #e53935'}}>
            <h3>{complaints.filter(c => c.status === 'open').length}</h3>
            <p>Open</p>
          </div>
          <div className="stat-card" style={{borderTop: '4px solid #ff6f00'}}>
            <h3>{complaints.filter(c => c.status === 'in_progress').length}</h3>
            <p>In Progress</p>
          </div>
          <div className="stat-card" style={{borderTop: '4px solid #1a9e75'}}>
            <h3>{complaints.filter(c => c.status === 'resolved').length}</h3>
            <p>Resolved</p>
          </div>
          <div className="stat-card" style={{borderTop: '4px solid #1a237e'}}>
            <h3>{complaints.length}</h3>
            <p>Total</p>
          </div>
        </div>

        {error && <div className="error-msg">{error}</div>}

        {complaints.length === 0 ? (
          <div style={{textAlign: 'center', padding: '50px', color: '#777'}}>
            <h3>No complaints yet!</h3>
            <button
              className="btn-primary"
              onClick={() => navigate('/submit')}>
              Submit Complaint
            </button>
          </div>
        ) : (
          <div className="complaints-table">
            <table>
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Admin Reply</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint.id}>
                    <td style={{color: '#081497', fontWeight: 'bold'}}>
                      {complaint.ticket_id}
                    </td>
                    <td>{complaint.title}</td>
                    <td>{complaint.category}</td>
                    <td>{complaint.location}</td>
                    <td>
                      <span className="status-badge"
                        style={{backgroundColor: getPriorityColor(complaint.priority)}}>
                        {complaint.priority.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className="status-badge"
                        style={{backgroundColor: getStatusColor(complaint.status)}}>
                        {complaint.status.toUpperCase()}
                      </span>
                    </td>
                    <td>{new Date(complaint.created_at).toLocaleDateString()}</td>
                    <td style={{fontSize: '12px', color: '#555'}}>
                      {complaint.admin_reply || 'Pending...'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{marginTop: '20px'}}>
          <button
            className="btn-primary"
            onClick={() => navigate('/submit')}>
            + Submit New Complaint
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
