import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/auth';
import { useLeaveRequests, useAdvanceRequests, useSalaryInfo } from '../../application/hooks';
import { getCurrentMonth } from '../../shared/utils';
import LeaveRequestForm from '../components/LeaveRequestForm';
import LeaveRequestList from '../components/LeaveRequestList';
import AdvanceRequestForm from '../components/AdvanceRequestForm';
import AdvanceRequestList from '../components/AdvanceRequestList';
import SalaryInfo from '../components/SalaryInfo';
import ChangePasswordForm from '../components/ChangePasswordForm';
import '../../components/Dashboard.css';

function EmployeeDashboard({ user, setUser }) {
  const navigate = useNavigate();
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [showAdvanceForm, setShowAdvanceForm] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const {
    leaveRequests,
    loading: leaveLoading,
    error: leaveError,
    createLeaveRequest
  } = useLeaveRequests();

  const {
    advanceRequests,
    loading: advanceLoading,
    error: advanceError,
    createAdvanceRequest
  } = useAdvanceRequests();

  const {
    salaryInfo,
    loading: salaryLoading,
    error: salaryError,
    fetchSalaryInfo
  } = useSalaryInfo();

  useEffect(() => {
    const currentMonth = getCurrentMonth();
    fetchSalaryInfo(currentMonth);
  }, [fetchSalaryInfo]);

  const handleCreateLeaveRequest = async (formData) => {
    try {
      await createLeaveRequest(formData.date, formData.timePeriod, formData.reason);
      setShowLeaveForm(false);
    } catch (error) {
      console.error('Failed to create leave request:', error);
    }
  };

  const handleCreateAdvanceRequest = async (formData) => {
    try {
      await createAdvanceRequest(formData.amount, formData.reason);
      setShowAdvanceForm(false);
    } catch (error) {
      console.error('Failed to create advance request:', error);
    }
  };

  const handleChangePassword = async (currentPassword, newPassword) => {
    try {
      // Use the changePassword from useAuth if available, or implement here
      // For now, we'll implement it directly
      const response = await fetch('/api/users/me/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      if (response.ok) {
        setPasswordSuccess('Password changed successfully!');
        setPasswordError('');
        setTimeout(() => setShowChangePassword(false), 2000);
      } else {
        const errorData = await response.json();
        setPasswordError(errorData.message || 'Failed to change password');
      }
    } catch (error) {
      setPasswordError('Network error occurred');
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  const calculateMaxAdvance = () => {
    if (!salaryInfo) return 0;
    const dailyWage = salaryInfo.baseSalary / 30; // Approximate
    return Math.max(0, salaryInfo.baseSalary - salaryInfo.totalAdvances - (4 * dailyWage));
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Employee Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user.username}</span>
          <button onClick={() => setShowChangePassword(true)}>Change Password</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <SalaryInfo
            salaryInfo={salaryInfo}
            loading={salaryLoading}
            error={salaryError}
          />
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Leave Requests</h2>
            <button
              onClick={() => setShowLeaveForm(true)}
              className="btn-primary"
            >
              New Leave Request
            </button>
          </div>
          <LeaveRequestList requests={leaveRequests} />
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Advance Requests</h2>
            <button
              onClick={() => setShowAdvanceForm(true)}
              className="btn-primary"
            >
              New Advance Request
            </button>
          </div>
          <AdvanceRequestList requests={advanceRequests} />
        </div>
      </div>

      {showLeaveForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <LeaveRequestForm
              onSubmit={handleCreateLeaveRequest}
              onCancel={() => setShowLeaveForm(false)}
              loading={leaveLoading}
              error={leaveError}
            />
          </div>
        </div>
      )}

      {showAdvanceForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <AdvanceRequestForm
              onSubmit={handleCreateAdvanceRequest}
              onCancel={() => setShowAdvanceForm(false)}
              loading={advanceLoading}
              error={advanceError}
              maxAmount={calculateMaxAdvance()}
            />
          </div>
        </div>
      )}

      {showChangePassword && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ChangePasswordForm
              onSubmit={handleChangePassword}
              onCancel={() => setShowChangePassword(false)}
              loading={false}
              error={passwordError}
              success={passwordSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeDashboard;