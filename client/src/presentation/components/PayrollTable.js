import React, { useState } from 'react';
import { formatCurrency } from '../../../shared/utils';

const PayrollTable = ({ payrollData, employees, onSetSalary }) => {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const getEmployeeName = (userId) => {
    const employee = employees.find(e => e.id === userId);
    return employee ? employee.name : 'Unknown';
  };

  const handleSetSalary = (userId) => {
    const salary = prompt('Enter monthly salary:');
    if (salary && !isNaN(salary)) {
      onSetSalary(userId, selectedMonth, parseFloat(salary));
    }
  };

  return (
    <div className="payroll-management">
      <div className="month-selector">
        <label>Select Month: </label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>

      <table className="payroll-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Base Salary</th>
            <th>Total Advances</th>
            <th>Leave Deductions</th>
            <th>Net Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payrollData.map(employee => (
            <tr key={employee.id}>
              <td>{getEmployeeName(employee.id)}</td>
              <td>{formatCurrency(employee.baseSalary || 0)}</td>
              <td className="deduction">
                -{formatCurrency(employee.totalAdvances || 0)}
              </td>
              <td className="deduction">
                -{formatCurrency(employee.totalDeductions || 0)}
              </td>
              <td className="net-salary">
                {formatCurrency(employee.netSalary || 0)}
              </td>
              <td>
                <button
                  onClick={() => handleSetSalary(employee.id)}
                  className="btn-secondary"
                >
                  Set Salary
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {payrollData.length === 0 && (
        <p>No payroll data available for the selected month.</p>
      )}
    </div>
  );
};

export default PayrollTable;