import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { examService } from '../../services/examService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import Notification from '../../components/Common/Notification';
import { FiEdit2, FiTrash2, FiClock, FiFileText } from 'react-icons/fi';

const MyExams = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await examService.getMyExams();
      console.log('Faculty my exams response:', response);
      setExams(response.data || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = async (examId) => {
    if (!window.confirm('Are you sure you want to delete this exam? This cannot be undone.')) return;

    try {
      await examService.deleteExam(examId);
      showNotification('Exam deleted successfully', 'success');
      fetchExams();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error deleting exam', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <DashboardLayout title="My Exams">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="mb-6">
        <button onClick={() => navigate('/faculty/create-exam')} className="btn-primary">
          Create New Exam
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <div key={exam._id} className="card card-hover">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1">
                {exam.title}
              </h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                exam.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {exam.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            {exam.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {exam.description}
              </p>
            )}

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <FiClock className="w-4 h-4 mr-2" />
                <span>{exam.duration} minutes</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <FiFileText className="w-4 h-4 mr-2" />
                <span>{exam.questions.length} questions</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Created: {new Date(exam.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/faculty/edit-exam/${exam._id}`)}
                className="btn-secondary flex-1 flex items-center justify-center space-x-2"
              >
                <FiEdit2 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(exam._id)}
                className="btn-danger flex items-center justify-center px-3"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {exams.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't created any exams yet</p>
          <button onClick={() => navigate('/faculty/create-exam')} className="btn-primary">
            Create Your First Exam
          </button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyExams;
