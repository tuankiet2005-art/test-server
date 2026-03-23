-- Tạo bảng users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng leave_requests
CREATE TABLE IF NOT EXISTS leave_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time_period VARCHAR(20) DEFAULT 'all day',
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by_manager BOOLEAN DEFAULT false
);

-- Tạo bảng advance_requests
CREATE TABLE IF NOT EXISTS advance_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng salary
CREATE TABLE IF NOT EXISTS salary (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    month DATE NOT NULL,
    base_salary DECIMAL(12,2) DEFAULT 0,
    total_advances DECIMAL(12,2) DEFAULT 0,
    total_deductions DECIMAL(12,2) DEFAULT 0,
    net_salary DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, month)
);

-- Tạo bảng attendance
CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'present',
    time_period VARCHAR(20) DEFAULT 'full',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date)
);

-- Tạo index cho performance
CREATE INDEX IF NOT EXISTS idx_leave_requests_user_id ON leave_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_date ON leave_requests(date);
CREATE INDEX IF NOT EXISTS idx_advance_requests_user_id ON advance_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_advance_requests_status ON advance_requests(status);
CREATE INDEX IF NOT EXISTS idx_salary_user_id ON salary(user_id);
CREATE INDEX IF NOT EXISTS idx_salary_month ON salary(month);
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);

-- Xóa data cũ (nếu có)
DELETE FROM attendance;
DELETE FROM salary;
DELETE FROM advance_requests;
DELETE FROM leave_requests;
DELETE FROM users;

-- Tạo user manager mặc định (password: admin123)
INSERT INTO users (username, password, name, role) 
VALUES (
    'admin', 
    '$2a$10$7SJtLFUES2gNm/qs0qX0bOuynj.AdOkLb52wSrZiFhK9YOhnu2FyW', 
    'Administrator', 
    'manager'
) ON CONFLICT (username) DO NOTHING;

-- Tạo sample employees (password: 123456)
INSERT INTO users (username, password, name, role) 
VALUES 
    ('john_doe', '$2a$10$0wLlPjvQQ4DWxKTj0HbO3eZLjB2.J6ZzMhDvgVDd8p7X5VWnYpTQO', 'John Doe', 'employee'),
    ('jane_smith', '$2a$10$0wLlPjvQQ4DWxKTj0HbO3eZLjB2.J6ZzMhDvgVDd8p7X5VWnYpTQO', 'Jane Smith', 'employee'),
    ('bob_johnson', '$2a$10$0wLlPjvQQ4DWxKTj0HbO3eZLjB2.J6ZzMhDvgVDd8p7X5VWnYpTQO', 'Bob Johnson', 'employee'),
    ('alice_williams', '$2a$10$0wLlPjvQQ4DWxKTj0HbO3eZLjB2.J6ZzMhDvgVDd8p7X5VWnYpTQO', 'Alice Williams', 'employee'),
    ('charlie_brown', '$2a$10$0wLlPjvQQ4DWxKTj0HbO3eZLjB2.J6ZzMhDvgVDd8p7X5VWnYpTQO', 'Charlie Brown', 'employee')
ON CONFLICT (username) DO NOTHING;

-- Thêm sample salary data
INSERT INTO salary (user_id, month, base_salary, total_advances, total_deductions, net_salary)
SELECT u.id, '2024-03-01'::date, 5000, 0, 0, 5000 FROM users u WHERE u.role = 'employee' LIMIT 1;

INSERT INTO salary (user_id, month, base_salary, total_advances, total_deductions, net_salary)
SELECT u.id, '2024-03-01'::date, 6000, 500, 100, 5400 FROM users u WHERE u.role = 'employee' OFFSET 1 LIMIT 1;

-- Thêm sample leave requests
INSERT INTO leave_requests (user_id, date, time_period, reason, status)
SELECT u.id, '2024-03-15'::date, 'all day', 'Personal day', 'pending' FROM users u WHERE u.role = 'employee' LIMIT 1;

-- Thêm sample attendance
INSERT INTO attendance (user_id, date, status, time_period)
SELECT u.id, '2024-03-20'::date, 'present', 'full' FROM users u WHERE u.role = 'employee' LIMIT 1;