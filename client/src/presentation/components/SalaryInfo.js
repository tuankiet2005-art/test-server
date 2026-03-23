import React from 'react';
import { formatCurrency } from '../../../shared/utils';

const SalaryInfo = ({ salaryInfo, loading, error }) => {
  if (loading) {
    return <div className="salary-info loading">Loading salary information...</div>;
  }

  if (error) {
    return <div className="salary-info error">{error}</div>;
  }

  if (!salaryInfo) {
    return <div className="salary-info">No salary information available.</div>;
  }

  return (
    <div className="salary-info">
      <h3>Salary Information - {salaryInfo.month}</h3>
      <div className="salary-details">
        <div className="salary-row">
          <span>Base Salary:</span>
          <span>{formatCurrency(salaryInfo.baseSalary)}</span>
        </div>
        <div className="salary-row">
          <span>Total Advances:</span>
          <span className="deduction">-{formatCurrency(salaryInfo.totalAdvances)}</span>
        </div>
        <div className="salary-row">
          <span>Leave Deductions:</span>
          <span className="deduction">-{formatCurrency(salaryInfo.totalDeductions)}</span>
        </div>
        <div className="salary-row total">
          <span>Net Salary:</span>
          <span>{formatCurrency(salaryInfo.netSalary)}</span>
        </div>
      </div>
    </div>
  );
};

export default SalaryInfo;