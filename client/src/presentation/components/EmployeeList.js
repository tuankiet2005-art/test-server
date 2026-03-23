import React, { useState } from 'react';
import { formatDate } from '../../shared/utils';

const EmployeeList = ({ employees, onEdit, onDelete, onResetPassword }) => {
  if (employees.length === 0) {
    return <p>No employees found.</p>;
  }

  return (
    <div className="employee-list">
      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.username}</td>
              <td>{formatDate(employee.created_at)}</td>
              <td>
                <button onClick={() => onEdit(employee)}>Edit</button>
                <button onClick={() => onResetPassword(employee.id, employee.name)}>
                  Reset Password
                </button>
                <button
                  onClick={() => onDelete(employee.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;