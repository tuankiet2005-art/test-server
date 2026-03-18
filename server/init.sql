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

-- Tạo index cho performance
CREATE INDEX idx_leave_requests_user_id ON leave_requests(user_id);
CREATE INDEX idx_leave_requests_date ON leave_requests(date);
CREATE INDEX idx_advance_requests_user_id ON advance_requests(user_id);
CREATE INDEX idx_advance_requests_status ON advance_requests(status);

-- Tạo user manager mặc định (password: admin123 - hash từ bcrypt)
INSERT INTO users (username, password, name, role) 
VALUES (
    'admin', 
    '$2a$10$7SJtLFUES2gNm/qs0qX0bOuynj.AdOkLb52wSrZiFhK9YOhnu2FyW', 
    'Administrator', 
    'manager'
) ON CONFLICT (username) DO NOTHING;