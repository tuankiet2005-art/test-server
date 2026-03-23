const LeaveStatus = require('../value-objects/LeaveStatus');
const Money = require('../value-objects/Money');

class SalaryAdvance {
  constructor(id, userId, amount, reason, status, createdAt = new Date(), approvedAt = null, approvedBy = null) {
    this.id = id;
    this.userId = userId;
    this.amount = new Money(amount);
    this.reason = reason;
    this.status = new LeaveStatus(status);
    this.createdAt = createdAt;
    this.approvedAt = approvedAt;
    this.approvedBy = approvedBy;
  }

  canBeModifiedBy(userId) {
    return this.userId === userId && this.status.value === LeaveStatus.PENDING;
  }

  approve(managerId) {
    if (this.status.value !== LeaveStatus.PENDING) {
      throw new Error('Can only approve pending requests');
    }
    this.status = new LeaveStatus(LeaveStatus.APPROVED);
    this.approvedAt = new Date();
    this.approvedBy = managerId;
  }

  reject(managerId) {
    if (this.status.value !== LeaveStatus.PENDING) {
      throw new Error('Can only reject pending requests');
    }
    this.status = new LeaveStatus(LeaveStatus.REJECTED);
    this.approvedAt = new Date();
    this.approvedBy = managerId;
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      amount: this.amount.toNumber(),
      reason: this.reason,
      status: this.status.toString(),
      createdAt: this.createdAt,
      approvedAt: this.approvedAt,
      approvedBy: this.approvedBy
    };
  }
}

module.exports = SalaryAdvance;