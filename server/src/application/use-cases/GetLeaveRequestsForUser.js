class GetLeaveRequestsForUser {
  constructor(leaveRequestRepository) {
    this.leaveRequestRepository = leaveRequestRepository;
  }

  async execute(userId) {
    return await this.leaveRequestRepository.findByUserId(userId);
  }
}

module.exports = GetLeaveRequestsForUser;