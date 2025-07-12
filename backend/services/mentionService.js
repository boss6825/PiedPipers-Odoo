const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendNotificationToUser } = require('../utils/socket');

/**
 * Extract user mentions from text
 * @param {string} text - Text to extract mentions from
 * @returns {Array} Array of usernames mentioned
 */
const extractMentions = (text) => {
    if (!text) return [];

    const mentionRegex = /@([a-zA-Z0-9_]+)/g;
    const matches = text.match(mentionRegex);

    if (!matches) return [];

    // Remove @ symbol from matches
    return matches.map(mention => mention.substring(1));
};

/**
 * Process mentions in text and create notifications
 * @param {string} text - Text containing mentions
 * @param {string} senderId - User ID of the sender
 * @param {string} senderUsername - Username of the sender
 * @param {string} questionId - Question ID (optional)
 * @param {string} answerId - Answer ID (optional)
 * @param {string} contentType - Type of content ('question' or 'answer')
 * @returns {Promise<Array>} Array of created notifications
 */
const processMentions = async (text, senderId, senderUsername, questionId, answerId, contentType) => {
    try {
        const mentionedUsernames = extractMentions(text);

        if (mentionedUsernames.length === 0) {
            return [];
        }

        // Find users by usernames
        const mentionedUsers = await User.find({
            username: { $in: mentionedUsernames },
            _id: { $ne: senderId } // Don't notify the sender if they mention themselves
        });

        if (mentionedUsers.length === 0) {
            return [];
        }

        const notifications = [];

        // Create a notification for each mentioned user
        for (const user of mentionedUsers) {
            const contentTypeText = contentType === 'question' ? 'question' : 'answer';

            const notification = await Notification.create({
                recipient: user._id,
                sender: senderId,
                type: 'mention',
                question: questionId,
                answer: answerId,
                message: `${senderUsername} mentioned you in a ${contentTypeText}: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`,
            });

            // Populate sender information for real-time notification
            const populatedNotification = await Notification.findById(notification._id)
                .populate('sender', 'username avatar')
                .populate('question', 'title');

            // Send real-time notification
            sendNotificationToUser(user._id.toString(), populatedNotification);

            notifications.push(notification);
        }

        return notifications;
    } catch (error) {
        console.error('Error processing mentions:', error);
        return [];
    }
};

module.exports = {
    extractMentions,
    processMentions
}; 