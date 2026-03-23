const Salary = require('../../domain/entities/Salary');

class SalaryRepository {
  constructor(database) {
    this.database = database;
  }

  async findById(id) {
    const result = await this.database.query('SELECT * FROM salaries WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    return this.mapRowToEntity(result.rows[0]);
  }

  async findByUserId(userId) {
    const result = await this.database.query('SELECT * FROM salaries WHERE user_id = $1 ORDER BY month DESC', [userId]);
    return result.rows.map(row => this.mapRowToEntity(row));
  }

  async findByUserAndMonth(userId, month) {
    const result = await this.database.query('SELECT * FROM salaries WHERE user_id = $1 AND month = $2', [userId, month]);
    if (result.rows.length === 0) return null;
    return this.mapRowToEntity(result.rows[0]);
  }

  async findAll() {
    const result = await this.database.query('SELECT * FROM salaries ORDER BY month DESC, user_id');
    return result.rows.map(row => this.mapRowToEntity(row));
  }

  async save(salary) {
    if (salary.id) {
      await this.database.query(
        'UPDATE salaries SET user_id = $1, month = $2, amount = $3 WHERE id = $4',
        [salary.userId, salary.month, salary.amount.toNumber(), salary.id]
      );
      return salary;
    } else {
      const result = await this.database.query(
        'INSERT INTO salaries (user_id, month, amount) VALUES ($1, $2, $3) RETURNING id',
        [salary.userId, salary.month, salary.amount.toNumber()]
      );
      salary.id = result.rows[0].id;
      return salary;
    }
  }

  async delete(id) {
    await this.database.query('DELETE FROM salaries WHERE id = $1', [id]);
  }

  mapRowToEntity(row) {
    return new Salary(row.id, row.user_id, row.month, row.amount);
  }
}

module.exports = SalaryRepository;