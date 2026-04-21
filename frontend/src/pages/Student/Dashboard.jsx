import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { examService } from '../../services/examService';
import { resultService } from '../../services/resultService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { FiFileText, FiCheckCircle, FiClock, FiAward } from 'react-icons/fi';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalExams: 0,
    completedExams: 0,
    averageScore: 0,
    pendingExams: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const statsData = await examService.getStats();
      console.log('Student stats response:', statsData);

      setStats({
        totalExams: statsData.data.totalExams || 0,
        completedExams: statsData.data.completedExams || 0,
        averageScore: parseFloat(statsData.data.averageScore) || 0,
        pendingExams: statsData.data.pendingExams || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set default stats on error
      setStats({
        totalExams: 0,
        completedExams: 0,
        averageScore: 0,
        pendingExams: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <DashboardLayout title="Student Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Available Exams</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.totalExams}
              </p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <FiFileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.completedExams}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <FiCheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Average Score</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {parseFloat(stats.averageScore).toFixed(1)}%
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
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.pendingExams}
              </p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <FiClock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/student/exams')}
            className="btn-primary text-center py-4"
          >
            Browse Available Exams
          </button>
          <button
            onClick={() => navigate('/student/results')}
            className="btn-secondary text-center py-4"
          >
            View My Results
          </button>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="card mt-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Performance Summary
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Available Exams</span>
            <span className="text-lg font-bold text-blue-600">{stats.totalExams}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Pending Exams</span>
            <span className="text-lg font-bold text-orange-600">{stats.pendingExams}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Completed Exams</span>
            <span className="text-lg font-bold text-green-600">{stats.completedExams}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Average Score</span>
            <span className="text-lg font-bold text-purple-600">{parseFloat(stats.averageScore).toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
