const express = require('express');
const router = express.Router();
const {
    getNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
} = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

// @route   GET /api/notifications
router.get('/', protect, getNotifications);

// @route   PUT /api/notifications/:id
router.put('/:id', protect, markAsRead);

// @route   PUT /api/notifications
router.put('/', protect, markAllAsRead);

// @route   GET /api/notifications/count
router.get('/count', protect, getUnreadCount);

module.exports = router; 