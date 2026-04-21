import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { resultService } from '../../services/resultService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { FiCheck, FiX, FiAward, FiUsers } from 'react-icons/fi';

const AdminResults = () => {
  const [results, setResults] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await resultService.getAllResults();
      setResults(response.data || []);
      setStatistics(response.statistics || {});
    } catch (error) {
      console.error('Error fetching results:', error);
      setResults([]);
      setStatistics({});
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = results.filter((result) => {
    const percentage = result.percentage || 0;
    if (filterStatus === 'passed') return percentage >= 50;
    if (filterStatus === 'failed') return percentage < 50;
    return true;
  });

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <DashboardLayout title="All Results">
      {/* Statistics Cards */}
      {statistics.totalResults > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Results</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {statistics.totalResults}
                </p>
              </div>
              <div className="bg-blue-500 p-3 rounded-lg">
                <FiAward className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="card card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average Score</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {statistics.averageScore}%
                </p>
              </div>
              <div className="bg-purple-500 p-3 rounded-lg">
                <FiAward className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="card card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Passed</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {statistics.passedCount}
                </p>
              </div>
              <div className="bg-green-500 p-3 rounded-lg">
                <FiCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="card card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Failed</p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {statistics.failedCount}
                </p>
              </div>
              <div className="bg-red-500 p-3 rounded-lg">
                <FiX className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Student Results
          </h2>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field"
          >
            <option value="all">All Results</option>
            <option value="passed">Passed Only</option>
            <option value="failed">Failed Only</option>
          </select>
        </div>
      </div>

      {/* Results Table */}
      <div className="card">
        {filteredResults.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No results found
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Student</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Exam</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Score</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Percentage</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((result) => {
                  const percentage = result.percentage || 0;
                  const passed = percentage >= 50;

                  return (
                    <tr
                      key={result._id}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {result.studentId?.name || 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {result.studentId?.email || ''}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                        {result.examId?.title || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                        {result.score}/{result.totalMarks}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-sm font-bold ${
                            percentage >= 80
                              ? 'text-green-600'
                              : percentage >= 60
                              ? 'text-blue-600'
                              : percentage >= 50
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        >
                          {percentage.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {passed ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
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

export default AdminResults;
