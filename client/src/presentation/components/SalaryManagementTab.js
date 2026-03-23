import React, { useState, useEffect } from 'react';
import PayrollTable from './PayrollTable';

const SalaryManagementTab = ({ employees, onRefreshPayroll }) => {
  const [payrollData, setPayrollData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [loading, setLoading] = useState(false);

  const fetchPayrollData = async (month) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/payroll/${month}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPayrollData(data);
      } else {
        setPayrollData([]);
      }
    } catch (err) {
      console.error('Error fetching payroll data:', err);
      setPayrollData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrollData(selectedMonth);
  }, [selectedMonth]);

  const handleSetSalary = async (userId, month, salary) => {
    try {
      const response = await fetch(`/api/users/${userId}/salary`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ month, salary })
      });

      if (response.ok) {
        fetchPayrollData(month);
        onRefreshPayroll && onRefreshPayroll();
      } else {
        alert('Failed to set salary');
      }
    } catch (err) {
      alert('Network error occurred');
    }
  };

  return (
    <div className="salary-management-tab">
      <div className="tab-header">
        <h2>Salary & Payroll Management</h2>
      </div>

      {loading ? (
        <p>Loading payroll data...</p>
      ) : (
        <PayrollTable
          payrollData={payrollData}
          employees={employees}
          onSetSalary={handleSetSalary}
        />
      )}
    </div>
  );
};

export default SalaryManagementTab;