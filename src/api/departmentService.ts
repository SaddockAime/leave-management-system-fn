import axios from '../utils/axiosConfig';

export const departmentService = {
  /**
   * Get all departments
   */
  async getDepartments() {
    try {
      const response = await axios.get('/departments');
      return response.data;
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  },
  
  /**
   * Get a specific department by ID
   */
  async getDepartmentById(id) {
    try {
      const response = await axios.get(`/departments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching department ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new department (admin only)
   */
  async createDepartment(data) {
    try {
      const response = await axios.post('/departments', data);
      return response.data;
    } catch (error) {
      console.error('Error creating department:', error);
      throw error;
    }
  },
  
  /**
   * Update a department (admin only)
   */
  async updateDepartment(id, data) {
    try {
      const response = await axios.put(`/departments/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating department ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete a department (admin only)
   */
  async deleteDepartment(id) {
    try {
      const response = await axios.delete(`/departments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting department ${id}:`, error);
      throw error;
    }
  }
};