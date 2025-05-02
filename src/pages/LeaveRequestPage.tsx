import React from 'react';
import { Typography, Grid, Paper, Box, Divider } from '@mui/material';
import { CustomGridItemProps } from '../types/GridTypes';
import MainLayout from '../components/Layout/MainLayout';
import LeaveRequestForm from '../components/LeaveRequest/LeaveRequestForm';
import LeaveRequestList from '../components/LeaveRequest/LeaveRequestList';

const LeaveRequestPage = () => {
  const gridItemProps: CustomGridItemProps = {
    item: true,
    xs: 12,
    component: 'div',
  };

  return (
    <MainLayout>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Leave Requests
      </Typography>
      <Grid container spacing={3}>
        <Grid {...gridItemProps}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Submit Leave Request</Typography>
            <LeaveRequestForm />
          </Paper>
        </Grid>
        <Grid {...gridItemProps}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>My Leave Requests</Typography>
            <Box sx={{ mt: 2 }}>
              <LeaveRequestList />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default LeaveRequestPage;
