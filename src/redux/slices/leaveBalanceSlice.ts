import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { leaveBalanceService } from '../../api/leaveBalanceService';
import { LeaveBalance } from '../../types';

interface LeaveBalanceState {
  leaveBalances: LeaveBalance[];
  loading: boolean;
  error: string | null;
}

const initialState: LeaveBalanceState = {
  leaveBalances: [],
  loading: false,
  error: null,
};

// Fetch current user's leave balances
export const fetchMyLeaveBalances = createAsyncThunk(
  'leaveBalances/fetchMyBalances',
  async (_, { rejectWithValue }) => {
    try {
      return await leaveBalanceService.getMyBalances();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leave balances');
    }
  }
);

// Fetch leave balances for a specific employee (manager or admin only)
export const fetchEmployeeLeaveBalances = createAsyncThunk(
  'leaveBalances/fetchEmployeeBalances',
  async (employeeId: string, { rejectWithValue }) => {
    try {
      return await leaveBalanceService.getEmployeeBalances(employeeId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employee leave balances');
    }
  }
);

// Adjust a leave balance (admin only)
export const adjustLeaveBalance = createAsyncThunk(
  'leaveBalances/adjust',
  async (adjustmentData: {
    employeeId: string;
    leaveTypeId: string;
    adjustment: number;
    reason: string;
  }, { dispatch, rejectWithValue }) => {
    try {
      const response = await leaveBalanceService.adjustLeaveBalance(adjustmentData);
      
      // Refresh the employee's balances after adjustment
      if (adjustmentData.employeeId) {
        dispatch(fetchEmployeeLeaveBalances(adjustmentData.employeeId));
      }
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to adjust leave balance');
    }
  }
);

const leaveBalanceSlice = createSlice({
  name: 'leaveBalances',
  initialState,
  reducers: {
    // Action to clear any error
    clearLeaveBalanceError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch my leave balances cases
      .addCase(fetchMyLeaveBalances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyLeaveBalances.fulfilled, (state, action: PayloadAction<LeaveBalance[]>) => {
        state.loading = false;
        state.leaveBalances = action.payload;
      })
      .addCase(fetchMyLeaveBalances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch employee leave balances cases
      .addCase(fetchEmployeeLeaveBalances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeLeaveBalances.fulfilled, (state, action: PayloadAction<LeaveBalance[]>) => {
        state.loading = false;
        state.leaveBalances = action.payload;
      })
      .addCase(fetchEmployeeLeaveBalances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Adjust leave balance cases
      .addCase(adjustLeaveBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adjustLeaveBalance.fulfilled, (state, action: PayloadAction<LeaveBalance>) => {
        state.loading = false;
        
        // We're refreshing all balances in the thunk, so no need to update here
        // But as a fallback, update the specific balance if it exists in the current list
        const index = state.leaveBalances.findIndex(
          (balance) => balance.id === action.payload.id
        );
        
        if (index !== -1) {
          state.leaveBalances[index] = action.payload;
        }
      })
      .addCase(adjustLeaveBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearLeaveBalanceError } = leaveBalanceSlice.actions;

// Selectors
export const selectLeaveBalances = (state: { leaveBalances: LeaveBalanceState }) => state.leaveBalances.leaveBalances;
export const selectLeaveBalancesLoading = (state: { leaveBalances: LeaveBalanceState }) => state.leaveBalances.loading;
export const selectLeaveBalancesError = (state: { leaveBalances: LeaveBalanceState }) => state.leaveBalances.error;

export default leaveBalanceSlice.reducer;