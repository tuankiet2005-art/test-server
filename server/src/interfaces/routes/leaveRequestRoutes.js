const express = require('express');
const LeaveRequestController = require('../controllers/LeaveRequestController');

function leaveRequestRoutes(leaveRequestController) {
  const router = express.Router();

  router.post('/', (req, res) => leaveRequestController.create(req, res));
  router.get('/', (req, res) => leaveRequestController.getForUser(req, res));
  router.patch('/:id/approve', (req, res) => leaveRequestController.approve(req, res));

  return router;
}

module.exports = leaveRequestRoutes;