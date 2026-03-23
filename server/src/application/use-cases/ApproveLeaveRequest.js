class ApproveLeaveRequest {
  constructor(leaveRequestRepository) {
    this.leaveRequestRepository = leaveRequestRepository;
  }

  async execute(requestId, managerId) {
    const leaveRequest = await this.leaveRequestRepository.findById(requestId);
    if (!leaveRequest) {
      throw new Error('Leave request not found');
    }

    leaveRequest.approve(managerId);
    return await this.leaveRequestRepository.save(leaveRequest);
  }
}

module.exports = ApproveLeaveRequest;