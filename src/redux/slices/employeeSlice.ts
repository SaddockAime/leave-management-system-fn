import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { employeeService } from '../../api/employeeService';
import { Employee } from '../../types';

interface EmployeeState {
  employees: Employee[];
  currentEmployee: Employee | null;
  myProfile: Employee | null;
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  currentEmployee: null,
  myProfile: null,
  loading: false,
  error: null,
};

// Fetch all employees (admin/manager only)
export const fetchEmployees = createAsyncThunk(
  'employees/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await employeeService.getAllEmployees();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employees');
    }
  }
);

// Fetch an employee by ID
export const fetchEmployeeById = createAsyncThunk(
  'employees/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await employeeService.getEmployeeById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employee details');
    }
  }
);

// Create a new employee (admin only)
export const createEmployee = createAsyncThunk(
  'employees/create',
  async (employeeData: Omit<Employee, 'id'>, { dispatch, rejectWithValue }) => {
    try {
      const response = await employeeService.createEmployee(employeeData);
      // Refresh the employees list after creation
      dispatch(fetchEmployees());
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create employee');
    }
  }
);

// Update an employee (admin only)
export const updateEmployee = createAsyncThunk(
  'employees/update',
  async ({ id, ...employeeData }: Employee, { dispatch, rejectWithValue }) => {
    try {
      const response = await employeeService.updateEmployee(id, employeeData);
      // Refresh the employees list after update
      dispatch(fetchEmployees());
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update employee');
    }
  }
);

// Onboard current user as employee
export const onboardSelf = createAsyncThunk(
  'employees/onboardSelf',
  async (onboardData: { position: string; departmentId: string; hireDate?: string }, { rejectWithValue }) => {
    try {
      return await employeeService.onboardSelf(onboardData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to complete onboarding');
    }
  }
);

// Fetch current user's employee profile
export const fetchMyProfile = createAsyncThunk(
  'employees/fetchMyProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await employeeService.getMyProfile();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your profile');
    }
  }
);

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    // Action to clear the current employee
    clearCurrentEmployee: (state) => {
      state.currentEmployee = null;
    },
    // Action to clear any error
    clearEmployeeError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all employees cases
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action: PayloadAction<Employee[]>) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch employee by ID cases
      .addCase(fetchEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action: PayloadAction<Employee>) => {
        state.loading = false;
        state.currentEmployee = action.payload;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create employee cases
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state) => {
        state.loading = false;
        // No need to update state here as we're refreshing the list via fetchEmployees
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update employee cases
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action: PayloadAction<Employee>) => {
        state.loading = false;
        // Update current employee if it's the one being updated
        if (state.currentEmployee && state.currentEmployee.id === action.payload.id) {
          state.currentEmployee = action.payload;
        }
        
        // Update my profile if it's the current user's profile being updated
        if (state.myProfile && state.myProfile.id === action.payload.id) {
          state.myProfile = action.payload;
        }
        
        // No need to update employees list as we're refreshing via fetchEmployees
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Onboard self cases
      .addCase(onboardSelf.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onboardSelf.fulfilled, (state, action: PayloadAction<Employee>) => {
        state.loading = false;
        state.myProfile = action.payload;
      })
      .addCase(onboardSelf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch my profile cases
      .addCase(fetchMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action: PayloadAction<Employee>) => {
        state.loading = false;
        state.myProfile = action.payload;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentEmployee, clearEmployeeError } = employeeSlice.actions;

// Selectors
export const selectAllEmployees = (state: { employees: EmployeeState }) => state.employees.employees;
export const selectCurrentEmployee = (state: { employees: EmployeeState }) => state.employees.currentEmployee;
export const selectMyProfile = (state: { employees: EmployeeState }) => state.employees.myProfile;
export const selectEmployeesLoading = (state: { employees: EmployeeState }) => state.employees.loading;
export const selectEmployeesError = (state: { employees: EmployeeState }) => state.employees.error;

export default employeeSlice.reducer;