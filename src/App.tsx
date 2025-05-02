import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LeaveRequestsPage from './pages/LeaveRequestsPage';
import ProfilePage from './pages/ProfilePage';
import PrivateRoute from './components/Auth/PrivateRoute';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from './redux/slices/authSlice';
import LeaveRequestForm from './components/LeaveRequest/LeaveRequestForm';
import LeaveCalendarPage from './pages/LeaveCalendarPage';
import DepartmentsPage from './pages/DepartmentsPage';
import ReportsPage from './pages/ReportsPage';
import { socketService } from './api/socketService';
import { checkTokenAndConnect, registerSocketListeners } from './utils/socketUtils';
import { config } from './config/config';
import { fetchNotifications } from './redux/slices/notificationSlice';
import LeaveTypesPage from './pages/LeaveTypesPage';
import EmployeesPage from './pages/EmployeesPage';
import OnboardingPage from './pages/OnboardingPage';


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Validate config
    config.validate();
    
    // Check token and fetch user data if authenticated
    dispatch(fetchCurrentUser());
    
    // Connect socket if user is already authenticated
    if (checkTokenAndConnect()) {
      // Register socket event listeners
      registerSocketListeners();
      
      // Fetch notifications
      dispatch(fetchNotifications());
    }
    
    // Clean up socket connection on app unmount
    return () => {
      socketService.disconnect();
    };
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/leave-requests" 
        element={
          <PrivateRoute>
            <LeaveRequestsPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/create-leave-request" 
        element={
          <PrivateRoute>
            <LeaveRequestForm />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/calendar" 
        element={
          <PrivateRoute>
            <LeaveCalendarPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/reports" 
        element={
          <PrivateRoute>
            <ReportsPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/employees" 
        element={
          <PrivateRoute>
            <EmployeesPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/onboarding" 
        element={
          <PrivateRoute>
            <OnboardingPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/departments" 
        element={
          <PrivateRoute>
            <DepartmentsPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/leave-types" 
        element={
          <PrivateRoute>
            <LeaveTypesPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;