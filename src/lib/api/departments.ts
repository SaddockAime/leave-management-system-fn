import { apiClient } from './client';
import type { ApiResponse, Department } from '@/types';

export const departmentsApi = {
  // Get all departments
  getAllDepartments: async (): Promise<ApiResponse<Department[]>> => {
    return apiClient.get<ApiResponse<Department[]>>('/departments');
  },

  // Get department by ID
  getDepartmentById: async (id: string): Promise<ApiResponse<Department>> => {
    return apiClient.get<ApiResponse<Department>>(`/departments/${id}`);
  },
};
