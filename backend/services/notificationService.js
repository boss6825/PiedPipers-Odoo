const Notification = require('../models/Notification');
const { sendNotificationToUser } = require('../utils/socket');

/**
 * Create a new notification and send it in real-time
 * @param {Object} notificationData - Notification data
 * @returns {Promise<Object>} Created notification
 */
const createNotification = async (notificationData) => {
    const notification = await Notification.create(notificationData);

    // Populate notification for real-time delivery
    const populatedNotification = await Notification.findById(notification._id)
        .populate('sender', 'username avatar')
        .populate('question', 'title');

    // Send real-time notification to recipient
    if (notification.recipient) {
        sendNotificationToUser(notification.recipient.toString(), populatedNotification);
    }

    return populatedNotification;
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
    const updatedNotification = await notification.save();

    // Send update to user to reflect read status
    sendNotificationToUser(userId, {
        type: 'notification_read',
        id: notificationId
    });

    return updatedNotification;
};

/**
 * Mark all notifications as read for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Update result
 */
const markAllAsRead = async (userId) => {
    const result = await Notification.updateMany(
        { recipient: userId, read: false },
        { read: true }
    );

    // Send update to user to reflect all read
    sendNotificationToUser(userId, {
        type: 'all_notifications_read'
    });

    return result;
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

/**
 * Create a notification for when someone answers a question
 * @param {string} questionOwnerId - Question owner's user ID
 * @param {string} answererId - User ID of the person answering
 * @param {string} answererUsername - Username of the person answering
 * @param {string} questionId - Question ID
 * @param {string} answerId - Answer ID
 * @param {string} questionTitle - Question title
 * @returns {Promise<Object>} Created notification
 */
const createAnswerNotification = async (questionOwnerId, answererId, answererUsername, questionId, answerId, questionTitle) => {
    // Don't notify if the question owner is answering their own question
    if (questionOwnerId.toString() === answererId.toString()) {
        return null;
    }

    return await createNotification({
        recipient: questionOwnerId,
        sender: answererId,
        type: 'answer',
        question: questionId,
        answer: answerId,
        message: `${answererUsername} answered your question: "${questionTitle.substring(0, 50)}${questionTitle.length > 50 ? '...' : ''}"`,
    });
};

/**
 * Create a notification for when an answer is accepted
 * @param {string} answerOwnerId - Answer owner's user ID
 * @param {string} accepterId - User ID of the person accepting
 * @param {string} accepterUsername - Username of the person accepting
 * @param {string} questionId - Question ID
 * @param {string} answerId - Answer ID
 * @param {string} questionTitle - Question title
 * @returns {Promise<Object>} Created notification
 */
const createAcceptNotification = async (answerOwnerId, accepterId, accepterUsername, questionId, answerId, questionTitle) => {
    // Don't notify if the answer owner is accepting their own answer
    if (answerOwnerId.toString() === accepterId.toString()) {
        return null;
    }

    return await createNotification({
        recipient: answerOwnerId,
        sender: accepterId,
        type: 'accept',
        question: questionId,
        answer: answerId,
        message: `${accepterUsername} accepted your answer on: "${questionTitle.substring(0, 50)}${questionTitle.length > 50 ? '...' : ''}"`,
    });
};

/**
 * Create a notification for when someone comments on an answer
 * @param {string} answerOwnerId - Answer owner's user ID
 * @param {string} commenterId - User ID of the commenter
 * @param {string} commenterUsername - Username of the commenter
 * @param {string} questionId - Question ID
 * @param {string} answerId - Answer ID
 * @returns {Promise<Object>} Created notification
 */
const createCommentNotification = async (answerOwnerId, commenterId, commenterUsername, questionId, answerId) => {
    // Don't notify if the answer owner is commenting on their own answer
    if (answerOwnerId.toString() === commenterId.toString()) {
        return null;
    }

    return await createNotification({
        recipient: answerOwnerId,
        sender: commenterId,
        type: 'comment',
        question: questionId,
        answer: answerId,
        message: `${commenterUsername} commented on your answer`,
    });
};

module.exports = {
    createNotification,
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    createAnswerNotification,
    createAcceptNotification,
    createCommentNotification
}; 