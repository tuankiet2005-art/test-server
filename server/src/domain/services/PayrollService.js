const Employee = require('../aggregates/Employee');

class PayrollService {
  static calculatePayroll(employees, month) {
    return employees.map(employee => ({
      employeeId: employee.id,
      username: employee.username,
      baseSalary: employee.getCurrentSalary(month)?.amount.toNumber() || 0,
      leaveDeductions: this.calculateLeaveDeductions(employee, month),
      advanceDeductions: this.calculateAdvanceDeductions(employee, month),
      netSalary: employee.calculateNetSalary(month).toNumber()
    }));
  }

  static calculateLeaveDeductions(employee, month) {
    const approvedLeaves = employee.getApprovedLeaveRequests().filter(lr => {
      const leaveMonth = lr.date.toISOString().slice(0, 7);
      return leaveMonth === month;
    });

    return approvedLeaves.reduce((total, lr) => total + lr.getDaysDeducted(), 0);
  }

  static calculateAdvanceDeductions(employee, month) {
    const approvedAdvances = employee.getApprovedSalaryAdvances().filter(sa => {
      const advanceMonth = sa.createdAt.toISOString().slice(0, 7);
      return advanceMonth === month;
    });

    return approvedAdvances.reduce((total, sa) => total + sa.amount.toNumber(), 0);
  }
}

module.exports = PayrollService;