import axios from '../utils/axiosConfig';
import { saveAs } from 'file-saver';

export const reportService = {
  /**
   * Get leave data grouped by department
   */
  async getLeaveByDepartment() {
    try {
      const response = await axios.get('/reports/leave-by-department');
      return response.data;
    } catch (error) {
      console.error('Error fetching department report:', error);
      throw error;
    }
  },

  /**
   * Get leave data for a specific employee
   */
  async getLeaveByEmployee(employeeId) {
    try {
      const response = await axios.get(`/reports/leave-by-employee/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching employee report for ${employeeId}:`, error);
      throw error;
    }
  },

  /**
   * Get leave data grouped by leave type
   */
  async getLeaveByType() {
    try {
      const response = await axios.get('/reports/leave-by-type');
      return response.data;
    } catch (error) {
      console.error('Error fetching leave type report:', error);
      throw error;
    }
  },

  /**
   * Get leave calendar data
   */
  async getLeaveCalendar() {
    try {
      const response = await axios.get('/reports/leave-calendar');
      return response.data;
    } catch (error) {
      console.error('Error fetching leave calendar:', error);
      throw error;
    }
  },

  /**
   * Export leave data to CSV
   */
  async exportToCsv() {
    try {
      const response = await axios.get('/reports/export/csv', {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'text/csv' });
      saveAs(blob, `leave-report-${new Date().toISOString().split('T')[0]}.csv`);
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      throw error;
    }
  },

  /**
   * Export leave data to Excel
   */
  async exportToExcel() {
    try {
      const response = await axios.get('/reports/export/excel', {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      saveAs(blob, `leave-report-${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw error;
    }
  }
};