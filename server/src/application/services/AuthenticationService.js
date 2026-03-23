const jwt = require('jsonwebtoken');
const User = require('../../domain/entities/User');

class AuthenticationService {
  constructor(userRepository) {
    this.userRepository = userRepository;
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  }

  async authenticate(username, password) {
    const user = await this.userRepository.findByUsername(username);
    if (!user || !(await user.verifyPassword(password))) {
      throw new Error('Invalid credentials');
    }
    return this.generateToken(user);
  }

  generateToken(user) {
    return jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      this.jwtSecret,
      { expiresIn: '24h' }
    );
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

module.exports = AuthenticationService;