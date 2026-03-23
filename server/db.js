// server/db.js
const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';
const dbUrl = process.env.DATABASE_URL;

const poolConfig = {
    connectionString: dbUrl,
};

// Chỉ dùng SSL cho production (Neon) hoặc nếu URL chứa 'ssl' hoặc 'neon'
if (isProduction || (dbUrl && (dbUrl.includes('ssl') || dbUrl.includes('neon') || dbUrl.includes('render')))) {
    poolConfig.ssl = {
        rejectUnauthorized: false // Cần thiết cho Neon
    };
}

const pool = new Pool(poolConfig);

// Test connection (chỉ chạy khi không phải production hoặc có flag)
if (process.env.NODE_ENV !== 'production' || process.env.TEST_DB === 'true') {
    pool.connect((err, client, release) => {
        if (err) {
            console.error('❌ Lỗi kết nối database:', err.message);
        } else {
            console.log('✅ Kết nối database thành công!');
            release();
        }
    });
}

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};