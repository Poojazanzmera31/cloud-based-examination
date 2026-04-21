import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { examService } from '../../services/examService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import Notification from '../../components/Common/Notification';
import { FiPlus, FiTrash2, FiArrowLeft } from 'react-icons/fi';

const CreateExam = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    duration: 60,
    questions: [],
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    marks: 1,
  });

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddQuestion = () => {
    if (!currentQuestion.questionText.trim()) {
      showNotification('Please enter question text', 'error');
      return;
    }
    if (currentQuestion.options.some(opt => !opt.trim())) {
      showNotification('Please fill all 4 options', 'error');
      return;
    }
    if (!currentQuestion.correctAnswer) {
      showNotification('Please select the correct answer', 'error');
      return;
    }

    setExamData({
      ...examData,
      questions: [...examData.questions, { ...currentQuestion }],
    });
    setCurrentQuestion({
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      marks: 1,
    });
    showNotification('Question added successfully', 'success');
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = examData.questions.filter((_, i) => i !== index);
    setExamData({ ...examData, questions: updatedQuestions });
    showNotification('Question removed', 'success');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (examData.questions.length === 0) {
      showNotification('Please add at least one question', 'error');
      return;
    }

    setLoading(true);
    try {
      await examService.createExam(examData);
      showNotification('Exam created successfully!', 'success');
      setTimeout(() => navigate('/faculty/my-exams'), 1500);
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error creating exam', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <DashboardLayout title="Create Exam">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Exam Details */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Exam Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Exam Title *
              </label>
              <input
                type="text"
                value={examData.title}
                onChange={(e) => setExamData({ ...examData, title: e.target.value })}
                className="input-field"
                placeholder="e.g., Mathematics Final Exam"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration (minutes) *
              </label>
              <input
                type="number"
                value={examData.duration}
                onChange={(e) => setExamData({ ...examData, duration: parseInt(e.target.value) })}
                className="input-field"
                min="1"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={examData.description}
                onChange={(e) => setExamData({ ...examData, description: e.target.value })}
                className="input-field"
                rows="3"
                placeholder="Exam description (optional)"
              />
            </div>
          </div>
        </div>

        {/* Add Question */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Question</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Question Text *
              </label>
              <textarea
                value={currentQuestion.questionText}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionText: e.target.value })}
                className="input-field"
                rows="2"
                placeholder="Enter your question"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Option {index + 1} *
                  </label>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...currentQuestion.options];
                      newOptions[index] = e.target.value;
                      setCurrentQuestion({ ...currentQuestion, options: newOptions });
                    }}
                    className="input-field"
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Correct Answer *
                </label>
                <select
                  value={currentQuestion.correctAnswer}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select correct answer</option>
                  {currentQuestion.options.map((option, index) => (
                    option && <option key={index} value={option}>Option {index + 1}: {option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Marks
                </label>
                <input
                  type="number"
                  value={currentQuestion.marks}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, marks: parseInt(e.target.value) })}
                  className="input-field"
                  min="1"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddQuestion}
              className="btn-primary flex items-center space-x-2"
            >
              <FiPlus />
              <span>Add Question</span>
            </button>
          </div>
        </div>

        {/* Questions List */}
        {examData.questions.length > 0 && (
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Questions ({examData.questions.length})
            </h3>
            <div className="space-y-3">
              {examData.questions.map((q, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        Q{index + 1}: {q.questionText}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Marks: {q.marks} | Correct: {q.correctAnswer}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(index)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex space-x-3">
          <button type="submit" className="btn-primary flex-1">
            Create Exam
          </button>
          <button
            type="button"
            onClick={() => navigate('/faculty/my-exams')}
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <FiArrowLeft />
            <span>Back</span>
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default CreateExam;
