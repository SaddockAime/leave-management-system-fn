import axios from '../utils/axiosConfig';
import { dateUtils } from '../utils/dateUtils';

export const leaveRequestService = {
  /**
   * Get current user's leave requests
   */
  async getMyLeaveRequests() {
    try {
      const response = await axios.get('/leave-requests/my-leaves');
      return response.data;
    } catch (error) {
      console.error('Error fetching my leave requests:', error);
      throw error;
    }
  },
  
  /**
   * Get all leave requests (admin only)
   */
  async getAllLeaveRequests() {
    try {
      const response = await axios.get('/leave-requests/admin/all-leaves');
      return response.data;
    } catch (error) {
      console.error('Error fetching all leave requests:', error);
      throw error;
    }
  },
  
  /**
   * Get leave requests for a specific department
   */
  async getDepartmentLeaveRequests(departmentId) {
    try {
      const response = await axios.get(`/leave-requests/department/${departmentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching department ${departmentId} leave requests:`, error);
      throw error;
    }
  },
  
  /**
   * Get leave requests for team members (manager only)
   */
  async getTeamLeaveRequests() {
    try {
      const response = await axios.get('/leave-requests/team-leaves');
      return response.data;
    } catch (error) {
      console.error('Error fetching team leave requests:', error);
      throw error;
    }
  },
  
  /**
   * Get a specific leave request by ID
   */
  async getLeaveRequestById(id) {
    try {
      const response = await axios.get(`/leave-requests/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching leave request ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new leave request
   */
  async createLeaveRequest(data) {
    try {
      // Format dates properly for API
      const formattedData = {
        ...data,
        startDate: dateUtils.formatDateForApi(data.startDate),
        endDate: dateUtils.formatDateForApi(data.endDate)
      };
      
      const response = await axios.post('/leave-requests', formattedData);
      return response.data;
    } catch (error) {
      console.error('Error creating leave request:', error);
      throw error;
    }
  },
  
  /**
   * Approve a leave request (manager or admin only)
   */
  async approveLeaveRequest(id, comments = '') {
    try {
      const response = await axios.put(`/leave-requests/${id}/approve`, { comments });
      return response.data;
    } catch (error) {
      console.error(`Error approving leave request ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Reject a leave request (manager or admin only)
   */
  async rejectLeaveRequest(id, comments) {
    try {
      if (!comments) {
        throw new Error('Comments are required when rejecting a leave request');
      }
      const response = await axios.put(`/leave-requests/${id}/reject`, { comments });
      return response.data;
    } catch (error) {
      console.error(`Error rejecting leave request ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Cancel a leave request
   */
  async cancelLeaveRequest(id) {
    try {
      const response = await axios.put(`/leave-requests/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error(`Error canceling leave request ${id}:`, error);
      throw error;
    }
  }
};