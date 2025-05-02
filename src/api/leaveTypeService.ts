import axios from '../utils/axiosConfig';

export const leaveTypeService = {
  /**
   * Get all leave types
   */
  async getLeaveTypes() {
    try {
      const response = await axios.get('/leave-types');
      return response.data;
    } catch (error) {
      console.error('Error fetching leave types:', error);
      throw error;
    }
  },
  
  /**
   * Get a specific leave type by ID
   */
  async getLeaveTypeById(id) {
    try {
      const response = await axios.get(`/leave-types/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching leave type ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new leave type (admin only)
   */
  async createLeaveType(data) {
    try {
      // Validate required fields
      if (!data.name || !data.description || data.accrualRate === undefined) {
        throw new Error('Missing required fields for leave type creation');
      }
      
      const response = await axios.post('/leave-types', data);
      return response.data;
    } catch (error) {
      console.error('Error creating leave type:', error);
      throw error;
    }
  },
  
  /**
   * Update a leave type (admin only)
   */
  async updateLeaveType(id, data) {
    try {
      // Validate required fields
      if (!data.name || !data.description || data.accrualRate === undefined) {
        throw new Error('Missing required fields for leave type update');
      }
      
      const response = await axios.put(`/leave-types/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating leave type ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete a leave type (admin only)
   */
  async deleteLeaveType(id) {
    try {
      const response = await axios.delete(`/leave-types/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting leave type ${id}:`, error);
      throw error;
    }
  }
};