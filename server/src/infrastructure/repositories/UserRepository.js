const User = require('../../domain/entities/User');

class UserRepository {
  constructor(database) {
    this.database = database;
  }

  async findById(id) {
    const result = await this.database.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return new User(row.id, row.username, row.password_hash, row.role, row.created_at);
  }

  async findByUsername(username) {
    const result = await this.database.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return new User(row.id, row.username, row.password_hash, row.role, row.created_at);
  }

  async findAll() {
    const result = await this.database.query('SELECT * FROM users ORDER BY created_at DESC');
    return result.rows.map(row =>
      new User(row.id, row.username, row.password_hash, row.role, row.created_at)
    );
  }

  async save(user) {
    if (user.id) {
      // Update
      await this.database.query(
        'UPDATE users SET username = $1, password_hash = $2, role = $3 WHERE id = $4',
        [user.username, user.passwordHash, user.role, user.id]
      );
      return user;
    } else {
      // Insert
      const result = await this.database.query(
        'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, created_at',
        [user.username, user.passwordHash, user.role]
      );
      user.id = result.rows[0].id;
      user.createdAt = result.rows[0].created_at;
      return user;
    }
  }

  async delete(id) {
    await this.database.query('DELETE FROM users WHERE id = $1', [id]);
  }
}

module.exports = UserRepository;