import React from 'react';
import { Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: 'calc(100vh - 128px)' // Adjust for layout
      }}>
        <Typography variant="h1" color="primary">
          404
        </Typography>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
          The page you are looking for might have been removed or is temporarily unavailable.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/')}
        >
          Go to Dashboard
        </Button>
      </div>
    </MainLayout>
  );
};

export default NotFoundPage;
