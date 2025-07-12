const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

// Load env vars
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const questionRoutes = require('./routes/questionRoutes');
const answerRoutes = require('./routes/answerRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Initialize express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api', answerRoutes); // This will handle both /api/questions/:id/answers and /api/answers/:id
app.use('/api/notifications', notificationRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to StackIt API' });
});

// Test notification page
app.get('/test-notifications', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notification-test.html'));
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app; 