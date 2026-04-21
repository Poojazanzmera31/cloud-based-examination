const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'Please add question text'],
    trim: true,
  },
  options: {
    type: [String],
    required: [true, 'Please add options'],
    validate: {
      validator: function (options) {
        return options.length === 4; // Exactly 4 options
      },
      message: 'Each question must have exactly 4 options',
    },
  },
  correctAnswer: {
    type: String,
    required: [true, 'Please add the correct answer'],
  },
  marks: {
    type: Number,
    default: 1,
    min: [1, 'Marks must be at least 1'],
  },
});

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an exam title'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Please add exam duration'],
    min: [1, 'Duration must be at least 1 minute'],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  questions: [questionSchema],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
examSchema.index({ createdBy: 1, isActive: 1 });

module.exports = mongoose.model('Exam', examSchema);
