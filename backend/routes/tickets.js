const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, requireAdmin } = require('../middleware/auth');

// ─────────────────────────────────────────────────────────────
// 1. GET /api/tickets -> Fetch tickets
//    - Admins see ALL tickets
//    - Employees see ONLY their own tickets
// ─────────────────────────────────────────────────────────────
router.get('/', authenticate, (req, res) => {
  let sql = `
    SELECT 
      tickets.*,
      users.name AS created_by_name,
      users.email AS created_by_email
    FROM tickets
    JOIN users ON tickets.user_id = users.id
  `;
  const params = [];

  // If NOT an admin, automatically filter to only their own tickets!
  if (req.user.role !== 'admin') {
    sql += ' WHERE tickets.user_id = ?';
    params.push(req.user.id);
  }

  sql += ' ORDER BY tickets.id DESC';

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('Error fetching tickets:', err.message);
      return res.status(500).json({ error: 'Failed to retrieve tickets.' });
    }
    res.status(200).json(rows);
  });
});

// ─────────────────────────────────────────────────────────────
// 2. GET /api/tickets/:id -> Fetch single ticket (Protected)
// ─────────────────────────────────────────────────────────────
router.get('/:id', authenticate, (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      tickets.*,
      users.name AS created_by_name,
      users.email AS created_by_email
    FROM tickets
    JOIN users ON tickets.user_id = users.id
    WHERE tickets.id = ?
  `;

  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error('Error fetching ticket:', err.message);
      return res.status(500).json({ error: 'Database query failed.' });
    }

    if (!row) {
      return res.status(404).json({ error: `Ticket with ID ${id} not found.` });
    }

    // Employees can only view their own tickets; Admins can view any ticket
    if (req.user.role !== 'admin' && row.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied. You can only view your own tickets.' });
    }

    res.status(200).json(row);
  });
});

// ─────────────────────────────────────────────────────────────
// 3. POST /api/tickets -> Create ticket (Any logged-in user)
// ─────────────────────────────────────────────────────────────
router.post('/', authenticate, (req, res) => {
  const { title, description, category, priority } = req.body;
  // user_id is taken securely from the verified token!
  const userId = req.user.id;

  if (!title || !description || !category) {
    return res.status(400).json({
      error: 'Missing required fields: title, description, and category are mandatory.'
    });
  }

  const validCategories = ['Hardware', 'Software', 'Network'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({
      error: `Invalid category. Must be one of: ${validCategories.join(', ')}`
    });
  }

  const ticketPriority = priority || 'Low';

  const sql = `
    INSERT INTO tickets (title, description, category, priority, status, user_id)
    VALUES (?, ?, ?, ?, 'Open', ?)
  `;

  db.run(sql, [title, description, category, ticketPriority, userId], function (err) {
    if (err) {
      console.error('Error creating ticket:', err.message);
      return res.status(500).json({ error: 'Failed to create ticket.' });
    }

    res.status(201).json({
      message: 'Ticket created successfully!',
      ticketId: this.lastID
    });
  });
});

// ─────────────────────────────────────────────────────────────
// 4. PUT /api/tickets/:id -> Update ticket (ADMIN ONLY)
// ─────────────────────────────────────────────────────────────
router.put('/:id', authenticate, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { title, description, category, priority, status } = req.body;

  if (!title && !description && !category && !priority && !status) {
    return res.status(400).json({ error: 'Please provide at least one field to update.' });
  }

  const validCategories = ['Hardware', 'Software', 'Network'];
  if (category && !validCategories.includes(category)) {
    return res.status(400).json({
      error: `Invalid category. Must be one of: ${validCategories.join(', ')}`
    });
  }

  const validPriorities = ['Low', 'Medium', 'High'];
  if (priority && !validPriorities.includes(priority)) {
    return res.status(400).json({
      error: `Invalid priority. Must be one of: ${validPriorities.join(', ')}`
    });
  }

  const validStatuses = ['Open', 'In Progress', 'Resolved'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
    });
  }

  const sql = `
    UPDATE tickets
    SET 
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      category = COALESCE(?, category),
      priority = COALESCE(?, priority),
      status = COALESCE(?, status)
    WHERE id = ?
  `;

  db.run(sql, [title, description, category, priority, status, id], function (err) {
    if (err) {
      console.error('Error updating ticket:', err.message);
      return res.status(500).json({ error: 'Failed to update ticket.' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: `Ticket with ID ${id} not found.` });
    }

    res.status(200).json({ message: `Ticket #${id} updated successfully!` });
  });
});

// ─────────────────────────────────────────────────────────────
// 5. DELETE /api/tickets/:id -> Delete ticket (ADMIN ONLY)
// ─────────────────────────────────────────────────────────────
router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM tickets WHERE id = ?';

  db.run(sql, [id], function (err) {
    if (err) {
      console.error('Error deleting ticket:', err.message);
      return res.status(500).json({ error: 'Failed to delete ticket.' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: `Ticket with ID ${id} not found.` });
    }

    res.status(200).json({ message: `Ticket #${id} deleted successfully.` });
  });
});

module.exports = router;