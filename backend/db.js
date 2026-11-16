const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Path to SQLite database file
const dbPath = path.join(__dirname, '..', 'database', 'opsdesk.db');

// Connect to SQLite
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to SQLite database.');

        // Enable foreign keys
        db.run('PRAGMA foreign_keys = ON');

        // Read and run schema.sql to create tables
        const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf-8');

        db.exec(schema, (execErr) => {
            if (execErr) {
                console.error('Error creating tables:', execErr.message);
            } else {
                console.log('Database tables initialized successfully.');
            }
        });
    }
});

module.exports = db;