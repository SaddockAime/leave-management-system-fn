import { apiClient } from './client';
import type { ApiResponse, Employee, CreateEmployeeRequest, UpdateEmployeeRequest } from '@/types';

export const employeesApi = {
  // Get all employees
  getAllEmployees: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    departmentId?: string;
    position?: string;
    status?: string;
  }): Promise<ApiResponse<Employee[]>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.departmentId) queryParams.append('departmentId', params.departmentId);
    if (params?.position) queryParams.append('position', params.position);
    if (params?.status) queryParams.append('status', params.status);

    const endpoint = `/employees${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<ApiResponse<Employee[]>>(endpoint);
  },

  // Get employee by ID
  getEmployeeById: async (id: string): Promise<ApiResponse<Employee>> => {
    return apiClient.get<ApiResponse<Employee>>(`/employees/${id}`);
  },

  // Create employee profile
  createEmployee: async (data: CreateEmployeeRequest): Promise<ApiResponse<Employee>> => {
    return apiClient.post<ApiResponse<Employee>>('/employees', data);
  },

  // Update employee
  updateEmployee: async (
    id: string,
    data: UpdateEmployeeRequest
  ): Promise<ApiResponse<Employee>> => {
    return apiClient.put<ApiResponse<Employee>>(`/employees/${id}`, data);
  },
};
