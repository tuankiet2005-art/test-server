const express = require('express');
const AuthController = require('../controllers/AuthController');

function authRoutes(authController) {
  const router = express.Router();

  router.post('/login', (req, res) => authController.login(req, res));
  router.get('/me', (req, res) => authController.getCurrentUser(req, res));

  return router;
}

module.exports = authRoutes;