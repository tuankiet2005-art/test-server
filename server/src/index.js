require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import infrastructure
const Database = require('./infrastructure/database/Database');

// Import repositories
const UserRepository = require('./infrastructure/repositories/UserRepository');
const LeaveRequestRepository = require('./infrastructure/repositories/LeaveRequestRepository');
const SalaryAdvanceRepository = require('./infrastructure/repositories/SalaryAdvanceRepository');
const SalaryRepository = require('./infrastructure/repositories/SalaryRepository');

// Import application services
const AuthenticationService = require('./application/services/AuthenticationService');

// Import use cases
const CreateLeaveRequest = require('./application/use-cases/CreateLeaveRequest');
const GetLeaveRequestsForUser = require('./application/use-cases/GetLeaveRequestsForUser');
const ApproveLeaveRequest = require('./application/use-cases/ApproveLeaveRequest');

// Import controllers
const AuthController = require('./interfaces/controllers/AuthController');
const LeaveRequestController = require('./interfaces/controllers/LeaveRequestController');

// Import routes
const authRoutes = require('./interfaces/routes/authRoutes');
const leaveRequestRoutes = require('./interfaces/routes/leaveRequestRoutes');

// Import middleware
const authMiddleware = require('./interfaces/middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize infrastructure
const database = new Database();

// Initialize repositories
const userRepository = new UserRepository(database);
const leaveRequestRepository = new LeaveRequestRepository(database);
const salaryAdvanceRepository = new SalaryAdvanceRepository(database);
const salaryRepository = new SalaryRepository(database);

// Initialize application services
const authenticationService = new AuthenticationService(userRepository);

// Initialize use cases
const createLeaveRequestUseCase = new CreateLeaveRequest(leaveRequestRepository);
const getLeaveRequestsForUserUseCase = new GetLeaveRequestsForUser(leaveRequestRepository);
const approveLeaveRequestUseCase = new ApproveLeaveRequest(leaveRequestRepository);

// Initialize controllers
const authController = new AuthController(authenticationService);
const leaveRequestController = new LeaveRequestController(
  createLeaveRequestUseCase,
  getLeaveRequestsForUserUseCase,
  approveLeaveRequestUseCase
);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes(authController));
app.use('/api/leave-requests', authMiddleware(authenticationService), leaveRequestRoutes(leaveRequestController));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await database.close();
  process.exit(0);
});

module.exports = app;