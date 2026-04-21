import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examService } from '../../services/examService';
import { resultService } from '../../services/resultService';
import { useTimer } from '../../hooks/useTimer';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import Notification from '../../components/Common/Notification';
import { FiAlertTriangle, FiCheck, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const TakeExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  // Helper function to show notifications
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Submit exam function (defined early for use in handleTimeUp)
  const submitExam = async () => {
    if (!exam) {
      showNotification('Exam data not loaded', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(
        ([questionId, selectedAnswer]) => ({
          questionId,
          selectedAnswer,
        })
      );

      await resultService.submitExam({
        examId: exam._id,
        answers: formattedAnswers,
      });

      showNotification('Exam submitted successfully!', 'success');
      navigate('/student/results');
    } catch (error) {
      console.error('Error submitting exam:', error);
      showNotification(error.response?.data?.message || 'Error submitting exam', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Timer handler
  const handleTimeUp = useCallback(() => {
    showNotification('Time is up! Auto-submitting your exam...', 'warning');
    setTimeout(() => {
      submitExam();
    }, 2000);
  }, [answers, exam]);

  // Timer hook - only initialize when exam is loaded
  const { timeLeft, formatTime, start } = useTimer(
    exam ? exam.duration * 60 : 0,
    handleTimeUp
  );

  // Fetch exam data
  useEffect(() => {
    fetchExam();
  }, [id]);

  // Start timer when exam loads
  useEffect(() => {
    if (exam) {
      start();
    }
  }, [exam]);

  // Tab switch detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            setShowWarning(true);
          }
          return newCount;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const fetchExam = async () => {
    try {
      console.log('Fetching exam with ID:', id);
      const response = await examService.getExamById(id);
      console.log('Exam response:', response);
      
      if (!response.data || !response.data.questions) {
        throw new Error('Invalid exam data structure');
      }
      
      // Randomize questions
      const randomizedQuestions = [...response.data.questions].sort(
        () => Math.random() - 0.5
      );
      
      console.log('Setting exam with', randomizedQuestions.length, 'questions');
      setExam({ ...response.data, questions: randomizedQuestions });
    } catch (error) {
      console.error('Error loading exam:', error);
      showNotification('Error loading exam: ' + (error.response?.data?.message || error.message), 'error');
      navigate('/student/exams');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, selectedAnswer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedAnswer,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < exam.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  if (loading || !exam) {
    return <LoadingSpinner fullScreen />;
  }

  if (!exam.questions || exam.questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="card text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No questions available in this exam</p>
          <button onClick={() => navigate('/student/exams')} className="btn-primary mt-4">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const question = exam.questions[currentQuestion];
  
  if (!question) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="card text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Question not found</p>
          <button onClick={() => navigate('/student/exams')} className="btn-primary mt-4">
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  const progress = ((currentQuestion + 1) / exam.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 text-red-600 mb-4">
              <FiAlertTriangle className="w-8 h-8" />
              <h3 className="text-xl font-bold">Warning!</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You have switched tabs {tabSwitchCount} times. Excessive tab switching
              may result in automatic submission of your exam.
            </p>
            <button
              onClick={() => setShowWarning(false)}
              className="btn-primary w-full"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {exam.title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Question {currentQuestion + 1} of {exam.questions.length}
              </p>
            </div>
            <div className="text-right">
              <div
                className={`text-2xl font-bold ${
                  timeLeft < 60 ? 'text-red-600' : 'text-primary-600'
                }`}
              >
                {formatTime(timeLeft)}
              </div>
              <p className="text-xs text-gray-500">Time Remaining</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {question.questionText}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(question._id, option)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                  answers[question._id] === option
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                }`}
              >
                <span className="font-medium text-gray-900 dark:text-white">
                  {option}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
          >
            <FiChevronLeft />
            <span>Previous</span>
          </button>

          {currentQuestion === exam.questions.length - 1 ? (
            <button
              onClick={submitExam}
              disabled={submitting}
              className="btn-primary flex items-center space-x-2"
            >
              <FiCheck />
              <span>{submitting ? 'Submitting...' : 'Submit Exam'}</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="btn-primary flex items-center space-x-2"
            >
              <span>Next</span>
              <FiChevronRight />
            </button>
          )}
        </div>

        {/* Question Navigator */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Question Navigator
          </h3>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {exam.questions.map((q, index) => (
              <button
                key={q._id}
                onClick={() => setCurrentQuestion(index)}
                className={`p-2 rounded-lg text-sm font-medium ${
                  index === currentQuestion
                    ? 'bg-primary-600 text-white'
                    : answers[q._id]
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeExam;
