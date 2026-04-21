import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { examService } from '../../services/examService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { FiPlus, FiFileText, FiUsers, FiAward } from 'react-icons/fi';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalExams: 0,
    totalStudents: 0,
    averageScore: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const statsData = await examService.getStats();

      setStats({
        totalExams: statsData.data.totalExams || 0,
        totalStudents: statsData.data.totalStudents || 0,
        averageScore: statsData.data.averageScore || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <DashboardLayout title="Faculty Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Exams</p>
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
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.totalStudents}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <FiUsers className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Average Score</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.averageScore}%
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <FiAward className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/faculty/create-exam')}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <FiPlus />
            <span>Create Exam</span>
          </button>
          <button
            onClick={() => navigate('/faculty/my-exams')}
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <FiFileText />
            <span>My Exams</span>
          </button>
          <button
            onClick={() => navigate('/faculty/results')}
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <FiAward />
            <span>View Results</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card mt-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          System Overview
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Total Exams Created</span>
            <span className="text-lg font-bold text-blue-600">{stats.totalExams}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Students Participated</span>
            <span className="text-lg font-bold text-green-600">{stats.totalStudents}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-300">Class Average Score</span>
            <span className="text-lg font-bold text-purple-600">{stats.averageScore}%</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyDashboard;
