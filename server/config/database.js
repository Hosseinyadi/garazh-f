const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Determine database path (env-overridable)
const defaultDbDir = path.join(__dirname, '..', 'database');
const defaultDbPath = path.join(defaultDbDir, 'bilflow.db');
const dbPath = process.env.DB_PATH ? path.resolve(process.env.DB_PATH) : defaultDbPath;

// Ensure database directory exists
const dbParentDir = path.dirname(dbPath);
if (!fs.existsSync(dbParentDir)) {
    fs.mkdirSync(dbParentDir, { recursive: true });
}

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        // Apply recommended PRAGMAs
        try {
            db.serialize(() => {
                db.run('PRAGMA journal_mode = WAL');
                db.run('PRAGMA synchronous = NORMAL');
                db.run('PRAGMA foreign_keys = ON');
                db.run('PRAGMA busy_timeout = 5000');
            });
        } catch (e) {
            console.warn('PRAGMA setup failed:', e.message);
        }
        initializeDatabase();
    }
});

// Initialize database with schema
function initializeDatabase() {
    const fs = require('fs');
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    
    if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        db.exec(schema, (err) => {
            if (err) {
                console.error('Error initializing database:', err.message);
            } else {
                console.log('Database schema initialized successfully');
            }
        });
    }
}

// Database helper functions
const dbHelpers = {
    // Get single row
    get: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    // Get multiple rows
    all: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    // Run query (INSERT, UPDATE, DELETE)
    run: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, changes: this.changes });
            });
        });
    },

    // Begin transaction
    beginTransaction: () => {
        return new Promise((resolve, reject) => {
            db.run('BEGIN TRANSACTION', (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    },

    // Commit transaction
    commit: () => {
        return new Promise((resolve, reject) => {
            db.run('COMMIT', (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    },

    // Rollback transaction
    rollback: () => {
        return new Promise((resolve, reject) => {
            db.run('ROLLBACK', (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
};

module.exports = { db, dbHelpers };
