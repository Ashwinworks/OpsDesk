// Load environment variables from .env file
const dotenv = require('dotenv');
dotenv.config();

// Import Express
const express = require('express');
const cors = require('cors');
const db = require('./db')
const ticketRoutes = require('./routes/tickets');
// Create the Express app
const app = express();

// Middlewares
app.use(cors());          // Allows the React frontend to talk to this server
app.use(express.json());  // Allows the server to understand JSON in request bodies
app.use('/api/tickets', ticketRoutes);

// Define the port (use .env value if set, otherwise default to 5000)
const PORT = process.env.PORT || 5000;

// A simple test route
app.get('/', (req, res) => {
    res.json({ message: 'Hello from OpsDesk API!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});