const express = require('express');
const router = express.Router();
const db = require('../db');

// ─────────────────────────────────────────────────────────────
// 1. GET /api/tickets -> Fetch all tickets (with creator name)
// ─────────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  // SQL: Join tickets with users to include the user's name and email
  const sql = `
    SELECT 
      tickets.*,
      users.name AS created_by_name,
      users.email AS created_by_email
    FROM tickets
    JOIN users ON tickets.user_id = users.id
    ORDER BY tickets.id DESC
  `;

  // db.all runs a query that returns multiple rows
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching tickets:', err.message);
      return res.status(500).json({ error: 'Failed to retrieve tickets.' });
    }

    // 200 OK: Send back the array of tickets as JSON
    res.status(200).json(rows);
  });
});

// ─────────────────────────────────────────────────────────────
// 1b. GET /api/tickets/my -> Fetch tickets for the logged-in user
// (For now, we pass ?userId=2 in the query string; in Phase 4 we get this from the JWT token!)
// ─────────────────────────────────────────────────────────────
router.get('/my', (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: 'Please provide a userId query parameter (e.g. /my?userId=2)' });
  }

  const sql = `
    SELECT 
      tickets.*,
      users.name AS created_by_name,
      users.email AS created_by_email
    FROM tickets
    JOIN users ON tickets.user_id = users.id
    WHERE tickets.user_id = ?
    ORDER BY tickets.id DESC
  `;

  db.all(sql, [userId], (err, rows) => {
    if (err) {
      console.error('Error fetching user tickets:', err.message);
      return res.status(500).json({ error: 'Failed to retrieve your tickets.' });
    }

    res.status(200).json(rows);
  });
});

// ─────────────────────────────────────────────────────────────
// 2. GET /api/tickets/:id -> Fetch a single ticket by its ID
// ─────────────────────────────────────────────────────────────
router.get('/:id', (req, res) => {
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

    // If no ticket with this ID was found, return 404 Not Found
    if (!row) {
      return res.status(404).json({ error: `Ticket with ID ${id} not found.` });
    }

    // 200 OK: Send the single ticket object
    res.status(200).json(row);
  });
});

// ─────────────────────────────────────────────────────────────
// 3. POST /api/tickets -> Create a new ticket
// ─────────────────────────────────────────────────────────────
router.post('/', (req, res) => {
  const { title, description, category, priority, user_id } = req.body;

  // 1. Validation: Check required fields
  if (!title || !description || !category || !user_id) {
    return res.status(400).json({
      error: 'Missing required fields: title, description, category, and user_id are mandatory.'
    });
  }

  // 2. Validation: Check allowed category values
  const validCategories = ['Hardware', 'Software', 'Network'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({
      error: `Invalid category. Must be one of: ${validCategories.join(', ')}`
    });
  }

  // 3. Default priority to 'Low' if not provided
  const ticketPriority = priority || 'Low';

  // 4. SQL Query: Insert new ticket
  const sql = `
    INSERT INTO tickets (title, description, category, priority, status, user_id)
    VALUES (?, ?, ?, ?, 'Open', ?)
  `;

  // db.run is used for INSERT, UPDATE, DELETE (queries that modify data)
  // 'this.lastID' gives the auto-incremented ID of the row just inserted!
  db.run(sql, [title, description, category, ticketPriority, user_id], function (err) {
    if (err) {
      console.error('Error creating ticket:', err.message);
      return res.status(500).json({ error: 'Failed to create ticket.' });
    }

    // 201 Created: Return success response with the new ticket ID
    res.status(201).json({
      message: 'Ticket created successfully!',
      ticketId: this.lastID
    });
  });
});

// ─────────────────────────────────────────────────────────────
// 4. PUT /api/tickets/:id -> Update an existing ticket (Admin)
// ─────────────────────────────────────────────────────────────
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, category, priority, status } = req.body;

  // 1. Validation: Ensure at least one field was sent to update
  if (!title && !description && !category && !priority && !status) {
    return res.status(400).json({ error: 'Please provide at least one field to update.' });
  }

  // 2. Validate category if provided
  const validCategories = ['Hardware', 'Software', 'Network'];
  if (category && !validCategories.includes(category)) {
    return res.status(400).json({
      error: `Invalid category. Must be one of: ${validCategories.join(', ')}`
    });
  }

  // 3. Validate priority if provided
  const validPriorities = ['Low', 'Medium', 'High'];
  if (priority && !validPriorities.includes(priority)) {
    return res.status(400).json({
      error: `Invalid priority. Must be one of: ${validPriorities.join(', ')}`
    });
  }

  // 4. Validate status if provided
  const validStatuses = ['Open', 'In Progress', 'Resolved'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
    });
  }

  // 5. SQL: Use COALESCE to update only the fields provided, keeping the old values if not provided
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

    // If 0 rows were updated, the ticket doesn't exist
    if (this.changes === 0) {
      return res.status(404).json({ error: `Ticket with ID ${id} not found.` });
    }

    // 200 OK: Return success
    res.status(200).json({ message: `Ticket #${id} updated successfully!` });
  });
});

// ─────────────────────────────────────────────────────────────
// 5. DELETE /api/tickets/:id -> Delete a ticket (Admin)
// ─────────────────────────────────────────────────────────────
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM tickets WHERE id = ?';

  db.run(sql, [id], function (err) {
    if (err) {
      console.error('Error deleting ticket:', err.message);
      return res.status(500).json({ error: 'Failed to delete ticket.' });
    }

    // If no row was deleted, that ticket ID doesn't exist
    if (this.changes === 0) {
      return res.status(404).json({ error: `Ticket with ID ${id} not found.` });
    }

    // 200 OK: Confirmation message
    res.status(200).json({ message: `Ticket #${id} deleted successfully.` });
  });
});

module.exports = router;