import React, { useState } from 'react';
import { formatDate, formatCurrency } from '../../shared/utils';

const AdvanceRequestTable = ({ requests, employees, onApprove, onReject, onCreateForEmployee, onEditAmount }) => {
  const [filters, setFilters] = useState({
    employeeId: ''
  });

  const filteredRequests = requests.filter(request => {
    return !filters.employeeId || request.userId === parseInt(filters.employeeId);
  });

  const getEmployeeName = (userId) => {
    const employee = employees.find(e => e.id === userId);
    return employee ? employee.name : 'Unknown';
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="advance-management">
      <div className="filters">
        <select
          name="employeeId"
          value={filters.employeeId}
          onChange={handleFilterChange}
        >
          <option value="">All Employees</option>
          {employees.map(employee => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>

      <div className="actions">
        <button onClick={onCreateForEmployee} className="btn-primary">
          Create Advance Request for Employee
        </button>
      </div>

      <table className="advance-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Amount</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map(request => (
            <tr key={request.id}>
              <td>{getEmployeeName(request.userId)}</td>
              <td>{formatCurrency(request.amount)}</td>
              <td>{request.reason}</td>
              <td>
                <span className={`status ${request.status}`}>
                  {request.status}
                </span>
              </td>
              <td>{formatDate(request.createdAt)}</td>
              <td>
                {request.status === 'pending' && (
                  <>
                    <button
                      onClick={() => onApprove(request.id, request.amount)}
                      className="approve-btn"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onEditAmount(request)}
                      className="edit-btn"
                    >
                      Edit Amount
                    </button>
                    <button
                      onClick={() => onReject(request.id)}
                      className="reject-btn"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdvanceRequestTable;