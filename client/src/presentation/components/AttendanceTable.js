import React, { useState } from 'react';
import { formatDate } from '../../shared/utils';

const AttendanceTable = ({ leaveRequests, employees, selectedDate, onDateChange }) => {
  const [viewMode, setViewMode] = useState('daily'); // daily or monthly

  const getEmployeeAttendance = (employeeId, date) => {
    const employeeLeaves = leaveRequests.filter(req =>
      req.userId === employeeId &&
      req.status === 'approved' &&
      req.date === date
    );

    if (employeeLeaves.length === 0) return 'Present';

    const leave = employeeLeaves[0];
    return `Leave (${leave.timePeriod})`;
  };

  const getMonthlyAttendance = (employeeId, month) => {
    const monthLeaves = leaveRequests.filter(req =>
      req.userId === employeeId &&
      req.status === 'approved' &&
      req.date.startsWith(month)
    );

    const totalLeaveDays = monthLeaves.reduce((total, leave) => {
      switch (leave.timePeriod) {
        case 'all day': return total + 1;
        case 'morning':
        case 'afternoon': return total + 0.5;
        default: return total;
      }
    }, 0);

    return {
      leaveDays: totalLeaveDays,
      leaveRequests: monthLeaves.length
    };
  };

  const getEmployeeName = (userId) => {
    const employee = employees.find(e => e.id === userId);
    return employee ? employee.name : 'Unknown';
  };

  return (
    <div className="attendance-management">
      <div className="view-controls">
        <button
          onClick={() => setViewMode('daily')}
          className={viewMode === 'daily' ? 'active' : ''}
        >
          Daily Attendance
        </button>
        <button
          onClick={() => setViewMode('monthly')}
          className={viewMode === 'monthly' ? 'active' : ''}
        >
          Monthly Summary
        </button>
      </div>

      {viewMode === 'daily' ? (
        <div className="daily-attendance">
          <div className="date-selector">
            <label>Select Date: </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
            />
          </div>

          <table className="attendance-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(employee => (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>{getEmployeeAttendance(employee.id, selectedDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="monthly-attendance">
          <div className="month-selector">
            <label>Select Month: </label>
            <input
              type="month"
              value={selectedDate.slice(0, 7)}
              onChange={(e) => onDateChange(e.target.value + '-01')}
            />
          </div>

          <table className="attendance-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Days</th>
                <th>Leave Requests</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(employee => {
                const attendance = getMonthlyAttendance(employee.id, selectedDate.slice(0, 7));
                return (
                  <tr key={employee.id}>
                    <td>{employee.name}</td>
                    <td>{attendance.leaveDays}</td>
                    <td>{attendance.leaveRequests}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceTable;