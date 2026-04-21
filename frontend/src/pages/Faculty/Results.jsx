import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { resultService } from '../../services/resultService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const FacultyResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState('');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await resultService.getFacultyResults();
      setResults(response.data || []);
    } catch (error) {
      console.error('Error fetching results:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <DashboardLayout title="Student Results">
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          All Student Results
        </h2>
        
        {results.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No results available yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4">Student</th>
                  <th className="text-left py-3 px-4">Exam</th>
                  <th className="text-left py-3 px-4">Score</th>
                  <th className="text-left py-3 px-4">Percentage</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => {
                  const percentage = result.percentage || 0;
                  const passed = percentage >= 50;

                  return (
                    <tr key={result._id} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-3 px-4">{result.studentId?.name || 'N/A'}</td>
                      <td className="py-3 px-4">{result.examId?.title || 'N/A'}</td>
                      <td className="py-3 px-4">{result.score}/{result.totalMarks}</td>
                      <td className="py-3 px-4">{percentage.toFixed(1)}%</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {passed ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(result.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FacultyResults;
