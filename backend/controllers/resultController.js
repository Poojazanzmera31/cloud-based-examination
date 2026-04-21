const Result = require('../models/Result');
const Exam = require('../models/Exam');
const asyncHandler = require('express-async-handler');

// @desc    Submit exam and calculate result
// @route   POST /api/results/submit
// @access  Private/Student
const submitExam = asyncHandler(async (req, res) => {
  const { examId, answers } = req.body;

  // Check if exam exists
  const exam = await Exam.findById(examId);

  if (!exam) {
    res.status(404);
    throw new Error('Exam not found');
  }

  // Check if student already submitted this exam
  const existingResult = await Result.findOne({
    studentId: req.user._id,
    examId,
  });

  if (existingResult) {
    res.status(400);
    throw new Error('You have already submitted this exam');
  }

  // Calculate score
  let score = 0;
  let totalMarks = 0;
  const evaluatedAnswers = [];

  for (const answer of answers) {
    const question = exam.questions.id(answer.questionId);

    if (question) {
      totalMarks += question.marks;
      const isCorrect = answer.selectedAnswer === question.correctAnswer;

      if (isCorrect) {
        score += question.marks;
      }

      evaluatedAnswers.push({
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
      });
    }
  }

  const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;

  // Create result
  const result = await Result.create({
    studentId: req.user._id,
    examId,
    score,
    totalMarks,
    percentage,
    answers: evaluatedAnswers,
  });

  res.status(201).json({
    success: true,
    data: result,
  });
});

// @desc    Get student's results
// @route   GET /api/results
// @access  Private/Student
const getStudentResults = asyncHandler(async (req, res) => {
  const results = await Result.find({ studentId: req.user._id })
    .populate('examId', 'title duration')
    .sort({ submittedAt: -1 });

  // Enrich results with question details for answer review
  const enrichedResults = await Promise.all(
    results.map(async (result) => {
      const exam = await Exam.findById(result.examId);
      const enrichedAnswers = result.answers.map((answer) => {
        const question = exam?.questions.id(answer.questionId);
        return {
          questionId: answer.questionId,
          questionText: question?.questionText || 'Question not found',
          selectedAnswer: answer.selectedAnswer,
          correctAnswer: question?.correctAnswer || 'N/A',
          isCorrect: answer.isCorrect,
          marks: question?.marks || 0,
        };
      });

      return {
        ...result.toObject(),
        answers: enrichedAnswers,
      };
    })
  );

  res.json({
    success: true,
    count: enrichedResults.length,
    data: enrichedResults,
  });
});

// @desc    Get results for a specific exam (Faculty/Admin)
// @route   GET /api/results/exam/:examId
// @access  Private/Faculty/Admin
const getExamResults = asyncHandler(async (req, res) => {
  const results = await Result.find({ examId: req.params.examId })
    .populate('studentId', 'name email')
    .sort({ submittedAt: -1 });

  // Calculate statistics
  const totalStudents = results.length;
  const averageScore =
    totalStudents > 0
      ? results.reduce((sum, r) => sum + r.percentage, 0) / totalStudents
      : 0;
  const highestScore =
    totalStudents > 0 ? Math.max(...results.map((r) => r.percentage)) : 0;
  const lowestScore =
    totalStudents > 0 ? Math.min(...results.map((r) => r.percentage)) : 0;
  const passedCount = results.filter((r) => r.percentage >= 50).length;
  const failedCount = totalStudents - passedCount;

  res.json({
    success: true,
    count: results.length,
    statistics: {
      totalStudents,
      averageScore: averageScore.toFixed(2),
      highestScore: highestScore.toFixed(2),
      lowestScore: lowestScore.toFixed(2),
      passedCount,
      failedCount,
      passRate: totalStudents > 0 ? ((passedCount / totalStudents) * 100).toFixed(2) : 0,
    },
    data: results,
  });
});

// @desc    Get all results for faculty's exams
// @route   GET /api/results/faculty
// @access  Private/Faculty
const getFacultyResults = asyncHandler(async (req, res) => {
  // Get all exams created by this faculty
  const facultyExams = await Exam.find({ createdBy: req.user._id });
  const examIds = facultyExams.map(exam => exam._id);

  // Get all results for these exams
  const results = await Result.find({ examId: { $in: examIds } })
    .populate('studentId', 'name email')
    .populate('examId', 'title duration')
    .sort({ submittedAt: -1 });

  // Enrich results with question details
  const enrichedResults = await Promise.all(
    results.map(async (result) => {
      const exam = facultyExams.find(e => e._id.toString() === result.examId._id.toString());
      const enrichedAnswers = result.answers.map((answer) => {
        const question = exam?.questions.id(answer.questionId);
        return {
          questionId: answer.questionId,
          questionText: question?.questionText || 'Question not found',
          selectedAnswer: answer.selectedAnswer,
          correctAnswer: question?.correctAnswer || 'N/A',
          isCorrect: answer.isCorrect,
        };
      });

      return {
        ...result.toObject(),
        answers: enrichedAnswers,
      };
    })
  );

  res.json({
    success: true,
    count: enrichedResults.length,
    data: enrichedResults,
  });
});

// @desc    Get single result
// @route   GET /api/results/:id
// @access  Private
const getResultById = asyncHandler(async (req, res) => {
  const result = await Result.findById(req.params.id)
    .populate('examId', 'title duration')
    .populate('studentId', 'name email');

  if (!result) {
    res.status(404);
    throw new Error('Result not found');
  }

  // Students can only view their own results
  if (
    req.user.role === 'student' &&
    result.studentId._id.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to view this result');
  }

  // Enrich with question details
  const exam = await Exam.findById(result.examId);
  const enrichedAnswers = result.answers.map((answer) => {
    const question = exam?.questions.id(answer.questionId);
    return {
      questionId: answer.questionId,
      questionText: question?.questionText || 'Question not found',
      selectedAnswer: answer.selectedAnswer,
      correctAnswer: question?.correctAnswer || 'N/A',
      isCorrect: answer.isCorrect,
      marks: question?.marks || 0,
    };
  });

  const enrichedResult = {
    ...result.toObject(),
    answers: enrichedAnswers,
  };

  res.json({
    success: true,
    data: enrichedResult,
  });
});

// @desc    Get all results (Admin only)
// @route   GET /api/results/admin/all
// @access  Private/Admin
const getAllResults = asyncHandler(async (req, res) => {
  const results = await Result.find({})
    .populate('studentId', 'name email')
    .populate('examId', 'title duration')
    .sort({ submittedAt: -1 });

  // Calculate overall statistics
  const totalResults = results.length;
  const averageScore =
    totalResults > 0
      ? results.reduce((sum, r) => sum + r.percentage, 0) / totalResults
      : 0;
  const passedCount = results.filter((r) => r.percentage >= 50).length;
  const failedCount = totalResults - passedCount;

  res.json({
    success: true,
    count: results.length,
    statistics: {
      totalResults,
      averageScore: averageScore.toFixed(2),
      passedCount,
      failedCount,
      passRate: totalResults > 0 ? ((passedCount / totalResults) * 100).toFixed(2) : 0,
    },
    data: results,
  });
});

module.exports = {
  submitExam,
  getStudentResults,
  getExamResults,
  getFacultyResults,
  getResultById,
  getAllResults,
};
