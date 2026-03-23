import React, { useState } from 'react';
import EmployeeList from './EmployeeList';
import EmployeeForm from './EmployeeForm';

const EmployeeManagementTab = ({ employees, onRefreshEmployees }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateEmployee = async (formData) => {
    setLoading(true);
    setError('');
    try {
      // Use the create user use case
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowForm(false);
        onRefreshEmployees();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create employee');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmployee = async (formData) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/users/${editingEmployee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setEditingEmployee(null);
        onRefreshEmployees();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update employee');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await fetch(`/api/users/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          onRefreshEmployees();
        } else {
          alert('Failed to delete employee');
        }
      } catch (err) {
        alert('Network error occurred');
      }
    }
  };

  const handleResetPassword = async (id, name) => {
    const newPassword = window.prompt(`Reset password for ${name}:\n(Leave blank for default password)`);
    if (newPassword === null) return;

    try {
      const response = await fetch(`/api/users/${id}/reset-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ newPassword: newPassword || undefined })
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Password reset successful!\nNew password: ${data.defaultPassword || newPassword}`);
      } else {
        alert('Failed to reset password');
      }
    } catch (err) {
      alert('Network error occurred');
    }
  };

  return (
    <div className="employee-management-tab">
      <div className="tab-header">
        <h2>Employee Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          Add New Employee
        </button>
      </div>

      <EmployeeList
        employees={employees}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onResetPassword={handleResetPassword}
      />

      {(showForm || editingEmployee) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <EmployeeForm
              employee={editingEmployee}
              onSubmit={editingEmployee ? handleUpdateEmployee : handleCreateEmployee}
              onCancel={() => {
                setShowForm(false);
                setEditingEmployee(null);
                setError('');
              }}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagementTab;