
// This script is for one-time database initialization.
// It connects to the database and ensures the schema is created.

const { db } = require('./config/database');

console.log('Attempting to initialize database schema...');

// The database connection in database.js automatically calls initializeDatabase.
// We just need to connect and then close it to trigger the initialization.

db.serialize(() => {
  console.log('Database connection established for initialization.');
  // The schema initialization is handled by the connection event in database.js
  // We can add a small delay to ensure it completes before closing.
  setTimeout(() => {
    db.close((err) => {
      if (err) {
        console.error('Error closing database during initialization:', err.message);
      } else {
        console.log('Database connection closed. Initialization should be complete.');
      }
    });
  }, 2000); // Wait 2 seconds for safety
});
