CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,email TEXT NOT NULL UNIQUE,
password TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'employee'
);

-- ─────────────────────────────────────
-- TICKETS TABLE
-- ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS tickets (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT    NOT NULL,
    description  TEXT    NOT NULL,
    category     TEXT    NOT NULL CHECK(category IN ('Hardware', 'Software', 'Network')),
    priority     TEXT    NOT NULL DEFAULT 'Low' CHECK(priority IN ('Low', 'Medium', 'High')),
    status       TEXT    NOT NULL DEFAULT 'Open' CHECK(status IN ('Open', 'In Progress', 'Resolved')),
    created_date TEXT    NOT NULL DEFAULT (DATE('now')),
    user_id      INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);