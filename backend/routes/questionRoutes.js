const express = require('express');
const router = express.Router();
const {
    createQuestion,
    getQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    voteQuestion,
} = require('../controllers/questionController');
const { protect } = require('../middlewares/authMiddleware');

// @route   POST /api/questions
router.post('/', protect, createQuestion);

// @route   GET /api/questions
router.get('/', getQuestions);

// @route   GET /api/questions/:id
router.get('/:id', getQuestionById);

// @route   PUT /api/questions/:id
router.put('/:id', protect, updateQuestion);

// @route   DELETE /api/questions/:id
router.delete('/:id', protect, deleteQuestion);

// @route   PUT /api/questions/:id/vote
router.put('/:id/vote', protect, voteQuestion);

module.exports = router; 