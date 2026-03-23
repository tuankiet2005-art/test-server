import React, { useState } from 'react';

const CreateAdvanceForEmployeeForm = ({ employees, onSubmit, onCancel, loading, error }) => {
  const [formData, setFormData] = useState({
    userId: '',
    amount: '',
    reason: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    onSubmit({ ...formData, amount });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="form-container">
      <h3>Create Advance Request for Employee</h3>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userId">Employee:</label>
          <select
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
          >
            <option value="">Select Employee</option>
            {employees.map(employee => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount (VND):</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            min="0"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="reason">Reason:</label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            rows="3"
          />
        </div>
        <div className="form-actions">
          <button type="button" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Advance Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAdvanceForEmployeeForm;