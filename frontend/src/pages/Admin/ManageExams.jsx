import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { examService } from '../../services/examService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import Notification from '../../components/Common/Notification';
import { FiSearch, FiEye, FiTrash2, FiClock, FiFileText, FiUser } from 'react-icons/fi';

const ManageExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await examService.getExams({ limit: 1000 });
      console.log('Admin manage exams response:', response);
      setExams(response.data || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
      showNotification('Error fetching exams', 'error');
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = async (examId) => {
    if (!window.confirm('Are you sure you want to delete this exam? This action cannot be undone.')) return;

    try {
      await examService.deleteExam(examId);
      showNotification('Exam deleted successfully', 'success');
      fetchExams();
    } catch (error) {
      console.error('Error deleting exam:', error);
      showNotification(error.response?.data?.message || 'Error deleting exam', 'error');
    }
  };

  const handleToggleStatus = async (exam) => {
    try {
      await examService.updateExam(exam._id, { isActive: !exam.isActive });
      showNotification(`Exam ${exam.isActive ? 'deactivated' : 'activated'} successfully`, 'success');
      fetchExams();
    } catch (error) {
      console.error('Error updating exam:', error);
      showNotification(error.response?.data?.message || 'Error updating exam', 'error');
    }
  };

  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.createdBy?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'active' && exam.isActive) ||
      (filterStatus === 'inactive' && !exam.isActive);

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <DashboardLayout title="Manage Exams">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search exams by title, description, or creator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">All Exams</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Exams Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Title</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Created By</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Duration</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Questions</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Created</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExams.map((exam) => (
                <tr
                  key={exam._id}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{exam.title}</p>
                      {exam.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
                          {exam.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <FiUser className="w-4 h-4 mr-2" />
                      {exam.createdBy?.name || 'Unknown'}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <FiClock className="w-4 h-4 mr-2" />
                      {exam.duration} min
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <FiFileText className="w-4 h-4 mr-2" />
                      {exam.questions?.length || 0}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleStatus(exam)}
                      className={`px-3 py-1 text-xs font-semibold rounded-full cursor-pointer transition-colors ${
                        exam.isActive
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {exam.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(exam.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDelete(exam._id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        title="Delete Exam"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredExams.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {searchTerm || filterStatus !== 'all'
                ? 'No exams found matching your filters'
                : 'No exams have been created yet'}
            </p>
          </div>
        )}
      </div>

      {/* Summary */}
      {exams.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Exams</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{exams.length}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Exams</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {exams.filter((e) => e.isActive).length}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 dark:text-gray-400">Inactive Exams</p>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {exams.filter((e) => !e.isActive).length}
            </p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ManageExams;
