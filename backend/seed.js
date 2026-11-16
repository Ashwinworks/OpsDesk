const db = require('./db');

// Run seeds after a tiny delay so schema initialization finishes first
setTimeout(() => {
    console.log('Seeding initial data...');

    // 1. Insert Admin user (password: 'admin123')
    const insertUser = `
    INSERT OR IGNORE INTO users (id, name, email, password, role)
    VALUES 
      (1, 'Admin User', 'admin@opsdesk.com', 'admin123', 'admin'),
      (2, 'Jane Employee', 'jane@opsdesk.com', 'user123', 'employee');
  `;

    db.run(insertUser, (err) => {
        if (err) {
            console.error('Error inserting sample users:', err.message);
            return;
        }
        console.log('Sample users seeded (Admin & Employee).');

        // 2. Insert a sample ticket created by Jane (user_id = 2)
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