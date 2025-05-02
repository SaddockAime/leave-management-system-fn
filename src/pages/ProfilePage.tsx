import React from 'react';
import { Typography, Grid, Paper } from '@mui/material';
import MainLayout from '../components/Layout/MainLayout';
import { CustomGridItemProps } from '../types/GridTypes';

const gridItemProps: CustomGridItemProps = {
  item: true,
  xs: 12,
  md: 6,
  component: 'div',
};

const ProfilePage: React.FC = () => {
  return (
    <MainLayout>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Profile Settings
      </Typography>
      <Grid container spacing={3}>
        <Grid {...gridItemProps}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Personal Information</Typography>
            {/* Add profile information form */}
          </Paper>
        </Grid>
        <Grid {...gridItemProps}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Account Settings</Typography>
            {/* Add account settings options */}
          </Paper>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default ProfilePage;
