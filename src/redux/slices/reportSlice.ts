import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { reportService } from '../../api/reportService';

// Define types for different report data structures
interface DepartmentReportData {
  departmentId: string;
  departmentName: string;
  leaveCount: number;
  employees: {
    employeeId: string;
    name: string;
    leaveCount: number;
  }[];
}

interface EmployeeReportData {
  employeeId: string;
  name: string;
  department: string;
  leaveRequests: {
    id: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    status: string;
    duration: number;
  }[];
}

interface LeaveTypeReportData {
  leaveTypeId: string;
  leaveTypeName: string;
  leaveCount: number;
  percentageOfTotal: number;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  employeeId: string;
  employeeName: string;
  leaveTypeId: string;
  leaveTypeName: string;
  status: string;
}

interface ReportState {
  departmentReport: DepartmentReportData[];
  employeeReport: EmployeeReportData | null;
  leaveTypeReport: LeaveTypeReportData[];
  calendarEvents: CalendarEvent[];
  loading: boolean;
  error: string | null;
  exportLoading: boolean;
  exportError: string | null;
}

const initialState: ReportState = {
  departmentReport: [],
  employeeReport: null,
  leaveTypeReport: [],
  calendarEvents: [],
  loading: false,
  error: null,
  exportLoading: false,
  exportError: null,
};

// Fetch leave data by department
export const fetchLeaveByDepartment = createAsyncThunk(
  'reports/fetchByDepartment',
  async (_, { rejectWithValue }) => {
    try {
      return await reportService.getLeaveByDepartment();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch department report');
    }
  }
);

// Fetch leave data for a specific employee
export const fetchLeaveByEmployee = createAsyncThunk(
  'reports/fetchByEmployee',
  async (employeeId: string, { rejectWithValue }) => {
    try {
      return await reportService.getLeaveByEmployee(employeeId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employee report');
    }
  }
);

// Fetch leave data by leave type
export const fetchLeaveByType = createAsyncThunk(
  'reports/fetchByType',
  async (_, { rejectWithValue }) => {
    try {
      return await reportService.getLeaveByType();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leave type report');
    }
  }
);

// Fetch leave calendar data
export const fetchLeaveCalendar = createAsyncThunk(
  'reports/fetchCalendar',
  async (_, { rejectWithValue }) => {
    try {
      return await reportService.getLeaveCalendar();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leave calendar');
    }
  }
);

// Export report to CSV
export const exportReportToCsv = createAsyncThunk(
  'reports/exportToCsv',
  async (_, { rejectWithValue }) => {
    try {
      await reportService.exportToCsv();
      return true; // Return success flag
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to export to CSV');
    }
  }
);

// Export report to Excel
export const exportReportToExcel = createAsyncThunk(
  'reports/exportToExcel',
  async (_, { rejectWithValue }) => {
    try {
      await reportService.exportToExcel();
      return true; // Return success flag
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to export to Excel');
    }
  }
);

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearEmployeeReport: (state) => {
      state.employeeReport = null;
    },
    clearReportError: (state) => {
      state.error = null;
    },
    clearExportError: (state) => {
      state.exportError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch leave by department
      .addCase(fetchLeaveByDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveByDepartment.fulfilled, (state, action: PayloadAction<DepartmentReportData[]>) => {
        state.loading = false;
        state.departmentReport = action.payload;
      })
      .addCase(fetchLeaveByDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch leave by employee
      .addCase(fetchLeaveByEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveByEmployee.fulfilled, (state, action: PayloadAction<EmployeeReportData>) => {
        state.loading = false;
        state.employeeReport = action.payload;
      })
      .addCase(fetchLeaveByEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch leave by type
      .addCase(fetchLeaveByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveByType.fulfilled, (state, action: PayloadAction<LeaveTypeReportData[]>) => {
        state.loading = false;
        state.leaveTypeReport = action.payload;
      })
      .addCase(fetchLeaveByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch leave calendar
      .addCase(fetchLeaveCalendar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveCalendar.fulfilled, (state, action: PayloadAction<CalendarEvent[]>) => {
        state.loading = false;
        state.calendarEvents = action.payload;
      })
      .addCase(fetchLeaveCalendar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Export to CSV
      .addCase(exportReportToCsv.pending, (state) => {
        state.exportLoading = true;
        state.exportError = null;
      })
      .addCase(exportReportToCsv.fulfilled, (state) => {
        state.exportLoading = false;
      })
      .addCase(exportReportToCsv.rejected, (state, action) => {
        state.exportLoading = false;
        state.exportError = action.payload as string;
      })
      
      // Export to Excel
      .addCase(exportReportToExcel.pending, (state) => {
        state.exportLoading = true;
        state.exportError = null;
      })
      .addCase(exportReportToExcel.fulfilled, (state) => {
        state.exportLoading = false;
      })
      .addCase(exportReportToExcel.rejected, (state, action) => {
        state.exportLoading = false;
        state.exportError = action.payload as string;
      });
  },
});

export const { clearEmployeeReport, clearReportError, clearExportError } = reportSlice.actions;

// Selectors
export const selectDepartmentReport = (state: { reports: ReportState }) => state.reports.departmentReport;
export const selectEmployeeReport = (state: { reports: ReportState }) => state.reports.employeeReport;
export const selectLeaveTypeReport = (state: { reports: ReportState }) => state.reports.leaveTypeReport;
export const selectCalendarEvents = (state: { reports: ReportState }) => state.reports.calendarEvents;
export const selectReportLoading = (state: { reports: ReportState }) => state.reports.loading;
export const selectReportError = (state: { reports: ReportState }) => state.reports.error;
export const selectExportLoading = (state: { reports: ReportState }) => state.reports.exportLoading;
export const selectExportError = (state: { reports: ReportState }) => state.reports.exportError;

export default reportSlice.reducer;