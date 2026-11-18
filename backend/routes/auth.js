const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// ─────────────────────────────────────────────────────────────
// POST /api/auth/login -> Authenticate user & issue JWT
// ─────────────────────────────────────────────────────────────
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide both email and password.' });
    }

    // 2. Find user in database
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.get(sql, [email], (err, user) => {
        if (err) {
            console.error('Login error:', err.message);
            return res.status(500).json({ error: 'Database error during login.' });
        }

        // 3. User not found
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // 4. Verify password with bcrypt
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // 5. Generate signed JWT token
        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
        );

        // 6. Return token and user profile (excluding password!)
        res.status(200).json({
            message: 'Login successful!',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    });
});

module.exports = router;