const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 4000;

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json()); // `extended: false` is not needed for JSON
app.use(cors());

// Define routes
app.use('/api', require('./routes/UserRoutes'));
app.use('/api', require('./routes/EventRoutes'));
app.use('/api', require('./routes/BookingRoutes'));

// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
