const Answer = require('../models/Answer');
const Question = require('../models/Question');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Create a new answer
// @route   POST /api/questions/:questionId/answers
// @access  Private
const createAnswer = async (req, res) => {
    try {
        const { content } = req.body;
        const questionId = req.params.questionId;

        // Check if question exists
        const question = await Question.findById(questionId);
        if (!question) {
            res.status(404);
            throw new Error('Question not found');
        }

        // Create answer
        const answer = await Answer.create({
            content,
            user: req.user._id,
            question: questionId,
        });

        // Create notification for question owner if it's not the same user
        if (question.user.toString() !== req.user._id.toString()) {
            await Notification.create({
                recipient: question.user,
                sender: req.user._id,
                type: 'answer',
                question: questionId,
                answer: answer._id,
                message: `${req.user.username} answered your question: "${question.title.substring(0, 30)}${question.title.length > 30 ? '...' : ''}"`,
            });
        }

        // Populate user information
        const populatedAnswer = await Answer.findById(answer._id).populate('user', 'username avatar');

        res.status(201).json(populatedAnswer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all answers for a question
// @route   GET /api/questions/:questionId/answers
// @access  Public
const getAnswers = async (req, res) => {
    try {
        const questionId = req.params.questionId;

        // Check if question exists
        const question = await Question.findById(questionId);
        if (!question) {
            res.status(404);
            throw new Error('Question not found');
        }

        const answers = await Answer.find({ question: questionId })
            .populate('user', 'username avatar')
            .populate('upvotes', 'username avatar')  // Populate upvotes with user info
            .populate('downvotes', 'username avatar')  // Populate downvotes with user info
            .sort({ isAccepted: -1, voteCount: -1, createdAt: -1 });

        res.json(answers);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update an answer
// @route   PUT /api/answers/:id
// @access  Private
const updateAnswer = async (req, res) => {
    try {
        const { content } = req.body;
        const answerId = req.params.id;

        const answer = await Answer.findById(answerId);

        if (!answer) {
            res.status(404);
            throw new Error('Answer not found');
        }

        // Check if user is the owner of the answer
        if (answer.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this answer');
        }

        answer.content = content || answer.content;

        const updatedAnswer = await answer.save();

        // Populate user information
        const populatedAnswer = await Answer.findById(updatedAnswer._id).populate('user', 'username avatar');

        res.json(populatedAnswer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete an answer
// @route   DELETE /api/answers/:id
// @access  Private
const deleteAnswer = async (req, res) => {
    try {
        const answerId = req.params.id;
        const answer = await Answer.findById(answerId);

        if (!answer) {
            res.status(404);
            throw new Error('Answer not found');
        }

        // Check if user is the owner of the answer or an admin
        if (
            answer.user.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            res.status(401);
            throw new Error('Not authorized to delete this answer');
        }

        // If this answer was accepted, update the question
        if (answer.isAccepted) {
            const question = await Question.findById(answer.question);
            if (question) {
                question.acceptedAnswer = null;
                await question.save();
            }
        }

        await answer.remove();
        res.json({ message: 'Answer removed' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Vote on an answer
// @route   PUT /api/answers/:id/vote
// @access  Private
const voteAnswer = async (req, res) => {
    try {
        const { voteType } = req.body; // 'upvote' or 'downvote'
        const answerId = req.params.id;

        const answer = await Answer.findById(answerId);

        if (!answer) {
            res.status(404);
            throw new Error('Answer not found');
        }

        const upvoteExists = answer.upvotes.find(
            (upvote) => upvote.toString() === req.user._id.toString()
        );

        const downvoteExists = answer.downvotes.find(
            (downvote) => downvote.toString() === req.user._id.toString()
        );

        // Handle upvote
        if (voteType === 'upvote') {
            if (downvoteExists) {
                // Remove from downvotes if exists
                answer.downvotes = answer.downvotes.filter(
                    (downvote) => downvote.toString() !== req.user._id.toString()
                );
            }

            if (!upvoteExists) {
                answer.upvotes.push(req.user._id);
            } else {
                // Remove upvote if already voted (toggle)
                answer.upvotes = answer.upvotes.filter(
                    (upvote) => upvote.toString() !== req.user._id.toString()
                );
            }
        }

        // Handle downvote
        if (voteType === 'downvote') {
            if (upvoteExists) {
                // Remove from upvotes if exists
                answer.upvotes = answer.upvotes.filter(
                    (upvote) => upvote.toString() !== req.user._id.toString()
                );
            }

            if (!downvoteExists) {
                answer.downvotes.push(req.user._id);
            } else {
                // Remove downvote if already voted (toggle)
                answer.downvotes = answer.downvotes.filter(
                    (downvote) => downvote.toString() !== req.user._id.toString()
                );
            }
        }

        // Update vote count
        await answer.updateVoteCount();

        // Update user reputation
        const answerOwner = await User.findById(answer.user);
        if (answerOwner) {
            if (voteType === 'upvote' && !upvoteExists) {
                answerOwner.reputation += 10;
            } else if (voteType === 'downvote' && !downvoteExists) {
                answerOwner.reputation = Math.max(0, answerOwner.reputation - 2);
            }
            await answerOwner.save();
        }

        // Populate user information including upvotes and downvotes
        const updatedAnswer = await Answer.findById(answerId)
            .populate('user', 'username avatar')
            .populate('upvotes', 'username avatar')
            .populate('downvotes', 'username avatar');

        res.json(updatedAnswer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Accept an answer
// @route   PUT /api/answers/:id/accept
// @access  Private
const acceptAnswer = async (req, res) => {
    try {
        const answerId = req.params.id;
        const answer = await Answer.findById(answerId);

        if (!answer) {
            res.status(404);
            throw new Error('Answer not found');
        }

        // Get the question
        const question = await Question.findById(answer.question);

        if (!question) {
            res.status(404);
            throw new Error('Question not found');
        }

        // Check if user is the owner of the question
        if (question.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Only the question owner can accept an answer');
        }

        // If there was a previously accepted answer, unmark it
        if (question.acceptedAnswer) {
            const previousAnswer = await Answer.findById(question.acceptedAnswer);
            if (previousAnswer) {
                previousAnswer.isAccepted = false;
                await previousAnswer.save();
            }
        }

        // Mark this answer as accepted
        answer.isAccepted = true;
        await answer.save();

        // Update the question with the accepted answer
        question.acceptedAnswer = answerId;
        await question.save();

        // Add reputation to the answer owner
        const answerOwner = await User.findById(answer.user);
        if (answerOwner) {
            answerOwner.reputation += 15;
            await answerOwner.save();
        }

        // Create notification for answer owner if it's not the same user
        if (answer.user.toString() !== req.user._id.toString()) {
            await Notification.create({
                recipient: answer.user,
                sender: req.user._id,
                type: 'accept',
                question: question._id,
                answer: answer._id,
                message: `${req.user.username} accepted your answer on: "${question.title.substring(0, 30)}${question.title.length > 30 ? '...' : ''}"`,
            });
        }

        // Populate user information including upvotes and downvotes
        const populatedAnswer = await Answer.findById(answerId)
            .populate('user', 'username avatar')
            .populate('upvotes', 'username avatar')
            .populate('downvotes', 'username avatar');

        res.json(populatedAnswer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createAnswer,
    getAnswers,
    updateAnswer,
    deleteAnswer,
    voteAnswer,
    acceptAnswer,
}; 