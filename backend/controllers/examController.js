const Exam = require('../models/Exam');
const Result = require('../models/Result');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Get all exams
// @route   GET /api/exams
// @access  Public
const getExams = asyncHandler(async (req, res) => {
  const { search, isActive, page = 1, limit = 10 } = req.query;

  // Build query
  let query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  // Pagination
  const skip = (page - 1) * limit;

  const exams = await Exam.find(query)
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Exam.countDocuments(query);

  res.json({
    success: true,
    count: exams.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: exams,
  });
});

// @desc    Get exam by ID
// @route   GET /api/exams/:id
// @access  Public
const getExamById = asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.id).populate(
    'createdBy',
    'name email'
  );

  if (!exam) {
    res.status(404);
    throw new Error('Exam not found');
  }

  res.json({
    success: true,
    data: exam,
  });
});

// @desc    Create exam
// @route   POST /api/exams
// @access  Private/Faculty
const createExam = asyncHandler(async (req, res) => {
  const { title, description, duration, questions } = req.body;

  const exam = await Exam.create({
    title,
    description,
    duration,
    questions,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    data: exam,
  });
});

// @desc    Update exam
// @route   PUT /api/exams/:id
// @access  Private/Faculty
const updateExam = asyncHandler(async (req, res) => {
  let exam = await Exam.findById(req.params.id);

  if (!exam) {
    res.status(404);
    throw new Error('Exam not found');
  }

  // Check if faculty owns the exam
  if (exam.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this exam');
  }

  const { title, description, duration, questions, isActive } = req.body;

  exam.title = title || exam.title;
  exam.description = description || exam.description;
  exam.duration = duration || exam.duration;
  exam.questions = questions || exam.questions;
  exam.isActive = isActive !== undefined ? isActive : exam.isActive;

  const updatedExam = await exam.save();

  res.json({
    success: true,
    data: updatedExam,
  });
});

// @desc    Delete exam
// @route   DELETE /api/exams/:id
// @access  Private/Faculty
const deleteExam = asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    res.status(404);
    throw new Error('Exam not found');
  }

  // Check if faculty owns the exam
  if (exam.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this exam');
  }

  await exam.deleteOne();

  res.json({
    success: true,
    message: 'Exam removed successfully',
  });
});

// @desc    Get exams by faculty
// @route   GET /api/exams/faculty/my-exams
// @access  Private/Faculty
const getMyExams = asyncHandler(async (req, res) => {
  const exams = await Exam.find({ createdBy: req.user._id })
    .sort({ createdAt: -1 })
    .populate('createdBy', 'name email');

  res.json({
    success: true,
    count: exams.length,
    data: exams,
  });
});

// @desc    Get dashboard statistics
// @route   GET /api/exams/stats
// @access  Private
const getStats = asyncHandler(async (req, res) => {
  const { role } = req.user;
  let stats = {};

  if (role === 'admin') {
    // Admin stats: all users, exams, results
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalFaculty = await User.countDocuments({ role: 'faculty' });
    const totalExams = await Exam.countDocuments();
    const totalResults = await Result.countDocuments();

    stats = {
      totalStudents,
      totalFaculty,
      totalExams,
      totalResults,
    };
  } else if (role === 'faculty') {
    // Faculty stats: their exams, students who took their exams, average scores
    const facultyExams = await Exam.find({ createdBy: req.user._id });
    const examIds = facultyExams.map(exam => exam._id);
    const totalExams = facultyExams.length;

    const results = await Result.find({ examId: { $in: examIds } });
    const totalStudents = new Set(results.map(r => r.studentId.toString())).size;
    
    const averageScore = results.length > 0
      ? results.reduce((sum, r) => sum + r.percentage, 0) / results.length
      : 0;

    stats = {
      totalExams,
      totalStudents,
      averageScore: averageScore.toFixed(2),
    };
  } else if (role === 'student') {
    // Student stats: available exams, completed exams, average score, pending exams
    const totalExams = await Exam.countDocuments({ isActive: true });
    const studentResults = await Result.find({ studentId: req.user._id });
    const completedExams = studentResults.length;

    const averageScore = studentResults.length > 0
      ? studentResults.reduce((sum, r) => sum + r.percentage, 0) / studentResults.length
      : 0;

    // Get exam IDs the student has already taken
    const completedExamIds = studentResults.map(r => r.examId.toString());
    const pendingExams = await Exam.countDocuments({
      isActive: true,
      _id: { $nin: completedExamIds },
    });

    stats = {
      totalExams,
      completedExams,
      averageScore: averageScore.toFixed(2),
      pendingExams,
    };
  }

  res.json({
    success: true,
    data: stats,
  });
});

module.exports = {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  getMyExams,
  getStats,
};
