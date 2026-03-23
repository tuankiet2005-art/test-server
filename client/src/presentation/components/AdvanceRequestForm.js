import React, { useState } from 'react';

const AdvanceRequestForm = ({ onSubmit, onCancel, loading, error, maxAmount }) => {
  const [formData, setFormData] = useState({
    amount: '',
    reason: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    if (amount > maxAmount) {
      alert(`Amount cannot exceed ${maxAmount.toLocaleString()} VND`);
      return;
    }
    onSubmit({ amount, reason: formData.reason });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="form-container">
      <h3>Create Advance Request</h3>
      {error && <div className="error-message">{error}</div>}
      {maxAmount && (
        <p className="info-message">Maximum advanceable amount: {maxAmount.toLocaleString()} VND</p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Amount (VND):</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            min="0"
            max={maxAmount}
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
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdvanceRequestForm;