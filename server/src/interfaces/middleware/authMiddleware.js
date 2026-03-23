const AuthenticationService = require('../../application/services/AuthenticationService');

function authMiddleware(authenticationService) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    try {
      const decoded = authenticationService.verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
}

module.exports = authMiddleware;