import React, { useState } from 'react';
import { formatDate } from '../../shared/utils';

const LeaveRequestTable = ({ requests, employees, onApprove, onReject, onCreateForEmployee }) => {
  const [filters, setFilters] = useState({
    employeeId: '',
    status: '',
    month: ''
  });

  const filteredRequests = requests.filter(request => {
    const matchesEmployee = !filters.employeeId || request.userId === parseInt(filters.employeeId);
    const matchesStatus = !filters.status || request.status === filters.status;
    const matchesMonth = !filters.month || request.date.startsWith(filters.month);
    return matchesEmployee && matchesStatus && matchesMonth;
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
    <div className="leave-management">
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
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <input
          type="month"
          name="month"
          value={filters.month}
          onChange={handleFilterChange}
        />
      </div>

      <div className="actions">
        <button onClick={onCreateForEmployee} className="btn-primary">
          Create Leave Request for Employee
        </button>
      </div>

      <table className="leave-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Date</th>
            <th>Time Period</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map(request => (
            <tr key={request.id}>
              <td>{getEmployeeName(request.userId)}</td>
              <td>{formatDate(request.date)}</td>
              <td>{request.timePeriod}</td>
              <td>{request.reason}</td>
              <td>
                <span className={`status ${request.status}`}>
                  {request.status}
                </span>
              </td>
              <td>
                {request.status === 'pending' && (
                  <>
                    <button
                      onClick={() => onApprove(request.id)}
                      className="approve-btn"
                    >
                      Approve
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

export default LeaveRequestTable;