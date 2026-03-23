class LeaveStatus {
  constructor(value) {
    if (!LeaveStatus.validStatuses.includes(value)) {
      throw new Error(`Invalid leave status: ${value}`);
    }
    this.value = value;
  }

  static get PENDING() { return 'pending'; }
  static get APPROVED() { return 'approved'; }
  static get REJECTED() { return 'rejected'; }

  static get validStatuses() {
    return [LeaveStatus.PENDING, LeaveStatus.APPROVED, LeaveStatus.REJECTED];
  }

  equals(other) {
    return other instanceof LeaveStatus && this.value === other.value;
  }

  toString() {
    return this.value;
  }
}

module.exports = LeaveStatus;