import React, { useEffect, useState } from 'react';
import { Typography, Grid, Paper, Box, List, ListItem, ListItemText, Divider, Chip, CircularProgress, Alert } from '@mui/material';
import { CustomGridItemProps } from '../types/GridTypes';
import MainLayout from '../components/Layout/MainLayout';
import LeaveBalanceDisplay from '../components/LeaveBalance/LeaveBalanceDisplay';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchMyLeaves } from '../redux/slices/leaveRequestSlice';
import { format } from 'date-fns';
import { LeaveRequest } from '../types';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { leaveRequests, loading, error } = useSelector((state: RootState) => state.leaveRequests);
  
  useEffect(() => {
    dispatch(fetchMyLeaves());
  }, [dispatch]);
  
  const gridItemProps: CustomGridItemProps = {
    item: true,
    xs: 12,
    md: 4,
    component: 'div',
  };

  // Filter leave requests
  const pendingRequests = leaveRequests.filter(req => req.status === 'PENDING');
  const approvedRequests = leaveRequests.filter(req => req.status === 'APPROVED');
  
  // Get upcoming leaves (approved leaves with future start dates)
  const today = new Date();
  const upcomingLeaves = approvedRequests.filter(leave => {
    const startDate = new Date(leave.startDate);
    return startDate > today;
  }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  // Render pending requests list
  const renderPendingRequests = () => {
    if (loading) {
      return <CircularProgress size={24} />;
    }
    
    if (error) {
      return <Alert severity="error">{error}</Alert>;
    }
    
    if (pendingRequests.length === 0) {
      return <Typography variant="body2">No pending requests.</Typography>;
    }
    
    return (
      <List dense>
        {pendingRequests.slice(0, 5).map((request) => (
          <React.Fragment key={request.id}>
            <ListItem>
              <ListItemText
                primary={request.leaveType?.name || 'Leave Request'}
                secondary={`${format(new Date(request.startDate), 'MMM dd')} - ${format(new Date(request.endDate), 'MMM dd, yyyy')} (${request.days} days)`}
              />
              <Chip label="Pending" color="warning" size="small" />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    );
  };
  
  // Render upcoming leaves list
  const renderUpcomingLeaves = () => {
    if (loading) {
      return <CircularProgress size={24} />;
    }
    
    if (error) {
      return <Alert severity="error">{error}</Alert>;
    }
    
    if (upcomingLeaves.length === 0) {
      return <Typography variant="body2">No upcoming leaves.</Typography>;
    }
    
    return (
      <List dense>
        {upcomingLeaves.slice(0, 5).map((leave) => (
          <React.Fragment key={leave.id}>
            <ListItem>
              <ListItemText
                primary={leave.leaveType?.name || 'Leave'}
                secondary={`${format(new Date(leave.startDate), 'MMM dd')} - ${format(new Date(leave.endDate), 'MMM dd, yyyy')} (${leave.days} days)`}
              />
              <Chip label="Approved" color="success" size="small" />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    );
  };

  return (
    <MainLayout>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid {...gridItemProps}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Pending Requests
            </Typography>
            {renderPendingRequests()}
          </Paper>
        </Grid>
        
        <Grid {...gridItemProps}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Leaves
            </Typography>
            {renderUpcomingLeaves()}
          </Paper>
        </Grid>
        
        <Grid {...gridItemProps}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Leave Balance
            </Typography>
            <Box sx={{ mt: 2 }}>
              <LeaveBalanceDisplay />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default DashboardPage;
