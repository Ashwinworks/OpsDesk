const db = require('./db');
const bcrypt = require('bcryptjs');

setTimeout(() => {
    console.log('Seeding initial data with hashed passwords...');

    // Hash the passwords (salt rounds = 10)
    const adminPasswordHash = bcrypt.hashSync('admin123', 10);
    const employeePasswordHash = bcrypt.hashSync('user123', 10);

    // 1. Insert or replace users with hashed passwords
    const insertUser = `
    INSERT OR REPLACE INTO users (id, name, email, password, role)
    VALUES 
      (1, 'Admin User', 'admin@opsdesk.com', ?, 'admin'),
      (2, 'Jane Employee', 'jane@opsdesk.com', ?, 'employee');
  `;

    db.run(insertUser, [adminPasswordHash, employeePasswordHash], (err) => {
        if (err) {
            console.error('Error inserting sample users:', err.message);
            return;
        }
        console.log('Sample users seeded with encrypted passwords.');

        // 2. Insert sample ticket
        const insertTicket = `
      INSERT OR IGNORE INTO tickets (id, title, description, category, priority, status, user_id)
      VALUES 
        (1, 'Cannot connect to office Wi-Fi', 'Laptop keeps disconnecting from the 5GHz network.', 'Network', 'Medium', 'Open', 2);
    `;

        db.run(insertTicket, (ticketErr) => {
            if (ticketErr) {
                console.error('Error inserting sample ticket:', ticketErr.message);
            } else {
                console.log('Sample ticket seeded successfully.');
            }
            process.exit(0);
        });
    });
}, 500);