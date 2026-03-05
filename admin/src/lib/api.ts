import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Inject JWT from localStorage on each request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(new Error(err.response?.data?.message || err.message));
  },
);

// ── Auth ──────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post<any, { access_token: string; admin: { id: string; email: string; name: string } }>(
      '/admin/auth/login',
      { email, password },
    ),
  me: () => api.get<any, { id: string; email: string; name: string }>('/api/admin/me'),
  dashboard: () => api.get<any, Record<string, any>>('/api/admin/dashboard'),
};

// ── News ──────────────────────────────────────────────────────────
export const newsApi = {
  getAll: (params?: Record<string, any>) => api.get<any, any>('/api/admin/news', { params }),
  getById: (id: string) => api.get<any, any>(`/api/admin/news/${id}`),
  create: (data: any) => api.post<any, any>('/api/admin/news', data),
  update: (id: string, data: any) => api.put<any, any>(`/api/admin/news/${id}`, data),
  remove: (id: string) => api.delete<any, any>(`/api/admin/news/${id}`),
};

// ── Events ────────────────────────────────────────────────────────
export const eventsApi = {
  getAll: (params?: Record<string, any>) => api.get<any, any>('/api/admin/events', { params }),
  getById: (id: string) => api.get<any, any>(`/api/admin/events/${id}`),
  create: (data: any) => api.post<any, any>('/api/admin/events', data),
  update: (id: string, data: any) => api.put<any, any>(`/api/admin/events/${id}`, data),
  remove: (id: string) => api.delete<any, any>(`/api/admin/events/${id}`),
};

// ── Branches ──────────────────────────────────────────────────────
export const branchesApi = {
  getAll: () => api.get<any, any>('/api/admin/branches'),
  getById: (id: string) => api.get<any, any>(`/api/admin/branches/${id}`),
  create: (data: any) => api.post<any, any>('/api/admin/branches', data),
  update: (id: string, data: any) => api.put<any, any>(`/api/admin/branches/${id}`, data),
  remove: (id: string) => api.delete<any, any>(`/api/admin/branches/${id}`),
};

// ── Persons ───────────────────────────────────────────────────────
export const personsApi = {
  getAll: (params?: Record<string, any>) => api.get<any, any>('/api/admin/persons', { params }),
  getById: (id: string) => api.get<any, any>(`/api/admin/persons/${id}`),
  create: (data: any) => api.post<any, any>('/api/admin/persons', data),
  update: (id: string, data: any) => api.put<any, any>(`/api/admin/persons/${id}`, data),
  remove: (id: string) => api.delete<any, any>(`/api/admin/persons/${id}`),
};

// ── Relationships ─────────────────────────────────────────────────
export const relsApi = {
  getAll: (personId?: string) => api.get<any, any>('/api/admin/relationships', { params: { personId } }),
  create: (data: any) => api.post<any, any>('/api/admin/relationships', data),
  updateStatus: (id: string, data: any) => api.patch<any, any>(`/api/admin/relationships/${id}/status`, data),
  remove: (id: string) => api.delete<any, any>(`/api/admin/relationships/${id}`),
};

// ── Tickets ───────────────────────────────────────────────────────
export const ticketsApi = {
  getAll: (params?: Record<string, any>) => api.get<any, any>('/api/admin/tickets', { params }),
  getById: (id: string) => api.get<any, any>(`/api/admin/tickets/${id}`),
  updateStatus: (id: string, data: any) => api.patch<any, any>(`/api/admin/tickets/${id}/status`, data),
};
