import React, { useState } from 'react';
import AdvanceRequestTable from './AdvanceRequestTable';
import CreateAdvanceForEmployeeForm from './CreateAdvanceForEmployeeForm';

const AdvanceManagementTab = ({ advanceRequests, employees, onRefreshAdvanceRequests }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApprove = async (id, amount) => {
    try {
      const response = await fetch(`/api/advance-requests/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'approved', amount })
      });

      if (response.ok) {
        onRefreshAdvanceRequests();
      } else {
        alert('Failed to approve advance request');
      }
    } catch (err) {
      alert('Network error occurred');
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(`/api/advance-requests/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'rejected' })
      });

      if (response.ok) {
        onRefreshAdvanceRequests();
      } else {
        alert('Failed to reject advance request');
      }
    } catch (err) {
      alert('Network error occurred');
    }
  };

  const handleEditAmount = (request) => {
    const newAmount = prompt('Enter new amount:', request.amount);
    if (newAmount && !isNaN(newAmount)) {
      handleApprove(request.id, parseFloat(newAmount));
    }
  };

  const handleCreateForEmployee = async (formData) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/advance-requests/manager', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowCreateForm(false);
        onRefreshAdvanceRequests();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create advance request');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="advance-management-tab">
      <div className="tab-header">
        <h2>Advance Request Management</h2>
      </div>

      <AdvanceRequestTable
        requests={advanceRequests}
        employees={employees}
        onApprove={handleApprove}
        onReject={handleReject}
        onEditAmount={handleEditAmount}
        onCreateForEmployee={() => setShowCreateForm(true)}
      />

      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <CreateAdvanceForEmployeeForm
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

export default AdvanceManagementTab;