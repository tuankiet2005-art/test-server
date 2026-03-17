// server/db.js
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Cần thiết cho Neon
    }
});

// Test connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Lỗi kết nối database:', err.message);
    } else {
        console.log('✅ Kết nối database thành công!');
        release();
    }
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};