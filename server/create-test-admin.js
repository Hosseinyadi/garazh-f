const bcrypt = require('bcryptjs');
const { dbHelpers } = require('./config/database');

async function createTestAdmin() {
    try {
        // Check if test admin already exists
        const existing = await dbHelpers.get(
            'SELECT * FROM admin_users WHERE username = ?',
            ['admin']
        );

        if (existing) {
            console.log('✅ Test admin already exists!');
            console.log('👤 Username: admin');
            console.log('🔑 Password: admin123');
            return;
        }

        // Hash password
        const passwordHash = await bcrypt.hash('admin123', 10);

        // Create test admin
        const result = await dbHelpers.run(
            `INSERT INTO admin_users (username, password_hash, role, is_active)
             VALUES (?, ?, ?, ?)`,
            ['admin', passwordHash, 'admin', 1]
        );

        console.log('✅ Test admin created successfully!');
        console.log('');
        console.log('📋 Login credentials:');
        console.log('👤 Username: admin');
        console.log('🔑 Password: admin123');
        console.log('');
        console.log('🌐 Login at: http://localhost:5173/auth (tab: ادمین)');
        
    } catch (error) {
        console.error('❌ Error creating test admin:', error);
    }
}

// Run the script
createTestAdmin().then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
}).catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
