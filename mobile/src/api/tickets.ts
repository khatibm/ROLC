import apiClient from './client';

export interface CreateTicketPayload {
  type: 'SUGGESTION' | 'COMPLAINT';
  title: string;
  message: string;
  contactPhone?: string;
  contactEmail?: string;
  attachment?: { uri: string; name: string; type: string };
}

export interface TicketResponse {
  ticketNumber: string;
  ticket: { id: string; type: string; status: string; createdAt: string };
}

export const ticketsApi = {
  create: async (payload: CreateTicketPayload): Promise<TicketResponse> => {
    const formData = new FormData();
    formData.append('type', payload.type);
    formData.append('title', payload.title);
    formData.append('message', payload.message);
    if (payload.contactPhone) formData.append('contactPhone', payload.contactPhone);
    if (payload.contactEmail) formData.append('contactEmail', payload.contactEmail);
    if (payload.attachment) {
      formData.append('attachment', {
        uri: payload.attachment.uri,
        name: payload.attachment.name,
        type: payload.attachment.type,
      } as any);
    }
    return apiClient.post('/tickets', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
