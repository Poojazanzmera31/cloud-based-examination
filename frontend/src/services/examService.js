import api from './api';

export const examService = {
  // Get all exams with pagination and search
  getExams: async (params = {}) => {
    const response = await api.get('/exams', { params });
    return response.data;
  },

  // Get exam by ID
  getExamById: async (id) => {
    const response = await api.get(`/exams/${id}`);
    return response.data;
  },

  // Create exam (Faculty/Admin)
  createExam: async (examData) => {
    const response = await api.post('/exams', examData);
    return response.data;
  },

  // Update exam (Faculty/Admin)
  updateExam: async (id, examData) => {
    const response = await api.put(`/exams/${id}`, examData);
    return response.data;
  },

  // Delete exam (Faculty/Admin)
  deleteExam: async (id) => {
    const response = await api.delete(`/exams/${id}`);
    return response.data;
  },

  // Get faculty's exams
  getMyExams: async () => {
    const response = await api.get('/exams/faculty/my-exams');
    return response.data;
  },

  // Get dashboard statistics
  getStats: async () => {
    const response = await api.get('/exams/stats');
    return response.data;
  },
};
