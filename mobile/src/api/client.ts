import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ── Response interceptor for error normalization ───────────────
apiClient.interceptors.response.use(
  (res) => res.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'حدث خطأ غير متوقع';
    return Promise.reject(new Error(message));
  },
);

export default apiClient;
