const express = require('express');
const router = express.Router();
const {
  submitExam,
  getStudentResults,
  getExamResults,
  getFacultyResults,
  getResultById,
  getAllResults,
} = require('../controllers/resultController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All routes are protected
router.use(protect);

// Student routes
router.post('/submit', authorize('student'), submitExam);
router.get('/', authorize('student'), getStudentResults);

// Faculty routes
router.get('/faculty', authorize('faculty'), getFacultyResults);
router.get('/exam/:examId', authorize('faculty', 'admin'), getExamResults);

// Admin routes
router.get('/admin/all', authorize('admin'), getAllResults);

// Common route
router.get('/:id', getResultById);

module.exports = router;
