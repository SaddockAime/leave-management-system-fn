import axios from '../utils/axiosConfig';

export const leaveBalanceService = {
  /**
   * Get current user's leave balances
   */
  async getMyBalances() {
    try {
      const response = await axios.get('/leave-balances/my-balances');
      return response.data;
    } catch (error) {
      console.error('Error fetching my leave balances:', error);
      throw error;
    }
  },
  
  /**
   * Get leave balances for a specific employee (manager or admin only)
   */
  async getEmployeeBalances(employeeId) {
    try {
      const response = await axios.get(`/leave-balances/employee/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching leave balances for employee ${employeeId}:`, error);
      throw error;
    }
  },
  
  /**
   * Adjust an employee's leave balance (admin only)
   */
  async adjustLeaveBalance(data) {
    try {
      // Validate required fields
      if (!data.employeeId || !data.leaveTypeId || data.adjustment === undefined || !data.reason) {
        throw new Error('Missing required fields for leave balance adjustment');
      }
      
      const response = await axios.post('/leave-balances/adjust', data);
      return response.data;
    } catch (error) {
      console.error('Error adjusting leave balance:', error);
      throw error;
    }
  }
};