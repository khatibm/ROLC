import apiClient from './client';
import { PaginatedResponse } from './news';

export interface EventItem {
  id: string;
  titleAr: string;
  descriptionAr: string;
  startAt: string;
  endAt: string;
  city?: string;
  locationText?: string;
  mapUrl?: string;
  contactName?: string;
  contactPhone?: string;
}

export const eventsApi = {
  getAll: (params?: { from?: string; to?: string; city?: string; page?: number }) =>
    apiClient.get<any, PaginatedResponse<EventItem>>('/events', { params }),

  getById: (id: string) => apiClient.get<any, EventItem>(`/events/${id}`),
};
