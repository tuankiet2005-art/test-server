class LeaveRequestController {
  constructor(createLeaveRequestUseCase, getLeaveRequestsForUserUseCase, approveLeaveRequestUseCase) {
    this.createLeaveRequestUseCase = createLeaveRequestUseCase;
    this.getLeaveRequestsForUserUseCase = getLeaveRequestsForUserUseCase;
    this.approveLeaveRequestUseCase = approveLeaveRequestUseCase;
  }

  async create(req, res) {
    try {
      const { date, timePeriod, reason } = req.body;
      const createdByManager = req.user.role === 'manager';
      const leaveRequest = await this.createLeaveRequestUseCase.execute(
        req.user.id, date, timePeriod, reason, createdByManager
      );
      res.status(201).json(leaveRequest);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getForUser(req, res) {
    try {
      const leaveRequests = await this.getLeaveRequestsForUserUseCase.execute(req.user.id);
      res.json(leaveRequests);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async approve(req, res) {
    try {
      const { id } = req.params;
      const leaveRequest = await this.approveLeaveRequestUseCase.execute(id, req.user.id);
      res.json(leaveRequest);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = LeaveRequestController;