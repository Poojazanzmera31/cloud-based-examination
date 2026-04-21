import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { resultService } from '../../services/resultService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { FiCheck, FiX, FiClock } from 'react-icons/fi';

const StudentResults = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await resultService.getMyResults();
      setResults(response.data || []);
    } catch (error) {
      console.error('Error fetching results:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-600' };
    if (percentage >= 70) return { grade: 'B', color: 'text-blue-600' };
    if (percentage >= 60) return { grade: 'C', color: 'text-yellow-600' };
    if (percentage >= 50) return { grade: 'D', color: 'text-orange-600' };
    return { grade: 'F', color: 'text-red-600' };
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <DashboardLayout title="My Results">
      {results.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't taken any exams yet</p>
          <button onClick={() => navigate('/student/exams')} className="btn-primary">
            Browse Available Exams
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result) => {
            const percentage = result.percentage || 0;
            const { grade, color } = getGrade(percentage);
            const passed = percentage >= 50;

            return (
              <div key={result._id} className="card card-hover">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {result.examId?.title || 'Exam'}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Score</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {result.score}/{result.totalMarks}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Percentage</p>
                        <p className={`text-xl font-bold ${color}`}>
                          {percentage.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Grade</p>
                        <p className={`text-xl font-bold ${color}`}>{grade}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Status</p>
                        <div className="flex items-center mt-1">
                          {passed ? (
                            <FiCheck className="w-5 h-5 text-green-600 mr-1" />
                          ) : (
                            <FiX className="w-5 h-5 text-red-600 mr-1" />
                          )}
                          <span className={passed ? 'text-green-600' : 'text-red-600'}>
                            {passed ? 'Passed' : 'Failed'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <FiClock className="inline w-4 h-4 mr-1" />
                      {new Date(result.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {result.answers && result.answers.length > 0 && (
                  <details className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <summary className="cursor-pointer text-sm font-medium text-primary-600 hover:text-primary-700">
                      View Answers ({result.answers.length} questions)
                    </summary>
                    <div className="mt-4 space-y-3">
                      {result.answers.map((answer, index) => (
                        <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="font-medium text-gray-900 dark:text-white mb-2">
                            Q{index + 1}: {answer.questionText}
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Your Answer:</span>
                              <p className={answer.isCorrect ? 'text-green-600' : 'text-red-600'}>
                                {answer.selectedAnswer}
                              </p>
                            </div>
                            {!answer.isCorrect && (
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">Correct Answer:</span>
                                <p className="text-green-600">{answer.correctAnswer}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentResults;
