import { apiClient } from './client';
import type {
  ApiResponse,
  LeaveRequest,
  CreateLeaveRequestRequest,
  UpdateLeaveRequestRequest,
  ApproveLeaveRequest,
  RejectLeaveRequest,
  CancelLeaveRequest,
} from '@/types';

export const leaveRequestsApi = {
  // Get all leave requests (Admin/HR/Manager)
  getAllLeaveRequests: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    leaveTypeId?: string;
    year?: number;
  }): Promise<ApiResponse<LeaveRequest[]>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.leaveTypeId) queryParams.append('leaveTypeId', params.leaveTypeId);
    if (params?.year) queryParams.append('year', params.year.toString());

    const endpoint = `/leave-requests${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<ApiResponse<LeaveRequest[]>>(endpoint);
  },

  // Get my leave requests
  getMyLeaveRequests: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    leaveTypeId?: string;
    year?: number;
  }): Promise<ApiResponse<LeaveRequest[]>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.leaveTypeId) queryParams.append('leaveTypeId', params.leaveTypeId);
    if (params?.year) queryParams.append('year', params.year.toString());

    const endpoint = `/leave-requests/my-leaves${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiClient.get<ApiResponse<LeaveRequest[]>>(endpoint);
  },

  // Get leave request by ID
  getLeaveRequestById: async (id: string): Promise<ApiResponse<LeaveRequest>> => {
    return apiClient.get<ApiResponse<LeaveRequest>>(`/leave-requests/${id}`);
  },

  // Create leave request
  createLeaveRequest: async (
    data: CreateLeaveRequestRequest
  ): Promise<ApiResponse<LeaveRequest>> => {
    return apiClient.post<ApiResponse<LeaveRequest>>('/leave-requests', data);
  },

  // Update leave request
  updateLeaveRequest: async (
    id: string,
    data: UpdateLeaveRequestRequest
  ): Promise<ApiResponse<LeaveRequest>> => {
    return apiClient.put<ApiResponse<LeaveRequest>>(`/leave-requests/${id}`, data);
  },

  // Approve leave request
  approveLeaveRequest: async (
    id: string,
    data: ApproveLeaveRequest
  ): Promise<ApiResponse<LeaveRequest>> => {
    return apiClient.post<ApiResponse<LeaveRequest>>(`/leave-requests/${id}/approve`, data);
  },

  // Reject leave request
  rejectLeaveRequest: async (
    id: string,
    data: RejectLeaveRequest
  ): Promise<ApiResponse<LeaveRequest>> => {
    return apiClient.post<ApiResponse<LeaveRequest>>(`/leave-requests/${id}/reject`, data);
  },

  // Cancel leave request
  cancelLeaveRequest: async (
    id: string,
    data?: CancelLeaveRequest
  ): Promise<ApiResponse<LeaveRequest>> => {
    return apiClient.post<ApiResponse<LeaveRequest>>(`/leave-requests/${id}/cancel`, data || {});
  },
};
