import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/auth';
import EmployeeManagementTab from '../components/EmployeeManagementTab';
import LeaveManagementTab from '../components/LeaveManagementTab';
import AdvanceManagementTab from '../components/AdvanceManagementTab';
import SalaryManagementTab from '../components/SalaryManagementTab';
import AttendanceTab from '../components/AttendanceTab';
import '../../components/Dashboard.css';

function ManagerDashboard({ user, setUser }) {
  const [activeTab, setActiveTab] = useState('employees');
  const [employees, setEmployees] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [advanceRequests, setAdvanceRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === 'employees' || activeTab === 'leave-requests' ||
        activeTab === 'advance-salary' || activeTab === 'salary' ||
        activeTab === 'attendance') {
      fetchEmployees();
    }

    if (activeTab === 'leave-requests' || activeTab === 'attendance') {
      fetchLeaveRequests();
    }

    if (activeTab === 'advance-salary') {
      fetchAdvanceRequests();
    }
  }, [activeTab]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setEmployees(data.filter(u => u.role === 'employee'));
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      const response = await fetch('/api/leave-requests', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setLeaveRequests(data);
      }
    } catch (err) {
      console.error('Error fetching leave requests:', err);
    }
  };

  const fetchAdvanceRequests = async () => {
    try {
      const response = await fetch('/api/advance-requests', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAdvanceRequests(data || []);
      }
    } catch (err) {
      console.error('Error fetching advance requests:', err);
      setAdvanceRequests([]);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'employees':
        return (
          <EmployeeManagementTab
            employees={employees}
            onRefreshEmployees={fetchEmployees}
          />
        );
      case 'leave-requests':
        return (
          <LeaveManagementTab
            leaveRequests={leaveRequests}
            employees={employees}
            onRefreshLeaveRequests={fetchLeaveRequests}
          />
        );
      case 'advance-salary':
        return (
          <AdvanceManagementTab
            advanceRequests={advanceRequests}
            employees={employees}
            onRefreshAdvanceRequests={fetchAdvanceRequests}
          />
        );
      case 'salary':
        return (
          <SalaryManagementTab
            employees={employees}
            onRefreshPayroll={fetchEmployees}
          />
        );
      case 'attendance':
        return (
          <AttendanceTab
            leaveRequests={leaveRequests}
            employees={employees}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Manager Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user.username}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'employees' ? 'active' : ''}`}
            onClick={() => setActiveTab('employees')}
          >
            Employees
          </button>
          <button
            className={`tab ${activeTab === 'leave-requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('leave-requests')}
          >
            Leave Requests
          </button>
          <button
            className={`tab ${activeTab === 'advance-salary' ? 'active' : ''}`}
            onClick={() => setActiveTab('advance-salary')}
          >
            Advance Requests
          </button>
          <button
            className={`tab ${activeTab === 'salary' ? 'active' : ''}`}
            onClick={() => setActiveTab('salary')}
          >
            Salary & Payroll
          </button>
          <button
            className={`tab ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance
          </button>
        </div>

        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;