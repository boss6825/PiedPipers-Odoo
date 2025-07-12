const Answer = require('../models/Answer');
const Question = require('../models/Question');
const User = require('../models/User');
const Notification = require('../models/Notification');

/**
 * Create a new answer
 * @param {Object} answerData - Answer data
 * @param {string} questionId - Question ID
 * @param {string} userId - User ID
 * @param {string} username - Username for notification
 * @returns {Promise<Object>} Created answer
 */
const createAnswer = async (answerData, questionId, userId, username) => {
    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
        throw new Error('Question not found');
    }

    // Create answer
    const answer = await Answer.create({
        ...answerData,
        user: userId,
        question: questionId,
    });

    // Create notification for question owner if it's not the same user
    if (question.user.toString() !== userId.toString()) {
        await Notification.create({
            recipient: question.user,
            sender: userId,
            type: 'answer',
            question: questionId,
            answer: answer._id,
            message: `${username} answered your question: "${question.title.substring(0, 30)}${question.title.length > 30 ? '...' : ''}"`,
        });
    }

    // Populate user information
    return await Answer.findById(answer._id).populate('user', 'username avatar');
};

/**
 * Get all answers for a question
 * @param {string} questionId - Question ID
 * @returns {Promise<Array>} List of answers
 */
const getAnswers = async (questionId) => {
    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
        throw new Error('Question not found');
    }

    return await Answer.find({ question: questionId })
        .populate('user', 'username avatar')
        .sort({ isAccepted: -1, voteCount: -1, createdAt: -1 });
};

/**
 * Update an answer
 * @param {string} answerId - Answer ID
 * @param {Object} updateData - Data to update
 * @param {string} userId - User ID making the update
 * @returns {Promise<Object>} Updated answer
 */
const updateAnswer = async (answerId, updateData, userId) => {
    const answer = await Answer.findById(answerId);

    if (!answer) {
        throw new Error('Answer not found');
    }

    // Check if user is the owner of the answer
    if (answer.user.toString() !== userId.toString()) {
        throw new Error('Not authorized to update this answer');
    }

    Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
            answer[key] = updateData[key];
        }
    });

    const updatedAnswer = await answer.save();

    // Populate user information
    return await Answer.findById(updatedAnswer._id).populate('user', 'username avatar');
};

/**
 * Delete an answer
 * @param {string} answerId - Answer ID
 * @param {string} userId - User ID making the deletion
 * @param {boolean} isAdmin - Whether the user is an admin
 * @returns {Promise<boolean>} Success status
 */
const deleteAnswer = async (answerId, userId, isAdmin) => {
    const answer = await Answer.findById(answerId);

    if (!answer) {
        throw new Error('Answer not found');
    }

    // Check if user is the owner of the answer or an admin
    if (
        answer.user.toString() !== userId.toString() &&
        !isAdmin
    ) {
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
    return true;
};

/**
 * Accept an answer
 * @param {string} answerId - Answer ID
 * @param {string} userId - User ID accepting the answer
 * @param {string} username - Username for notification
 * @returns {Promise<Object>} Accepted answer
 */
const acceptAnswer = async (answerId, userId, username) => {
    const answer = await Answer.findById(answerId);

    if (!answer) {
        throw new Error('Answer not found');
    }

    // Get the question
    const question = await Question.findById(answer.question);

    if (!question) {
        throw new Error('Question not found');
    }

    // Check if user is the owner of the question
    if (question.user.toString() !== userId.toString()) {
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
    if (answer.user.toString() !== userId.toString()) {
        await Notification.create({
            recipient: answer.user,
            sender: userId,
            type: 'accept',
            question: question._id,
            answer: answer._id,
            message: `${username} accepted your answer on: "${question.title.substring(0, 30)}${question.title.length > 30 ? '...' : ''}"`,
        });
    }

    // Populate user information
    return await Answer.findById(answerId).populate('user', 'username avatar');
};

module.exports = {
    createAnswer,
    getAnswers,
    updateAnswer,
    deleteAnswer,
    acceptAnswer,
}; 