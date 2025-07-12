const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['answer', 'comment', 'mention', 'accept'],
            required: true,
        },
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
        },
        answer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Answer',
        },
        read: {
            type: Boolean,
            default: false,
        },
        message: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Notification', NotificationSchema); 