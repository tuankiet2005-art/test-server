const User = require('./User');
const LeaveRequest = require('./LeaveRequest');
const SalaryAdvance = require('./SalaryAdvance');
const Salary = require('./Salary');
const Money = require('../value-objects/Money');
const LeaveStatus = require('../value-objects/LeaveStatus');

class Employee {
  constructor(user, leaveRequests = [], salaryAdvances = [], salaries = []) {
    this.user = user;
    this.leaveRequests = leaveRequests;
    this.salaryAdvances = salaryAdvances;
    this.salaries = salaries;
  }

  get id() {
    return this.user.id;
  }

  get username() {
    return this.user.username;
  }

  get role() {
    return this.user.role;
  }

  getCurrentSalary(month) {
    return this.salaries.find(s => s.month === month);
  }

  getApprovedLeaveRequests() {
    return this.leaveRequests.filter(lr => lr.status.value === LeaveStatus.APPROVED);
  }

  getApprovedSalaryAdvances() {
    return this.salaryAdvances.filter(sa => sa.status.value === LeaveStatus.APPROVED);
  }

  calculateNetSalary(month) {
    const salary = this.getCurrentSalary(month);
    if (!salary) return new Money(0);

    const baseSalary = salary.amount;
    const approvedLeaves = this.getApprovedLeaveRequests().filter(lr => {
      const leaveMonth = lr.date.toISOString().slice(0, 7); // YYYY-MM
      return leaveMonth === month;
    });

    const leaveDays = approvedLeaves.reduce((total, lr) => total + lr.getDaysDeducted(), 0);

    const dailyWage = baseSalary.divide(this.getDaysInMonth(month));
    const leaveDeduction = dailyWage.multiply(leaveDays);

    const approvedAdvances = this.getApprovedSalaryAdvances().filter(sa => {
      const advanceMonth = sa.createdAt.toISOString().slice(0, 7);
      return advanceMonth === month;
    });

    const advanceDeduction = approvedAdvances.reduce((total, sa) => total.add(sa.amount), new Money(0));

    return baseSalary.subtract(leaveDeduction).subtract(advanceDeduction);
  }

  getMaxAdvanceableAmount(month) {
    const salary = this.getCurrentSalary(month);
    if (!salary) return new Money(0);

    const dailyWage = salary.amount.divide(this.getDaysInMonth(month));
    return salary.amount.subtract(dailyWage.multiply(4)); // Max advance = salary - 4 days wage
  }

  getDaysInMonth(month) {
    const [year, mon] = month.split('-').map(Number);
    return new Date(year, mon, 0).getDate();
  }

  toJSON() {
    return {
      user: this.user.toJSON(),
      leaveRequests: this.leaveRequests.map(lr => lr.toJSON()),
      salaryAdvances: this.salaryAdvances.map(sa => sa.toJSON()),
      salaries: this.salaries.map(s => s.toJSON())
    };
  }
}

module.exports = Employee;