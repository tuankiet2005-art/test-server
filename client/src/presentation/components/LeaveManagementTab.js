import React, { useState } from 'react';
import LeaveRequestTable from './LeaveRequestTable';
import CreateLeaveForEmployeeForm from './CreateLeaveForEmployeeForm';

const LeaveManagementTab = ({ leaveRequests, employees, onRefreshLeaveRequests }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`/api/leave-requests/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'approved' })
      });

      if (response.ok) {
        onRefreshLeaveRequests();
      } else {
        alert('Failed to approve leave request');
      }
    } catch (err) {
      alert('Network error occurred');
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(`/api/leave-requests/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'rejected' })
      });

      if (response.ok) {
        onRefreshLeaveRequests();
      } else {
        alert('Failed to reject leave request');
      }
    } catch (err) {
      alert('Network error occurred');
    }
  };

  const handleCreateForEmployee = async (formData) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/leave-requests/manager', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowCreateForm(false);
        onRefreshLeaveRequests();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create leave request');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="leave-management-tab">
      <div className="tab-header">
        <h2>Leave Request Management</h2>
      </div>

      <LeaveRequestTable
        requests={leaveRequests}
        employees={employees}
        onApprove={handleApprove}
        onReject={handleReject}
        onCreateForEmployee={() => setShowCreateForm(true)}
      />

      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <CreateLeaveForEmployeeForm
              employees={employees}
              onSubmit={handleCreateForEmployee}
              onCancel={() => setShowCreateForm(false)}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagementTab;