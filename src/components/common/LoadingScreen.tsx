import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import Logo from './Logo';

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}
    >
      <Logo size="large" />
      
      <CircularProgress size={40} sx={{ mt: 4, mb: 2 }} />
      
      <Typography variant="body1" color="text.secondary">
        Loading...
      </Typography>
    </Box>
  );
};

export default LoadingScreen;