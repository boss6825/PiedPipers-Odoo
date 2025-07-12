const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
            required: true,
        },
        upvotes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        downvotes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        isAccepted: {
            type: Boolean,
            default: false,
        },
        voteCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Method to calculate vote count
AnswerSchema.methods.updateVoteCount = function () {
    this.voteCount = this.upvotes.length - this.downvotes.length;
    return this.save();
};

module.exports = mongoose.model('Answer', AnswerSchema); 