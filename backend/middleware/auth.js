const jwt = require('jsonwebtoken');

// ─────────────────────────────────────────────────────────────
// Middleware 1: Verify JWT Token (Must be logged in)
// ─────────────────────────────────────────────────────────────
function authenticate(req, res, next) {
    // Extract token from header: "Authorization: Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        // Verify token using secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

        // Attach decoded user info ({ id, name, email, role }) to the request
        req.user = decoded;

        // Proceed to the next handler!
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token.' });
    }
}

// ─────────────────────────────────────────────────────────────
// Middleware 2: Role Check (Must be an Admin)
// ─────────────────────────────────────────────────────────────
function requireAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next(); // User is admin! Proceed!
    } else {
        return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
}

module.exports = { authenticate, requireAdmin };