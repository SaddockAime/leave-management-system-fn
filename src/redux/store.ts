import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import leaveRequestReducer from './slices/leaveRequestSlice';
import leaveTypeReducer from './slices/leaveTypeSlice';
import notificationReducer from './slices/notificationSlice';
import employeeReducer from './slices/employeeSlice';
import departmentReducer from './slices/departmentSlice';
import leaveBalanceReducer from './slices/leaveBalanceSlice';
import reportReducer from './slices/reportSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leaveRequests: leaveRequestReducer,
    leaveTypes: leaveTypeReducer,
    notifications: notificationReducer,
    employees: employeeReducer,
    departments: departmentReducer,
    leaveBalances: leaveBalanceReducer,  // Added leaveBalances slice
    reports: reportReducer               // Added reports slice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          'auth/login/fulfilled', 
          'auth/fetchCurrentUser/fulfilled',
          'reports/exportToCsv/fulfilled',   // Added for CSV export
          'reports/exportToExcel/fulfilled'  // Added for Excel export
        ],
        // Ignore these field paths in all actions
        ignoredPaths: [
          'payload.startDate', 
          'payload.endDate', 
          'payload.createdAt', 
          'payload.updatedAt',
          'payload.hireDate'   // Added for employee hire date
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;