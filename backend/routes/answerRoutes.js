const express = require('express');
const router = express.Router();
const {
    createAnswer,
    getAnswers,
    updateAnswer,
    deleteAnswer,
    voteAnswer,
    acceptAnswer,
} = require('../controllers/answerController');
const { protect } = require('../middlewares/authMiddleware');

// Question-specific answer routes
// @route   POST /api/questions/:questionId/answers
router.post('/questions/:questionId/answers', protect, createAnswer);

// @route   GET /api/questions/:questionId/answers
router.get('/questions/:questionId/answers', getAnswers);

// Answer-specific routes
// @route   PUT /api/answers/:id
router.put('/answers/:id', protect, updateAnswer);

// @route   DELETE /api/answers/:id
router.delete('/answers/:id', protect, deleteAnswer);

// @route   PUT /api/answers/:id/vote
router.put('/answers/:id/vote', protect, voteAnswer);

// @route   PUT /api/answers/:id/accept
router.put('/answers/:id/accept', protect, acceptAnswer);

module.exports = router; 