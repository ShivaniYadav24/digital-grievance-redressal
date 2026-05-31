import React, { useState, useEffect } from 'react';
import '../App.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [adminReply, setAdminReply] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const role = localStorage.getItem('role');
  const name = localStorage.getItem('name');

  // Admin check karo
  useEffect(() => {
    if (!localStorage.getItem('token') || 
        (role !== 'junior_admin' && role !== 'senior_admin')) {
      navigate('/');
    } else {
      fetchComplaints();
    }
  }, []);

  // Saari complaints fetch karo
  const fetchComplaints = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/complaints/all');
      setComplaints(response.data);
    } catch (err) {
      setError('Failed to fetch complaints');
    }
  };

  // Complaint update karo
  const handleUpdate = async (ticket_id) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/complaints/update/${ticket_id}`,
        {
          status: status || undefined,
          department: department || undefined,
          admin_reply: adminReply || undefined,
        }
      );
      alert('Complaint updated successfully!');
      setSelectedComplaint(null);
      fetchComplaints();
    } catch (err) {
      alert('Failed to update complaint');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
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

  return (
    <div className="app">

      {/* Navbar */}
      <div className="navbar">
        <h2> Digital Grievance Redressal System</h2>
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          <span style={{color: 'white', fontSize: '14px'}}>
            👤 {name}
          </span>
          <button className="btn-login" onClick={() => navigate('/analytics')}>
           📊 Analytics
           </button>
          <button className="btn-login" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Dashboard */}
      <div style={{padding: '30px'}}>
        <h2 style={{color: '#1a237e', marginBottom: '20px'}}>
          Admin Dashboard
        </h2>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card" style={{borderTop: '4px solid #1a237e'}}>
            <h3>{complaints.filter(c => c.status === 'open').length}</h3>
            <p>Open</p>
          </div>
          <div className="stat-card" style={{borderTop: '4px solid #e53935'}}>
            <h3>{complaints.filter(c => c.status === 'in_progress').length}</h3>
            <p>In Progress</p>
          </div>
          <div className="stat-card" style={{borderTop: '4px solid #ff6f00'}}>
            <h3>{complaints.filter(c => c.status === 'resolved').length}</h3>
            <p>Resolved</p>
          </div>
          <div className="stat-card" style={{borderTop: '4px solid #1a9e75'}}>
            <h3>{complaints.length}</h3>
            <p>Total</p>
          </div>
        </div>

        {error && <div className="error-msg">{error}</div>}

        {/* Complaints Table */}
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
                <th>Action</th>
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
                  <td>
                    <button
                      className="btn-primary"
                      style={{padding: '5px 12px', fontSize: '12px', margin: '0'}}
                      onClick={() => {
                        setSelectedComplaint(complaint);
                        setStatus(complaint.status);
                        setDepartment(complaint.department || '');
                        setAdminReply(complaint.admin_reply || '');
                      }}>
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      {/* Manage Complaint Modal */}
{selectedComplaint && (
  <div className="modal-overlay">
    <div className="modal-box">
      <h3 style={{color: '#1a237e'}}>
        Manage — {selectedComplaint.ticket_id}
      </h3>

      {/* Photo dikhao agar hai */}
      {selectedComplaint.photo_url && (
        <div className="form-group">
          <label>Submitted Photo:</label>
          <img 
            src={`http://127.0.0.1:8000/uploads/${selectedComplaint.photo_url.split('/').pop()}`}
            alt="Complaint"
            style={{
              width: '100%',
              borderRadius: '8px',
              marginTop: '8px',
              maxHeight: '200px',
              objectFit: 'cover'
            }}
          />
        </div>
      )}

              <div className="form-group">
                <label>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="form-group">
                <label>Assign Department</label>
                <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                  <option value="">Select Department</option>
                  <option value="PWD">PWD</option>
                  <option value="Electricity">Electricity Dept</option>
                  <option value="Water">Water Dept</option>
                  <option value="Sanitation">Sanitation Dept</option>
                </select>
              </div>

              <div className="form-group">
                <label>Reply to Citizen</label>
                <textarea
                  value={adminReply}
                  onChange={(e) => setAdminReply(e.target.value)}
                  placeholder="Write reply for citizen..."
                  rows={3}
                />
              </div>

              <div style={{display: 'flex', gap: '10px'}}>
                <button
                  className="btn-primary"
                  style={{color: '#1a237e', border: 'none'}}

                  onClick={() => handleUpdate(selectedComplaint.ticket_id)}>
                  Update
                </button>
                <button
                  className="btn-secondary"
                  style={{color: '#1a237e', border: 'none'}}
                  onClick={() => setSelectedComplaint(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;