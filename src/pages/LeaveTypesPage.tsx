import React from 'react';
import { Typography, Box, Alert } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/slices/authSlice';
import MainLayout from '../components/Layout/MainLayout';
import LeaveTypeManagement from '../components/LeaveType/LeaveTypeManagement';
import { RoleName } from '../types';

const LeaveTypesPage = () => {
  const user = useSelector(selectUser);
  
  const isAdmin = user?.role === RoleName.ROLE_ADMIN;
  
  return (
    <MainLayout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Leave Types Management</Typography>
        <Typography variant="body2" color="text.secondary">
          Manage the types of leave available in the system
        </Typography>
      </Box>
      
      {isAdmin ? (
        <LeaveTypeManagement />
      ) : (
        <Alert severity="error">
          You don't have permission to access this page.
        </Alert>
      )}
    </MainLayout>
  );
};

export default LeaveTypesPage;