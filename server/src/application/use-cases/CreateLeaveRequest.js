const LeaveRequest = require('../../domain/entities/LeaveRequest');
const LeaveStatus = require('../../domain/value-objects/LeaveStatus');

class CreateLeaveRequest {
  constructor(leaveRequestRepository) {
    this.leaveRequestRepository = leaveRequestRepository;
  }

  async execute(userId, date, timePeriod, reason, createdByManager = false) {
    const leaveRequest = new LeaveRequest(
      null, // id will be set by repository
      userId,
      date,
      timePeriod,
      reason,
      LeaveStatus.PENDING,
      createdByManager
    );

    return await this.leaveRequestRepository.save(leaveRequest);
  }
}

module.exports = CreateLeaveRequest;