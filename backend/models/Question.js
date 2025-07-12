const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        tags: [
            {
                type: String,
                required: true,
            },
        ],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
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
        acceptedAnswer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Answer',
            default: null,
        },
        views: {
            type: Number,
            default: 0,
        },
        voteCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual for answers
QuestionSchema.virtual('answers', {
    ref: 'Answer',
    localField: '_id',
    foreignField: 'question',
});

// Method to calculate vote count
QuestionSchema.methods.updateVoteCount = function () {
    this.voteCount = this.upvotes.length - this.downvotes.length;
    return this.save();
};

module.exports = mongoose.model('Question', QuestionSchema); 