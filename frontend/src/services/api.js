import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  login: async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    return res.data;
  },
};

export const dashboardAPI = {
  getSummary: async () => {
    const res = await api.get('/api/dashboard/summary');
    return res.data;
  },
};

export const scannerAPI = {
  uploadScan: async (formData) => {
    const res = await api.post('/api/scans/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};

export const damagesAPI = {
  getAll: async (params = {}) => {
    const res = await api.get('/api/damages', { params });
    return res.data;
  },
  getDetail: async (id) => {
    const res = await api.get(`/api/damages/${id}`);
    return res.data;
  },
  getMapMarkers: async () => {
    const res = await api.get('/api/map/damages');
    return res.data;
  },
};

export const priorityAPI = {
  getQueue: async () => {
    const res = await api.get('/api/priority');
    return res.data;
  },
  calculate: async (payload) => {
    const res = await api.post('/api/priority/calculate', payload);
    return res.data;
  },
};

export const analyticsAPI = {
  getSummary: async () => {
    const res = await api.get('/api/analytics/summary');
    return res.data;
  },
  getPrediction: async (roadName) => {
    const res = await api.get(`/api/prediction/${encodeURIComponent(roadName)}`);
    return res.data;
  },
};

export const maintenanceAPI = {
  getAll: async (status = null) => {
    const res = await api.get('/api/maintenance', { params: { status } });
    return res.data;
  },
  update: async (id, payload) => {
    const res = await api.put(`/api/maintenance/${id}`, payload);
    return res.data;
  },
};

export const reportsAPI = {
  getConditionReport: async () => {
    const res = await api.get('/api/reports/road-condition');
    return res.data;
  },
  getCSVUrl: () => `${API_BASE_URL}/api/reports/csv`,
};

export const demoAPI = {
  runJudgeDemo: async () => {
    const res = await api.post('/api/demo/judge-run');
    return res.data;
  },
  resetDemo: async () => {
    const res = await api.post('/api/system/reset-demo');
    return res.data;
  },
};

export default api;
