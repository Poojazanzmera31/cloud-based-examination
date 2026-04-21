import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { examService } from '../../services/examService';
import { FiUsers, FiFileText, FiUserCheck, FiActivity } from 'react-icons/fi';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalExams: 0,
    totalResults: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const statsData = await examService.getStats();
      
      setStats({
        totalStudents: statsData.data.totalStudents || 0,
        totalFaculty: statsData.data.totalFaculty || 0,
        totalExams: statsData.data.totalExams || 0,
        totalResults: statsData.data.totalResults || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents, icon: FiUsers, color: 'bg-blue-500' },
    { label: 'Total Faculty', value: stats.totalFaculty, icon: FiUserCheck, color: 'bg-green-500' },
    { label: 'Total Exams', value: stats.totalExams, icon: FiFileText, color: 'bg-purple-500' },
    { label: 'Total Results', value: stats.totalResults, icon: FiActivity, color: 'bg-orange-500' },
  ];

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <DashboardLayout title="Admin Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="card card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/admin/users" className="btn-primary text-center">
            Manage Users
          </a>
          <a href="/admin/exams" className="btn-primary text-center">
            Manage Exams
          </a>
          <a href="/admin/results" className="btn-primary text-center">
            View All Results
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
