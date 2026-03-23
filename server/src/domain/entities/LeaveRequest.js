const LeaveStatus = require('../value-objects/LeaveStatus');
const TimePeriod = require('../value-objects/TimePeriod');

class LeaveRequest {
  constructor(id, userId, date, timePeriod, reason, status, createdByManager = false, createdAt = new Date(), approvedAt = null, approvedBy = null) {
    this.id = id;
    this.userId = userId;
    this.date = new Date(date);
    this.timePeriod = new TimePeriod(timePeriod);
    this.reason = reason;
    this.status = new LeaveStatus(status);
    this.createdByManager = createdByManager;
    this.createdAt = createdAt;
    this.approvedAt = approvedAt;
    this.approvedBy = approvedBy;
  }

  canBeModifiedBy(userId) {
    // Only creator can modify if not manager-created
    return !this.createdByManager && this.userId === userId && this.status.value === LeaveStatus.PENDING;
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

  getDaysDeducted() {
    return this.timePeriod.getDaysDeducted();
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      date: this.date.toISOString().split('T')[0],
      timePeriod: this.timePeriod.toString(),
      reason: this.reason,
      status: this.status.toString(),
      createdByManager: this.createdByManager,
      createdAt: this.createdAt,
      approvedAt: this.approvedAt,
      approvedBy: this.approvedBy
    };
  }
}

module.exports = LeaveRequest;