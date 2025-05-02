import { format, differenceInDays, addDays, isWeekend, isValid } from 'date-fns';

export const dateUtils = {
  /**
   * Format a date to a readable string
   */
  formatDate(date: Date | string | null | undefined, formatStr: string = 'MMM dd, yyyy'): string {
    if (!date) return 'N/A';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (!isValid(dateObj)) return 'Invalid Date';
    
    return format(dateObj, formatStr);
  },
  
  /**
   * Calculate business days between two dates (excluding weekends)
   */
  calculateBusinessDays(startDate: Date | string, endDate: Date | string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (!isValid(start) || !isValid(end)) {
      console.error('Invalid date provided to calculateBusinessDays', { startDate, endDate });
      return 0;
    }
    
    let days = 0;
    let current = start;
    
    while (current <= end) {
      if (!isWeekend(current)) {
        days++;
      }
      current = addDays(current, 1);
    }
    
    return days;
  },
  
  /**
   * Format date for API requests
   */
  formatDateForApi(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (!isValid(dateObj)) {
      console.error('Invalid date provided to formatDateForApi', { date });
      return '';
    }
    
    return format(dateObj, 'yyyy-MM-dd');
  },
  
  /**
   * Get total days between two dates (inclusive)
   */
  getDaysBetween(startDate: Date | string, endDate: Date | string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (!isValid(start) || !isValid(end)) {
      console.error('Invalid date provided to getDaysBetween', { startDate, endDate });
      return 0;
    }
    
    return differenceInDays(end, start) + 1;
  },
  
  /**
   * Check if a date is valid
   */
  isValidDate(date: any): boolean {
    if (!date) return false;
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return isValid(dateObj);
  }
};