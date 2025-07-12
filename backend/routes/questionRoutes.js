const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
    createQuestion,
    getQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    voteQuestion,
    addImage
} = require('../controllers/questionController');
const { protect } = require('../middlewares/authMiddleware');

// @route   POST /api/questions
router.post('/', protect, createQuestion);




// Memory storage for Multer (files will be stored in memory)

// file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', "Only images are allowed"));
        }
    },
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});


router.post('/image', upload.single('image'), protect,  addImage);
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