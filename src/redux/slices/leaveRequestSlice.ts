import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { leaveRequestService } from '../../api/leaveRequestService';
import { LeaveRequest, CreateLeaveRequestDto } from '../../types';

interface LeaveRequestState {
  leaveRequests: LeaveRequest[];
  selectedRequest: LeaveRequest | null;
  loading: boolean;
  error: string | null;
}

const initialState: LeaveRequestState = {
  leaveRequests: [],
  selectedRequest: null,
  loading: false,
  error: null,
};

// Fetch current user's leave requests
export const fetchMyLeaves = createAsyncThunk(
  'leaveRequests/fetchMyLeaves',
  async (_, { rejectWithValue }) => {
    try {
      return await leaveRequestService.getMyLeaveRequests();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leave requests');
    }
  }
);

// Fetch all leave requests (admin only)
export const fetchAllLeaveRequests = createAsyncThunk(
  'leaveRequests/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await leaveRequestService.getAllLeaveRequests();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch all leave requests');
    }
  }
);

// Fetch team leave requests (for managers)
export const fetchTeamLeaveRequests = createAsyncThunk(
  'leaveRequests/fetchTeam',
  async (_, { rejectWithValue }) => {
    try {
      return await leaveRequestService.getTeamLeaveRequests();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch team leave requests');
    }
  }
);

// Fetch department leave requests
export const fetchDepartmentLeaveRequests = createAsyncThunk(
  'leaveRequests/fetchDepartment',
  async (departmentId: string, { rejectWithValue }) => {
    try {
      return await leaveRequestService.getDepartmentLeaveRequests(departmentId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch department leave requests');
    }
  }
);

// Fetch a specific leave request by ID
export const fetchLeaveRequestById = createAsyncThunk(
  'leaveRequests/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await leaveRequestService.getLeaveRequestById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leave request details');
    }
  }
);

// Create a new leave request
export const createLeaveRequest = createAsyncThunk(
  'leaveRequests/create',
  async (leaveRequestData: CreateLeaveRequestDto, { dispatch, rejectWithValue }) => {
    try {
      const response = await leaveRequestService.createLeaveRequest(leaveRequestData);
      // Refresh my leaves after creating a new request
      dispatch(fetchMyLeaves());
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create leave request');
    }
  }
);

// Approve a leave request (manager or admin only)
export const approveLeaveRequest = createAsyncThunk(
  'leaveRequests/approve',
  async ({ id, comments }: { id: string; comments?: string }, { dispatch, rejectWithValue }) => {
    try {
      const response = await leaveRequestService.approveLeaveRequest(id, comments);
      
      // Refresh the appropriate list after approval
      dispatch(fetchTeamLeaveRequests());
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve leave request');
    }
  }
);

// Reject a leave request (manager or admin only)
export const rejectLeaveRequest = createAsyncThunk(
  'leaveRequests/reject',
  async ({ id, comments }: { id: string; comments: string }, { dispatch, rejectWithValue }) => {
    try {
      const response = await leaveRequestService.rejectLeaveRequest(id, comments);
      
      // Refresh the appropriate list after rejection
      dispatch(fetchTeamLeaveRequests());
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject leave request');
    }
  }
);

// Cancel a leave request
export const cancelLeaveRequest = createAsyncThunk(
  'leaveRequests/cancel',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await leaveRequestService.cancelLeaveRequest(id);
      
      // Refresh my leaves after cancellation
      dispatch(fetchMyLeaves());
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel leave request');
    }
  }
);

const leaveRequestSlice = createSlice({
  name: 'leaveRequests',
  initialState,
  reducers: {
    clearSelectedRequest: (state) => {
      state.selectedRequest = null;
    },
    clearLeaveRequestError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch My Leaves
      .addCase(fetchMyLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyLeaves.fulfilled, (state, action: PayloadAction<LeaveRequest[]>) => {
        state.loading = false;
        state.leaveRequests = action.payload;
      })
      .addCase(fetchMyLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch All Leave Requests
      .addCase(fetchAllLeaveRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllLeaveRequests.fulfilled, (state, action: PayloadAction<LeaveRequest[]>) => {
        state.loading = false;
        state.leaveRequests = action.payload;
      })
      .addCase(fetchAllLeaveRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Team Leave Requests
      .addCase(fetchTeamLeaveRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamLeaveRequests.fulfilled, (state, action: PayloadAction<LeaveRequest[]>) => {
        state.loading = false;
        state.leaveRequests = action.payload;
      })
      .addCase(fetchTeamLeaveRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Department Leave Requests
      .addCase(fetchDepartmentLeaveRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartmentLeaveRequests.fulfilled, (state, action: PayloadAction<LeaveRequest[]>) => {
        state.loading = false;
        state.leaveRequests = action.payload;
      })
      .addCase(fetchDepartmentLeaveRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Leave Request By ID
      .addCase(fetchLeaveRequestById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveRequestById.fulfilled, (state, action: PayloadAction<LeaveRequest>) => {
        state.loading = false;
        state.selectedRequest = action.payload;
      })
      .addCase(fetchLeaveRequestById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create Leave Request
      .addCase(createLeaveRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLeaveRequest.fulfilled, (state) => {
        state.loading = false;
        // No need to update state directly as we're refreshing via fetchMyLeaves
      })
      .addCase(createLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Approve Leave Request
      .addCase(approveLeaveRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveLeaveRequest.fulfilled, (state, action: PayloadAction<LeaveRequest>) => {
        state.loading = false;
        
        // Update the selected request if it's the one being approved
        if (state.selectedRequest && state.selectedRequest.id === action.payload.id) {
          state.selectedRequest = action.payload;
        }
        
        // Update in the list if it exists
        const index = state.leaveRequests.findIndex(lr => lr.id === action.payload.id);
        if (index !== -1) {
          state.leaveRequests[index] = action.payload;
        }
      })
      .addCase(approveLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Reject Leave Request
      .addCase(rejectLeaveRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectLeaveRequest.fulfilled, (state, action: PayloadAction<LeaveRequest>) => {
        state.loading = false;
        
        // Update the selected request if it's the one being rejected
        if (state.selectedRequest && state.selectedRequest.id === action.payload.id) {
          state.selectedRequest = action.payload;
        }
        
        // Update in the list if it exists
        const index = state.leaveRequests.findIndex(lr => lr.id === action.payload.id);
        if (index !== -1) {
          state.leaveRequests[index] = action.payload;
        }
      })
      .addCase(rejectLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Cancel Leave Request
      .addCase(cancelLeaveRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelLeaveRequest.fulfilled, (state, action: PayloadAction<LeaveRequest>) => {
        state.loading = false;
        
        // Update the selected request if it's the one being canceled
        if (state.selectedRequest && state.selectedRequest.id === action.payload.id) {
          state.selectedRequest = action.payload;
        }
        
        // Update in the list if it exists
        const index = state.leaveRequests.findIndex(lr => lr.id === action.payload.id);
        if (index !== -1) {
          state.leaveRequests[index] = action.payload;
        }
      })
      .addCase(cancelLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedRequest, clearLeaveRequestError } = leaveRequestSlice.actions;

// Selectors
export const selectLeaveRequests = (state: { leaveRequests: LeaveRequestState }) => state.leaveRequests.leaveRequests;
export const selectSelectedLeaveRequest = (state: { leaveRequests: LeaveRequestState }) => state.leaveRequests.selectedRequest;
export const selectLeaveRequestsLoading = (state: { leaveRequests: LeaveRequestState }) => state.leaveRequests.loading;
export const selectLeaveRequestsError = (state: { leaveRequests: LeaveRequestState }) => state.leaveRequests.error;

// Filtered selectors
export const selectPendingLeaveRequests = (state: { leaveRequests: LeaveRequestState }) => 
  state.leaveRequests.leaveRequests.filter(request => request.status === 'PENDING');

export const selectApprovedLeaveRequests = (state: { leaveRequests: LeaveRequestState }) => 
  state.leaveRequests.leaveRequests.filter(request => request.status === 'APPROVED');

export const selectRejectedLeaveRequests = (state: { leaveRequests: LeaveRequestState }) => 
  state.leaveRequests.leaveRequests.filter(request => request.status === 'REJECTED');

export const selectCanceledLeaveRequests = (state: { leaveRequests: LeaveRequestState }) => 
  state.leaveRequests.leaveRequests.filter(request => request.status === 'CANCELLED');

export default leaveRequestSlice.reducer;