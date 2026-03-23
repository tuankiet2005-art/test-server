const bcrypt = require('bcryptjs');

class User {
  constructor(id, username, passwordHash, role, createdAt = new Date()) {
    this.id = id;
    this.username = username;
    this.passwordHash = passwordHash;
    this.role = role;
    this.createdAt = createdAt;
  }

  static get EMPLOYEE() { return 'employee'; }
  static get MANAGER() { return 'manager'; }

  static get validRoles() {
    return [User.EMPLOYEE, User.MANAGER];
  }

  isManager() {
    return this.role === User.MANAGER;
  }

  isEmployee() {
    return this.role === User.EMPLOYEE;
  }

  async verifyPassword(password) {
    return bcrypt.compare(password, this.passwordHash);
  }

  static async hashPassword(password) {
    return bcrypt.hash(password, 10);
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      role: this.role,
      createdAt: this.createdAt
    };
  }
}

module.exports = User;