import api from './api';

export const resultService = {
  // Submit exam
  submitExam: async (resultData) => {
    const response = await api.post('/results/submit', resultData);
    return response.data;
  },

  // Get student's results
  getMyResults: async () => {
    const response = await api.get('/results');
    return response.data;
  },

  // Get all results (Admin only)
  getAllResults: async () => {
    const response = await api.get('/results/admin/all');
    return response.data;
  },

  // Get exam results with statistics (Faculty/Admin)
  getExamResults: async (examId) => {
    const response = await api.get(`/results/exam/${examId}`);
    return response.data;
  },

  // Get all results for faculty
  getFacultyResults: async () => {
    const response = await api.get('/results/faculty');
    return response.data;
  },

  // Get single result
  getResultById: async (id) => {
    const response = await api.get(`/results/${id}`);
    return response.data;
  },
};
