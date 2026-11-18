const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const { authenticate, requireAdmin } = require('../middleware/auth');

// ─────────────────────────────────────────────────────────────
// 1. GET /api/users -> List all users (ADMIN ONLY)
// ─────────────────────────────────────────────────────────────
router.get('/', authenticate, requireAdmin, (req, res) => {
    const sql = 'SELECT id, name, email, role FROM users ORDER BY id ASC';
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching users:', err.message);
            return res.status(500).json({ error: 'Failed to retrieve users.' });
        }
        res.status(200).json(rows);
    });
});

// ─────────────────────────────────────────────────────────────
// 2. POST /api/users -> Admin adds a new employee (ADMIN ONLY)
// ─────────────────────────────────────────────────────────────
router.post('/', authenticate, requireAdmin, (req, res) => {
    const { name, email, password, role } = req.body;

    // 1. Validation
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const userRole = role === 'admin' ? 'admin' : 'employee';

    // 2. Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // 3. Insert into database
    const sql = `
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, ?)
  `;

    db.run(sql, [name, email, hashedPassword, userRole], function (err) {
        if (err) {
            // If email already exists, SQLite UNIQUE constraint will throw error code SQLITE_CONSTRAINT
            if (err.message.includes('UNIQUE')) {
                return res.status(400).json({ error: 'A user with this email already exists.' });
            }
            console.error('Error creating user:', err.message);
            return res.status(500).json({ error: 'Failed to create user.' });
        }

        res.status(201).json({
            message: 'User created successfully!',
            user: {
                id: this.lastID,
                name,
                email,
                role: userRole
            }
        });
    });
});

module.exports = router;