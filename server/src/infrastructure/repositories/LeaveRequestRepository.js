const LeaveRequest = require('../../domain/entities/LeaveRequest');

class LeaveRequestRepository {
  constructor(database) {
    this.database = database;
  }

  async findById(id) {
    const result = await this.database.query('SELECT * FROM leave_requests WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    return this.mapRowToEntity(result.rows[0]);
  }

  async findByUserId(userId) {
    const result = await this.database.query('SELECT * FROM leave_requests WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return result.rows.map(row => this.mapRowToEntity(row));
  }

  async findAll() {
    const result = await this.database.query('SELECT * FROM leave_requests ORDER BY created_at DESC');
    return result.rows.map(row => this.mapRowToEntity(row));
  }

  async save(leaveRequest) {
    if (leaveRequest.id) {
      // Update
      await this.database.query(
        `UPDATE leave_requests SET user_id = $1, date = $2, time_period = $3, reason = $4,
         status = $5, created_by_manager = $6, approved_at = $7, approved_by = $8 WHERE id = $9`,
        [leaveRequest.userId, leaveRequest.date, leaveRequest.timePeriod.value, leaveRequest.reason,
         leaveRequest.status.value, leaveRequest.createdByManager, leaveRequest.approvedAt, leaveRequest.approvedBy, leaveRequest.id]
      );
      return leaveRequest;
    } else {
      // Insert
      const result = await this.database.query(
        `INSERT INTO leave_requests (user_id, date, time_period, reason, status, created_by_manager)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at`,
        [leaveRequest.userId, leaveRequest.date, leaveRequest.timePeriod.value, leaveRequest.reason,
         leaveRequest.status.value, leaveRequest.createdByManager]
      );
      leaveRequest.id = result.rows[0].id;
      leaveRequest.createdAt = result.rows[0].created_at;
      return leaveRequest;
    }
  }

  async delete(id) {
    await this.database.query('DELETE FROM leave_requests WHERE id = $1', [id]);
  }

  mapRowToEntity(row) {
    return new LeaveRequest(
      row.id,
      row.user_id,
      row.date,
      row.time_period,
      row.reason,
      row.status,
      row.created_by_manager,
      row.created_at,
      row.approved_at,
      row.approved_by
    );
  }
}

module.exports = LeaveRequestRepository;