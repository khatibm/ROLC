import apiClient from './client';

export interface Branch {
  id: string;
  nameAr: string;
  parentBranchId?: string;
  children?: Branch[];
  _count?: { persons: number };
}

export const branchesApi = {
  getTree: () => apiClient.get<any, Branch[]>('/branches'),
  getById: (id: string) => apiClient.get<any, Branch>(`/branches/${id}`),
};
