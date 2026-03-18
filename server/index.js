// server/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { query } = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'Group_6';

// ==================== CORS - CHO PHÉP TẤT CẢ ====================
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// Xử lý preflight OPTIONS cho tất cả routes
app.options('*', cors());

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware log requests (optional - để debug)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// ==================== MIDDLEWARE ====================

// Authentication middleware
async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required.' });
    }

    try {
        const user = jwt.verify(token, JWT_SECRET);
        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token.' });
    }
}

// Check if user is manager
async function isManager(req, res, next) {
    if (req.user.role !== 'manager') {
        return res.status(403).json({ error: 'Manager access required.' });
    }
    next();
}

// ==================== TEST ROUTES ====================

// Health check (không cần auth)
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        message: 'Server is running!',
        environment: process.env.NODE_ENV || 'development'
    });
});

// Test CORS (không cần auth)
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'CORS is working!',
        origin: req.headers.origin || 'No origin',
        method: req.method
    });
});

// ==================== AUTH ROUTES ====================

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        console.log('🔍 Login attempt:', username);
        
        const result = await query(
            'SELECT id, username, password, name, role FROM users WHERE username = $1',
            [username]
        );
        
        const user = result.rows[0];
        
        if (!user) {
            console.log('❌ User not found');
            return res.status(401).json({ error: 'Invalid username or password.' });
        }
        
        console.log('✅ User found, comparing password...');
        
        // So sánh password
        const isValid = bcrypt.compareSync(password, user.password);
        
        console.log('🔍 Password valid:', isValid);
        
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role
            }
        });
    } catch (err) {
        console.error('❌ Login error:', err);
        res.status(500).json({ error: 'Internal server error: ' + err.message });
    }
});

// Get current user
app.get('/api/me', authenticateToken, async (req, res) => {
    try {
        const result = await query(
            'SELECT id, username, name, role FROM users WHERE id = $1',
            [req.user.id]
        );
        
        const user = result.rows[0];
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        
        res.json(user);
    } catch (err) {
        console.error('Get current user error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Change password
app.patch('/api/users/change-password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current password and new password are required.' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must have at least 6 characters.' });
        }

        const result = await query(
            'SELECT password FROM users WHERE id = $1',
            [req.user.id]
        );
        
        const user = result.rows[0];
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!bcrypt.compareSync(currentPassword, user.password)) {
            return res.status(400).json({ error: 'Current password is incorrect.' });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        await query(
            'UPDATE users SET password = $1 WHERE id = $2',
            [hashedPassword, req.user.id]
        );

        res.json({ message: 'Password changed successfully.' });
    } catch (err) {
        console.error('Change password error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== USER ROUTES (Manager only) ====================

// Create employee
app.post('/api/users', authenticateToken, isManager, async (req, res) => {
    try {
        const { username, password, name } = req.body;

        if (!username || !password || !name) {
            return res.status(400).json({ error: 'Username, password, and full name are required.' });
        }

        // Check if username exists
        const existingUser = await query(
            'SELECT id FROM users WHERE username = $1',
            [username]
        );
        
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Username already exists.' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        
        const result = await query(
            `INSERT INTO users (username, password, name, role) 
             VALUES ($1, $2, $3, 'employee') 
             RETURNING id, username, name, role`,
            [username, hashedPassword, name]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Create user error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Bulk setup employees
app.post('/api/users/bulk-setup', authenticateToken, isManager, async (req, res) => {
    try {
        const employeeList = [
            { name: 'Phạm Quan Kha', username: 'kha.pham.emp' },
            { name: 'Nguyễn Hoàng Sơn', username: 'son.nguyen.emp' },
            { name: 'Đoàn Tuấn Kiệt', username: 'kiet.doan.emp' },
            { name: 'Lương Minh Huy', username: 'huy.luong.emp' },
            { name: 'Trịnh Bảo Khang', username: 'khang.trinh.emp' },
            { name: 'Nguyễn Bá Hùng', username: 'hung.nguyen.emp' }
        ];

        const addedUsers = [];
        const defaultPassword = bcrypt.hashSync('123456', 10);

        for (const emp of employeeList) {
            const existing = await query(
                'SELECT id FROM users WHERE username = $1',
                [emp.username]
            );
            
            if (existing.rows.length === 0) {
                const result = await query(
                    `INSERT INTO users (username, password, name, role) 
                     VALUES ($1, $2, $3, 'employee') 
                     RETURNING id, username, name, role`,
                    [emp.username, defaultPassword, emp.name]
                );
                addedUsers.push(result.rows[0]);
            }
        }

        res.json({
            message: `Added ${addedUsers.length} new employee(s)`,
            added: addedUsers
        });
    } catch (err) {
        console.error('Bulk setup error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all employees
app.get('/api/users', authenticateToken, isManager, async (req, res) => {
    try {
        const result = await query(
            `SELECT id, username, name, role 
             FROM users 
             WHERE role = 'employee' 
             ORDER BY name`
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Get users error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update employee
app.put('/api/users/:id', authenticateToken, isManager, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const { name, username } = req.body;

        const userExists = await query(
            'SELECT id FROM users WHERE id = $1',
            [userId]
        );
        
        if (userExists.rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found.' });
        }

        if (username) {
            const existingUser = await query(
                'SELECT id FROM users WHERE username = $1 AND id != $2',
                [username, userId]
            );
            
            if (existingUser.rows.length > 0) {
                return res.status(400).json({ error: 'Username already exists.' });
            }
        }

        const result = await query(
            `UPDATE users 
             SET name = COALESCE($1, name), 
                 username = COALESCE($2, username) 
             WHERE id = $3 
             RETURNING id, username, name, role`,
            [name, username, userId]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Update user error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Reset password
app.patch('/api/users/:id/reset-password', authenticateToken, isManager, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const { newPassword } = req.body;

        const userExists = await query(
            'SELECT id FROM users WHERE id = $1',
            [userId]
        );
        
        if (userExists.rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found.' });
        }

        const password = newPassword || '123456';
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must have at least 6 characters.' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        await query(
            'UPDATE users SET password = $1 WHERE id = $2',
            [hashedPassword, userId]
        );

        res.json({
            message: 'Password reset successfully.',
            defaultPassword: password
        });
    } catch (err) {
        console.error('Reset password error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete employee
app.delete('/api/users/:id', authenticateToken, isManager, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        if (userId === req.user.id) {
            return res.status(400).json({ error: 'You cannot delete your own account.' });
        }

        const result = await query(
            'DELETE FROM users WHERE id = $1 RETURNING id',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found.' });
        }

        res.json({ message: 'Employee removed successfully.' });
    } catch (err) {
        console.error('Delete user error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== LEAVE REQUESTS ====================

// Create leave request
app.post('/api/leave-requests', authenticateToken, async (req, res) => {
    try {
        const { date, reason, timePeriod = 'all day', userId } = req.body;

        if (!date) {
            return res.status(400).json({ error: 'Date is required.' });
        }

        let targetUserId = req.user.id;

        if (req.user.role === 'manager' && userId) {
            const targetUser = await query(
                'SELECT id, name FROM users WHERE id = $1 AND role = $2',
                [parseInt(userId), 'employee']
            );
            
            if (targetUser.rows.length === 0) {
                return res.status(400).json({ error: 'Employee not found.' });
            }
            targetUserId = parseInt(userId);
        }

        // Check for existing request
        const existingRequest = await query(
            `SELECT id FROM leave_requests 
             WHERE user_id = $1 AND date = $2 AND time_period = $3`,
            [targetUserId, date, timePeriod]
        );

        if (existingRequest.rows.length > 0) {
            return res.status(400).json({ error: 'Leave request for this date and time period already exists.' });
        }

        const result = await query(
            `INSERT INTO leave_requests (user_id, date, time_period, reason, status, created_by_manager) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING id, user_id, date, time_period, reason, status, submitted_at, created_by_manager`,
            [
                targetUserId,
                date,
                timePeriod,
                reason || '',
                req.user.role === 'manager' && userId ? 'approved' : 'pending',
                req.user.role === 'manager' && userId ? true : false
            ]
        );

        const userResult = await query(
            'SELECT name FROM users WHERE id = $1',
            [targetUserId]
        );

        const response = {
            id: result.rows[0].id,
            userId: result.rows[0].user_id,
            userName: userResult.rows[0].name,
            date: result.rows[0].date.toISOString().split('T')[0],
            timePeriod: result.rows[0].time_period,
            reason: result.rows[0].reason,
            status: result.rows[0].status,
            submittedAt: result.rows[0].submitted_at,
            canEdit: false,
            createdByManager: result.rows[0].created_by_manager
        };

        res.status(201).json(response);
    } catch (err) {
        console.error('Create leave request error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get leave requests
app.get('/api/leave-requests', authenticateToken, async (req, res) => {
    try {
        let queryStr = `
            SELECT lr.*, u.name as user_name 
            FROM leave_requests lr
            JOIN users u ON lr.user_id = u.id
        `;
        let queryParams = [];

        if (req.user.role !== 'manager') {
            queryStr += ` WHERE lr.user_id = $1`;
            queryParams.push(req.user.id);
        }

        queryStr += ` ORDER BY lr.submitted_at DESC`;

        const result = await query(queryStr, queryParams);
        
        const requests = result.rows.map(row => ({
            id: row.id,
            userId: row.user_id,
            userName: row.user_name,
            date: row.date.toISOString().split('T')[0],
            timePeriod: row.time_period,
            reason: row.reason,
            status: row.status,
            submittedAt: row.submitted_at,
            canEdit: false,
            createdByManager: row.created_by_manager
        }));

        res.json(requests);
    } catch (err) {
        console.error('Get leave requests error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update leave request status (Manager only)
app.patch('/api/leave-requests/:id/status', authenticateToken, isManager, async (req, res) => {
    try {
        const requestId = parseInt(req.params.id);
        const { status } = req.body;

        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status.' });
        }

        const result = await query(
            `UPDATE leave_requests 
             SET status = $1 
             WHERE id = $2 
             RETURNING id, user_id, date, time_period, reason, status, submitted_at`,
            [status, requestId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Leave request not found.' });
        }

        const userResult = await query(
            'SELECT name FROM users WHERE id = $1',
            [result.rows[0].user_id]
        );

        const response = {
            id: result.rows[0].id,
            userId: result.rows[0].user_id,
            userName: userResult.rows[0].name,
            date: result.rows[0].date.toISOString().split('T')[0],
            timePeriod: result.rows[0].time_period,
            reason: result.rows[0].reason,
            status: result.rows[0].status,
            submittedAt: result.rows[0].submitted_at
        };

        res.json(response);
    } catch (err) {
        console.error('Update leave request status error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete leave request (Manager only)
app.delete('/api/leave-requests/:id', authenticateToken, isManager, async (req, res) => {
    try {
        const requestId = parseInt(req.params.id);

        const result = await query(
            'DELETE FROM leave_requests WHERE id = $1 RETURNING id',
            [requestId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Leave request not found.' });
        }

        res.json({ message: 'Leave request deleted successfully' });
    } catch (err) {
        console.error('Delete leave request error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== ADVANCE REQUESTS ====================

// Create advance request
app.post('/api/advance-requests', authenticateToken, async (req, res) => {
    try {
        const { userId, amount, reason } = req.body;

        if (!amount) {
            return res.status(400).json({ error: 'Amount is required.' });
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ error: 'Amount must be greater than 0.' });
        }

        let targetUserId;
        let targetUser;

        if (req.user.role === 'manager') {
            if (!userId) {
                return res.status(400).json({ error: 'Employee is required.' });
            }
            const employee = await query(
                'SELECT id, name FROM users WHERE id = $1 AND role = $2',
                [parseInt(userId), 'employee']
            );
            
            if (employee.rows.length === 0) {
                return res.status(404).json({ error: 'Employee not found.' });
            }
            targetUserId = parseInt(userId);
            targetUser = employee.rows[0];
        } else {
            targetUserId = req.user.id;
            const user = await query(
                'SELECT name FROM users WHERE id = $1',
                [req.user.id]
            );
            targetUser = user.rows[0];
        }

        const result = await query(
            `INSERT INTO advance_requests (user_id, amount, reason, status) 
             VALUES ($1, $2, $3, $4) 
             RETURNING id, user_id, amount, reason, status, submitted_at`,
            [
                targetUserId,
                parsedAmount,
                reason || '',
                req.user.role === 'manager' ? 'approved' : 'pending'
            ]
        );

        const response = {
            id: result.rows[0].id,
            userId: result.rows[0].user_id,
            userName: targetUser.name,
            amount: parseFloat(result.rows[0].amount),
            reason: result.rows[0].reason,
            status: result.rows[0].status,
            submittedAt: result.rows[0].submitted_at
        };

        res.status(201).json(response);
    } catch (err) {
        console.error('Create advance request error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get advance requests
app.get('/api/advance-requests', authenticateToken, async (req, res) => {
    try {
        let queryStr = `
            SELECT ar.*, u.name as user_name 
            FROM advance_requests ar
            JOIN users u ON ar.user_id = u.id
        `;
        let queryParams = [];

        if (req.user.role !== 'manager') {
            queryStr += ` WHERE ar.user_id = $1`;
            queryParams.push(req.user.id);
        }

        queryStr += ` ORDER BY ar.submitted_at DESC`;

        const result = await query(queryStr, queryParams);
        
        const requests = result.rows.map(row => ({
            id: row.id,
            userId: row.user_id,
            userName: row.user_name,
            amount: parseFloat(row.amount),
            reason: row.reason,
            status: row.status,
            submittedAt: row.submitted_at
        }));

        res.json(requests);
    } catch (err) {
        console.error('Get advance requests error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update advance request status (Manager only)
app.patch('/api/advance-requests/:id/status', authenticateToken, isManager, async (req, res) => {
    try {
        const requestId = parseInt(req.params.id);
        const { status } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const result = await query(
            `UPDATE advance_requests 
             SET status = $1 
             WHERE id = $2 
             RETURNING *`,
            [status, requestId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Advance request not found.' });
        }

        const userResult = await query(
            'SELECT name FROM users WHERE id = $1',
            [result.rows[0].user_id]
        );

        const response = {
            id: result.rows[0].id,
            userId: result.rows[0].user_id,
            userName: userResult.rows[0].name,
            amount: parseFloat(result.rows[0].amount),
            reason: result.rows[0].reason,
            status: result.rows[0].status,
            submittedAt: result.rows[0].submitted_at
        };

        res.json(response);
    } catch (err) {
        console.error('Update advance request error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete advance request (Manager only)
app.delete('/api/advance-requests/:id', authenticateToken, isManager, async (req, res) => {
    try {
        const requestId = parseInt(req.params.id);

        const result = await query(
            'DELETE FROM advance_requests WHERE id = $1 RETURNING id',
            [requestId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Advance request not found.' });
        }

        res.json({ message: 'Advance request deleted successfully.' });
    } catch (err) {
        console.error('Delete advance request error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== SALARY ROUTES ====================

// Get own salary for employee
app.get('/api/users/me/salary/:month', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const month = req.params.month; // format: YYYY-MM
        
        // Chuyển đổi month string thành date (ngày đầu tháng)
        const monthDate = new Date(month + '-01');

        const result = await query(
            `SELECT amount FROM salaries 
             WHERE user_id = $1 AND month = $2`,
            [userId, monthDate]
        );

        const salary = result.rows[0] ? result.rows[0].amount : null;
        
        res.json({ month, salary });
    } catch (err) {
        console.error('Error in /api/users/me/salary/:month:', err);
        res.status(500).json({ error: 'Error retrieving salary information: ' + err.message });
    }
});

// Set salary for employee (Manager only)
app.post('/api/users/:id/salary', authenticateToken, isManager, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const { month, salary } = req.body; // month format: YYYY-MM

        if (!month || salary === undefined || salary === null) {
            return res.status(400).json({ error: 'Monthly salary is required.' });
        }

        if (salary < 0) {
            return res.status(400).json({ error: 'Salaries cannot be negative.' });
        }

        const monthDate = new Date(month + '-01');

        const result = await query(
            `INSERT INTO salaries (user_id, month, amount) 
             VALUES ($1, $2, $3)
             ON CONFLICT (user_id, month) 
             DO UPDATE SET amount = EXCLUDED.amount
             RETURNING amount`,
            [userId, monthDate, parseFloat(salary)]
        );

        res.json({
            message: 'Salary setting successful.',
            month,
            salary: result.rows[0].amount
        });
    } catch (err) {
        console.error('Set salary error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get salary for employee (Manager only)
app.get('/api/users/:id/salary/:month', authenticateToken, isManager, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const month = req.params.month;
        const monthDate = new Date(month + '-01');

        const result = await query(
            `SELECT amount FROM salaries 
             WHERE user_id = $1 AND month = $2`,
            [userId, monthDate]
        );

        const salary = result.rows[0] ? result.rows[0].amount : null;

        res.json({ month, salary });
    } catch (err) {
        console.error('Get salary error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all salaries for employee (Manager only)
app.get('/api/users/:id/salaries', authenticateToken, isManager, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        const result = await query(
            `SELECT to_char(month, 'YYYY-MM') as month, amount 
             FROM salaries 
             WHERE user_id = $1 
             ORDER BY month DESC`,
            [userId]
        );

        const salaries = {};
        result.rows.forEach(row => {
            salaries[row.month] = row.amount;
        });

        res.json({ salaries });
    } catch (err) {
        console.error('Get all salaries error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API URL: http://localhost:${PORT}/api`);
    console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌐 CORS: Allowed all origins (*)`);
});