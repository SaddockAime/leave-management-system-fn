import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { departmentService } from '../../api/departmentService';
import { Department } from '../../types';

interface DepartmentState {
  departments: Department[];
  selectedDepartment: Department | null;
  loading: boolean;
  error: string | null;
}

const initialState: DepartmentState = {
  departments: [],
  selectedDepartment: null,
  loading: false,
  error: null,
};

// Fetch all departments
export const fetchDepartments = createAsyncThunk(
  'departments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await departmentService.getDepartments();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch departments');
    }
  }
);

// Fetch a department by ID
export const fetchDepartmentById = createAsyncThunk(
  'departments/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await departmentService.getDepartmentById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || `Failed to fetch department with ID ${id}`);
    }
  }
);

// Create a new department
export const createDepartment = createAsyncThunk(
  'departments/create',
  async (departmentData: Omit<Department, 'id'>, { dispatch, rejectWithValue }) => {
    try {
      const response = await departmentService.createDepartment(departmentData);
      // Refresh the department list after creation
      dispatch(fetchDepartments());
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create department');
    }
  }
);

// Update a department
export const updateDepartment = createAsyncThunk(
  'departments/update',
  async ({ id, ...departmentData }: Department, { dispatch, rejectWithValue }) => {
    try {
      const response = await departmentService.updateDepartment(id, departmentData);
      // Refresh the department list after update
      dispatch(fetchDepartments());
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update department');
    }
  }
);

// Delete a department
export const deleteDepartment = createAsyncThunk(
  'departments/delete',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      await departmentService.deleteDepartment(id);
      // Refresh the department list after deletion
      dispatch(fetchDepartments());
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete department');
    }
  }
);

const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    // Action to clear the selected department
    clearSelectedDepartment: (state) => {
      state.selectedDepartment = null;
    },
    // Action to clear any error
    clearDepartmentError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all departments cases
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action: PayloadAction<Department[]>) => {
        state.loading = false;
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch department by ID cases
      .addCase(fetchDepartmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartmentById.fulfilled, (state, action: PayloadAction<Department>) => {
        state.loading = false;
        state.selectedDepartment = action.payload;
      })
      .addCase(fetchDepartmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create department cases
      .addCase(createDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDepartment.fulfilled, (state) => {
        state.loading = false;
        // No need to update state here since we're calling fetchDepartments
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update department cases
      .addCase(updateDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDepartment.fulfilled, (state, action: PayloadAction<Department>) => {
        state.loading = false;
        // Update selected department if it's the one being updated
        if (state.selectedDepartment && state.selectedDepartment.id === action.payload.id) {
          state.selectedDepartment = action.payload;
        }
        // No need to update departments list as we're calling fetchDepartments
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete department cases
      .addCase(deleteDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.loading = false;
        // If the selected department is the one we just deleted, clear it
        if (state.selectedDepartment && state.selectedDepartment.id === action.payload) {
          state.selectedDepartment = null;
        }
        // No need to filter departments as we're calling fetchDepartments
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedDepartment, clearDepartmentError } = departmentSlice.actions;

// Selectors
export const selectAllDepartments = (state: { departments: DepartmentState }) => state.departments.departments;
export const selectSelectedDepartment = (state: { departments: DepartmentState }) => state.departments.selectedDepartment;
export const selectDepartmentsLoading = (state: { departments: DepartmentState }) => state.departments.loading;
export const selectDepartmentsError = (state: { departments: DepartmentState }) => state.departments.error;

export default departmentSlice.reducer;