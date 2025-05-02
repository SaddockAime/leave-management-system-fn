import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { leaveTypeService } from '../../api/leaveTypeService';
import { LeaveType } from '../../types';

interface LeaveTypeState {
  leaveTypes: LeaveType[];
  selectedLeaveType: LeaveType | null;
  loading: boolean;
  error: string | null;
}

const initialState: LeaveTypeState = {
  leaveTypes: [],
  selectedLeaveType: null,
  loading: false,
  error: null,
};

// Fetch all leave types
export const fetchLeaveTypes = createAsyncThunk(
  'leaveTypes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await leaveTypeService.getLeaveTypes();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leave types');
    }
  }
);

// Fetch a specific leave type by ID
export const fetchLeaveTypeById = createAsyncThunk(
  'leaveTypes/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await leaveTypeService.getLeaveTypeById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leave type details');
    }
  }
);

// Create a new leave type (admin only)
export const createLeaveType = createAsyncThunk(
  'leaveTypes/create',
  async (leaveTypeData: Omit<LeaveType, 'id'>, { dispatch, rejectWithValue }) => {
    try {
      const response = await leaveTypeService.createLeaveType(leaveTypeData);
      // Refresh all leave types after creation
      dispatch(fetchLeaveTypes());
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create leave type');
    }
  }
);

// Update a leave type (admin only)
export const updateLeaveType = createAsyncThunk(
  'leaveTypes/update',
  async ({ id, ...leaveTypeData }: LeaveType, { dispatch, rejectWithValue }) => {
    try {
      const response = await leaveTypeService.updateLeaveType(id, leaveTypeData);
      // Refresh all leave types after update
      dispatch(fetchLeaveTypes());
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update leave type');
    }
  }
);

// Delete a leave type (admin only)
export const deleteLeaveType = createAsyncThunk(
  'leaveTypes/delete',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      await leaveTypeService.deleteLeaveType(id);
      // Refresh all leave types after deletion
      dispatch(fetchLeaveTypes());
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete leave type');
    }
  }
);

const leaveTypeSlice = createSlice({
  name: 'leaveTypes',
  initialState,
  reducers: {
    clearSelectedLeaveType: (state) => {
      state.selectedLeaveType = null;
    },
    clearLeaveTypeError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all leave types
      .addCase(fetchLeaveTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveTypes.fulfilled, (state, action: PayloadAction<LeaveType[]>) => {
        state.loading = false;
        state.leaveTypes = action.payload;
      })
      .addCase(fetchLeaveTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch leave type by ID
      .addCase(fetchLeaveTypeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveTypeById.fulfilled, (state, action: PayloadAction<LeaveType>) => {
        state.loading = false;
        state.selectedLeaveType = action.payload;
      })
      .addCase(fetchLeaveTypeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create leave type
      .addCase(createLeaveType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLeaveType.fulfilled, (state) => {
        state.loading = false;
        // State will be updated by fetchLeaveTypes called in the thunk
      })
      .addCase(createLeaveType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update leave type
      .addCase(updateLeaveType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLeaveType.fulfilled, (state, action: PayloadAction<LeaveType>) => {
        state.loading = false;
        
        // Update selected leave type if it's the one being updated
        if (state.selectedLeaveType && state.selectedLeaveType.id === action.payload.id) {
          state.selectedLeaveType = action.payload;
        }
        
        // State will be further updated by fetchLeaveTypes called in the thunk
      })
      .addCase(updateLeaveType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete leave type
      .addCase(deleteLeaveType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLeaveType.fulfilled, (state, action) => {
        state.loading = false;
        
        // Clear selected leave type if it's the one being deleted
        if (state.selectedLeaveType && state.selectedLeaveType.id === action.payload) {
          state.selectedLeaveType = null;
        }
        
        // State will be further updated by fetchLeaveTypes called in the thunk
      })
      .addCase(deleteLeaveType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedLeaveType, clearLeaveTypeError } = leaveTypeSlice.actions;

// Selectors
export const selectAllLeaveTypes = (state: { leaveTypes: LeaveTypeState }) => state.leaveTypes.leaveTypes;
export const selectSelectedLeaveType = (state: { leaveTypes: LeaveTypeState }) => state.leaveTypes.selectedLeaveType;
export const selectLeaveTypesLoading = (state: { leaveTypes: LeaveTypeState }) => state.leaveTypes.loading;
export const selectLeaveTypesError = (state: { leaveTypes: LeaveTypeState }) => state.leaveTypes.error;

export default leaveTypeSlice.reducer;