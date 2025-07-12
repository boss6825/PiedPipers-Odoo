const Notification = require('../models/Notification');

/**
 * Create a new notification
 * @param {Object} notificationData - Notification data
 * @returns {Promise<Object>} Created notification
 */
const createNotification = async (notificationData) => {
    return await Notification.create(notificationData);
};

/**
 * Get notifications for a user
 * @param {string} userId - User ID
 * @param {number} limit - Maximum number of notifications to return
 * @returns {Promise<Array>} List of notifications
 */
const getUserNotifications = async (userId, limit = 50) => {
    return await Notification.find({ recipient: userId })
        .populate('sender', 'username avatar')
        .populate('question', 'title')
        .sort({ createdAt: -1 })
        .limit(limit);
};

/**
 * Mark a notification as read
 * @param {string} notificationId - Notification ID
 * @param {string} userId - User ID making the update
 * @returns {Promise<Object>} Updated notification
 */
const markAsRead = async (notificationId, userId) => {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
        throw new Error('Notification not found');
    }

    // Check if user is the recipient of the notification
    if (notification.recipient.toString() !== userId.toString()) {
        throw new Error('Not authorized');
    }

    notification.read = true;
    return await notification.save();
};

/**
 * Mark all notifications as read for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Update result
 */
const markAllAsRead = async (userId) => {
    return await Notification.updateMany(
        { recipient: userId, read: false },
        { read: true }
    );
};

/**
 * Get unread notification count for a user
 * @param {string} userId - User ID
 * @returns {Promise<number>} Count of unread notifications
 */
const getUnreadCount = async (userId) => {
    return await Notification.countDocuments({
        recipient: userId,
        read: false,
    });
};

module.exports = {
    createNotification,
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
}; 