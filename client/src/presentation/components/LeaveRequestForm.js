import React, { useState } from 'react';
import { TIME_PERIOD_OPTIONS } from '../../shared/utils';

const LeaveRequestForm = ({ onSubmit, onCancel, loading, error }) => {
  const [formData, setFormData] = useState({
    date: '',
    timePeriod: TIME_PERIOD_OPTIONS.ALL_DAY,
    reason: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="form-container">
      <h3>Create Leave Request</h3>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="timePeriod">Time Period:</label>
          <select
            id="timePeriod"
            name="timePeriod"
            value={formData.timePeriod}
            onChange={handleChange}
          >
            <option value={TIME_PERIOD_OPTIONS.ALL_DAY}>All Day</option>
            <option value={TIME_PERIOD_OPTIONS.MORNING}>Morning</option>
            <option value={TIME_PERIOD_OPTIONS.AFTERNOON}>Afternoon</option>
          </select>
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

export default LeaveRequestForm;