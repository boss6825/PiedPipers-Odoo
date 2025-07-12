const Question = require('../models/Question');

/**
 * Create a new question
 * @param {Object} questionData - Question data
 * @returns {Promise<Object>} Created question
 */
const createQuestion = async (questionData) => {
    return await Question.create(questionData);
};

/**
 * Get all questions with pagination and filters
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Questions and pagination data
 */
const getQuestions = async (options) => {
    const {
        keyword = '',
        tag = '',
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = -1
    } = options;

    const keywordFilter = keyword
        ? {
            title: {
                $regex: keyword,
                $options: 'i',
            },
        }
        : {};

    const tagFilter = tag ? { tags: tag } : {};

    const count = await Question.countDocuments({ ...keywordFilter, ...tagFilter });

    const questions = await Question.find({ ...keywordFilter, ...tagFilter })
        .populate('user', 'username avatar')
        .sort({ [sortBy]: sortOrder })
        .limit(limit)
        .skip(limit * (page - 1));

    return {
        questions,
        page,
        pages: Math.ceil(count / limit),
        total: count,
    };
};

/**
 * Get question by ID with populated data
 * @param {string} id - Question ID
 * @returns {Promise<Object>} Question with populated data
 */
const getQuestionById = async (id) => {
    const question = await Question.findById(id)
        .populate('user', 'username avatar')
        .populate({
            path: 'answers',
            populate: {
                path: 'user',
                select: 'username avatar',
            },
            options: { sort: { isAccepted: -1, voteCount: -1 } },
        });

    if (question) {
        // Increment view count
        question.views += 1;
        await question.save();
    }

    return question;
};

/**
 * Update a question
 * @param {string} id - Question ID
 * @param {Object} updateData - Data to update
 * @param {string} userId - User ID making the update
 * @returns {Promise<Object>} Updated question
 */
const updateQuestion = async (id, updateData, userId) => {
    const question = await Question.findById(id);

    if (!question) {
        throw new Error('Question not found');
    }

    // Check if user is the owner of the question
    if (question.user.toString() !== userId.toString()) {
        throw new Error('Not authorized to update this question');
    }

    Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
            question[key] = updateData[key];
        }
    });

    return await question.save();
};

/**
 * Delete a question
 * @param {string} id - Question ID
 * @param {string} userId - User ID making the deletion
 * @param {boolean} isAdmin - Whether the user is an admin
 * @returns {Promise<boolean>} Success status
 */
const deleteQuestion = async (id, userId, isAdmin) => {
    const question = await Question.findById(id);

    if (!question) {
        throw new Error('Question not found');
    }

    // Check if user is the owner of the question or an admin
    if (
        question.user.toString() !== userId.toString() &&
        !isAdmin
    ) {
        throw new Error('Not authorized to delete this question');
    }

    await question.remove();
    return true;
};

module.exports = {
    createQuestion,
    getQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
}; 