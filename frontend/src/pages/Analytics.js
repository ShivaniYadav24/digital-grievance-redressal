import React, { useState, useEffect } from 'react';
import '../App.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

function Analytics() {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('name');

  useEffect(() => {
    if (!localStorage.getItem('token') ||
      (role !== 'junior_admin' && role !== 'senior_admin')) {
      navigate('/');
    } else {
      fetchComplaints();
    }
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/complaints/all');
      setComplaints(response.data);
    } catch (err) {
      console.error('Failed to fetch');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Category wise data
  const categoryData = () => {
    const counts = {};
    complaints.forEach(c => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, complaints: counts[key] }));
  };

  // Priority wise data
  const priorityData = [
    { name: 'High', value: complaints.filter(c => c.priority === 'high').length },
    { name: 'Medium', value: complaints.filter(c => c.priority === 'medium').length },
    { name: 'Low', value: complaints.filter(c => c.priority === 'low').length },
  ];

  // Status wise data
  const statusData = [
    { name: 'Open', value: complaints.filter(c => c.status === 'open').length },
    { name: 'In Progress', value: complaints.filter(c => c.status === 'in_progress').length },
    { name: 'Resolved', value: complaints.filter(c => c.status === 'resolved').length },
    { name: 'Rejected', value: complaints.filter(c => c.status === 'rejected').length },
  ];

  const PRIORITY_COLORS = ['#e53935', '#ff6f00', '#1a9e75'];
  const STATUS_COLORS = ['#e53935', '#ff6f00', '#1a9e75', '#555'];

  return (
    <div className="app">
      {/* Navbar */}
      <div className="navbar">
        <h2> Digital Grievance Redressal System</h2>
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          <span style={{color: 'white', fontSize: '14px'}}>
            👤 {name}
          </span>
          <button className="btn-login" onClick={() => navigate('/admin')}>
            Dashboard
          </button>
          <button className="btn-login" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div style={{padding: '30px'}}>
        <h2 style={{color: '#1a237e', marginBottom: '20px'}}>
          📊 Analytics Dashboard
        </h2>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card" style={{borderTop: '4px solid #1a237e'}}>
            <h3>{complaints.length}</h3>
            <p>Total Complaints</p>
          </div>
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
        </div>

        {/* Charts Row */}
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px'}}>

          {/* Category Bar Chart */}
          <div style={{background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <h3 style={{color: '#1a237e', marginBottom: '15px'}}>Complaints by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="complaints" fill="#1a237e" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Priority Pie Chart */}
          <div style={{background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <h3 style={{color: '#1a237e', marginBottom: '15px'}}>Complaints by Priority</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
  data={priorityData}
  cx="50%"
  cy="50%"
  outerRadius={70}
  dataKey="value"
  label={({name, value}) => value > 0 ? `${name}: ${value}` : ''}
  labelLine={false}
>
                  {priorityData.map((entry, index) => (
                    <Cell key={index} fill={PRIORITY_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Status Pie Chart */}
          <div style={{background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <h3 style={{color: '#1a237e', marginBottom: '15px'}}>Complaints by Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                 outerRadius={70}
  dataKey="value"
  label={({name, value}) => value > 0 ? `${name}: ${value}` : ''}
  labelLine={false}
>
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={STATUS_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Bar Chart 2 */}
          <div style={{background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <h3 style={{color: '#1a237e', marginBottom: '15px'}}>Status Overview</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#ff6f00" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Analytics;