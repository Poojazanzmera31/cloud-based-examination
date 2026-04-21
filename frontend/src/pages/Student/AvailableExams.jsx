import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { examService } from '../../services/examService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { FiClock, FiFileText, FiPlay } from 'react-icons/fi';

const AvailableExams = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await examService.getExams({ isActive: true, limit: 100 });
      console.log('Available exams response:', response);
      setExams(response.data || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredExams = exams.filter(
    (exam) =>
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <DashboardLayout title="Available Exams">
      {/* Search */}
      <div className="card mb-6">
        <input
          type="text"
          placeholder="Search exams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field"
        />
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.map((exam) => (
          <div key={exam._id} className="card card-hover">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1">
                {exam.title}
              </h3>
              <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                Active
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
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span>Total Marks: {exam.questions.reduce((sum, q) => sum + q.marks, 0)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/student/exam/${exam._id}`)}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <FiPlay />
              <span>Start Exam</span>
            </button>
          </div>
        ))}
      </div>

      {filteredExams.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm ? 'No exams found matching your search' : 'No exams available at the moment'}
          </p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AvailableExams;
