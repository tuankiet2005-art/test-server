import React, { useState, useEffect } from 'react';

const EmployeeForm = ({ employee, onSubmit, onCancel, loading, error }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: ''
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        username: employee.username,
        password: '', // Don't show existing password
        name: employee.name
      });
    } else {
      setFormData({
        username: '',
        password: '',
        name: ''
      });
    }
  }, [employee]);

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
      <h3>{employee ? 'Edit Employee' : 'Create New Employee'}</h3>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        {!employee && (
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="form-actions">
          <button type="button" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (employee ? 'Update' : 'Create')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;