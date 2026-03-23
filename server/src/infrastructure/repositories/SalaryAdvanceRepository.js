const SalaryAdvance = require('../../domain/entities/SalaryAdvance');

class SalaryAdvanceRepository {
  constructor(database) {
    this.database = database;
  }

  async findById(id) {
    const result = await this.database.query('SELECT * FROM advance_requests WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    return this.mapRowToEntity(result.rows[0]);
  }

  async findByUserId(userId) {
    const result = await this.database.query('SELECT * FROM advance_requests WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return result.rows.map(row => this.mapRowToEntity(row));
  }

  async findAll() {
    const result = await this.database.query('SELECT * FROM advance_requests ORDER BY created_at DESC');
    return result.rows.map(row => this.mapRowToEntity(row));
  }

  async save(salaryAdvance) {
    if (salaryAdvance.id) {
      await this.database.query(
        `UPDATE advance_requests SET user_id = $1, amount = $2, reason = $3, status = $4,
         approved_at = $5, approved_by = $6 WHERE id = $7`,
        [salaryAdvance.userId, salaryAdvance.amount.toNumber(), salaryAdvance.reason,
         salaryAdvance.status.value, salaryAdvance.approvedAt, salaryAdvance.approvedBy, salaryAdvance.id]
      );
      return salaryAdvance;
    } else {
      const result = await this.database.query(
        `INSERT INTO advance_requests (user_id, amount, reason, status) VALUES ($1, $2, $3, $4) RETURNING id, created_at`,
        [salaryAdvance.userId, salaryAdvance.amount.toNumber(), salaryAdvance.reason, salaryAdvance.status.value]
      );
      salaryAdvance.id = result.rows[0].id;
      salaryAdvance.createdAt = result.rows[0].created_at;
      return salaryAdvance;
    }
  }

  async delete(id) {
    await this.database.query('DELETE FROM advance_requests WHERE id = $1', [id]);
  }

  mapRowToEntity(row) {
    return new SalaryAdvance(
      row.id,
      row.user_id,
      row.amount,
      row.reason,
      row.status,
      row.created_at,
      row.approved_at,
      row.approved_by
    );
  }
}

module.exports = SalaryAdvanceRepository;