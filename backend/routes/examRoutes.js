const express = require('express');
const router = express.Router();
const {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  getMyExams,
  getStats,
} = require('../controllers/examController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validateExam } = require('../utils/validators');

// Public routes
router.get('/', getExams);

// Protected routes
router.use(protect);

// Stats route (MUST be before /:id route)
router.get('/stats', getStats);

// Faculty-only routes (MUST be before /:id route)
router.get('/faculty/my-exams', authorize('faculty', 'admin'), getMyExams);
router.post('/', authorize('faculty', 'admin'), validateExam, createExam);
router.put('/:id', authorize('faculty', 'admin'), updateExam);
router.delete('/:id', authorize('faculty', 'admin'), deleteExam);

// This MUST be last
router.get('/:id', getExamById);

module.exports = router;
