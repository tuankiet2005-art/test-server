// Domain entities for the Leave Management System

export class User {
  constructor(id, username, role, salary) {
    this.id = id;
    this.username = username;
    this.role = role;
    this.salary = salary;
  }

  isManager() {
    return this.role === 'manager';
  }

  isEmployee() {
    return this.role === 'employee';
  }
}

export class LeaveRequest {
  constructor(id, userId, date, timePeriod, reason, status, createdAt, managerCreated = false) {
    this.id = id;
    this.userId = userId;
    this.date = date;
    this.timePeriod = timePeriod;
    this.reason = reason;
    this.status = status;
    this.createdAt = createdAt;
    this.managerCreated = managerCreated;
  }

  isPending() {
    return this.status === 'pending';
  }

  isApproved() {
    return this.status === 'approved';
  }

  isRejected() {
    return this.status === 'rejected';
  }

  canBeModifiedBy(user) {
    return user.isManager() || (user.id === this.userId && this.isPending());
  }
}

export class AdvanceRequest {
  constructor(id, userId, amount, reason, status, createdAt) {
    this.id = id;
    this.userId = userId;
    this.amount = amount;
    this.reason = reason;
    this.status = status;
    this.createdAt = createdAt;
  }

  isPending() {
    return this.status === 'pending';
  }

  isApproved() {
    return this.status === 'approved';
  }

  isRejected() {
    return this.status === 'rejected';
  }
}

export class SalaryInfo {
  constructor(month, baseSalary, totalAdvances, totalDeductions, netSalary) {
    this.month = month;
    this.baseSalary = baseSalary;
    this.totalAdvances = totalAdvances;
    this.totalDeductions = totalDeductions;
    this.netSalary = netSalary;
  }

  calculateNetSalary() {
    return this.baseSalary - this.totalAdvances - this.totalDeductions;
  }
}

// Value Objects
export class Money {
  constructor(amount, currency = 'VND') {
    this.amount = amount;
    this.currency = currency;
  }

  toString() {
    return `${this.amount.toLocaleString()} ${this.currency}`;
  }
}

export class DateRange {
  constructor(startDate, endDate) {
    this.startDate = startDate;
    this.endDate = endDate;
  }

  includes(date) {
    return date >= this.startDate && date <= this.endDate;
  }
}