import apiClient from './client';

export interface TreePerson {
  id: string;
  fullNameAr: string;
  gender: 'M' | 'F';
  photoUrl?: string;
  branchId?: string;
}

export interface TreeNode {
  node: TreePerson & { branch?: { id: string; nameAr: string }; bio?: string; city?: string; birthDate?: string; deathDate?: string };
  parents: TreePerson[];
  children: TreePerson[];
  spouses: TreePerson[];
}

export interface SubtreeNode extends TreePerson {
  children: SubtreeNode[];
}

export const treeApi = {
  getNode: (personId: string) => apiClient.get<any, TreeNode>(`/tree/node/${personId}`),

  search: (params: { q: string; branchId?: string }) =>
    apiClient.get<any, TreePerson[]>('/tree/search', { params }),

  getSubtree: (personId: string, maxDepth = 4) =>
    apiClient.get<any, SubtreeNode>(`/tree/subtree/${personId}`, { params: { maxDepth } }),

  getAncestors: (personId: string) =>
    apiClient.get<any, (TreePerson & { depth: number })[]>(`/tree/ancestors/${personId}`),
};
