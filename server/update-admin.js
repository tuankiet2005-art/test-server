// update-admin.js
const { query } = require('./db');
require('dotenv').config();

async function updateAdmin() {
    try {
        const adminHash = '$2a$10$7SJtLFUES2gNm/qs0qX0bOuynj.AdOkLb52wSrZiFhK9YOhnu2FyW';
        
        await query(
            'UPDATE users SET password = $1 WHERE username = $2',
            [adminHash, 'admin']
        );
        
        console.log('✅ Admin password updated successfully');
        
        // Kiểm tra
        const result = await query(
            'SELECT username, password FROM users WHERE username = $1',
            ['admin']
        );
        console.log('📊 New admin password:', result.rows[0].password);
        
    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        process.exit();
    }
}

updateAdmin();