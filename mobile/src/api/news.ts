import apiClient from './client';

export interface NewsItem {
  id: string;
  titleAr: string;
  contentAr?: string;
  category: string;
  coverImageUrl?: string;
  galleryJson?: string[];
  publishedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export const newsApi = {
  getAll: (params?: { category?: string; q?: string; page?: number; limit?: number }) =>
    apiClient.get<any, PaginatedResponse<NewsItem>>('/news', { params }),

  getById: (id: string) => apiClient.get<any, NewsItem>(`/news/${id}`),

  getCategories: () => apiClient.get<any, { category: string; count: number }[]>('/news/categories'),
};
