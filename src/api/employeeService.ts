import axios from '../utils/axiosConfig';
import { dateUtils } from '../utils/dateUtils';

export const employeeService = {
  /**
   * Onboard an employee profile for the authenticated user
   */
  async onboardSelf(data) {
    try {
      // Format date properly if provided
      const formattedData = {
        ...data,
        hireDate: data.hireDate ? dateUtils.formatDateForApi(data.hireDate) : undefined
      };
      
      const response = await axios.post('/employees/onboard', formattedData);
      return response.data;
    } catch (error) {
      console.error('Error onboarding employee:', error);
      throw error;
    }
  },
  
  /**
   * Get all employees (manager or admin only)
   */
  async getAllEmployees() {
    try {
      const response = await axios.get('/employees');
      return response.data;
    } catch (error) {
      console.error('Error fetching all employees:', error);
      throw error;
    }
  },
  
  /**
   * Get a specific employee by ID
   */
  async getEmployeeById(id) {
    try {
      const response = await axios.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching employee ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new employee (admin only)
   */
  async createEmployee(data) {
    try {
      // Format date properly if provided
      const formattedData = {
        ...data,
        hireDate: data.hireDate ? dateUtils.formatDateForApi(data.hireDate) : undefined
      };
      
      const response = await axios.post('/employees', formattedData);
      return response.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  },
  
  /**
   * Update an employee (admin only)
   */
  async updateEmployee(id, data) {
    try {
      // Format date properly if provided
      const formattedData = {
        ...data,
        hireDate: data.hireDate ? dateUtils.formatDateForApi(data.hireDate) : undefined
      };
      
      const response = await axios.put(`/employees/${id}`, formattedData);
      return response.data;
    } catch (error) {
      console.error(`Error updating employee ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Get current user's employee profile
   */
  async getMyProfile() {
    try {
      const response = await axios.get('/employees/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching employee profile:', error);
      throw error;
    }
  }
};