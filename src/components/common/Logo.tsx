import React from 'react';
import { Box, Typography } from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'white';
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', color = 'primary' }) => {
  // Set icon size based on prop
  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 24;
      case 'large':
        return 40;
      default:
        return 32;
    }
  };
  
  // Set text size based on prop
  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 'h6';
      case 'large':
        return 'h4';
      default:
        return 'h5';
    }
  };
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <EventAvailableIcon 
        sx={{ 
          fontSize: getIconSize(), 
          color: color === 'primary' ? 'primary.main' : 'white',
          mr: 1 
        }} 
      />
      <Typography 
        variant={getTextSize()} 
        component="span" 
        sx={{ 
          fontWeight: 'bold',
          color: color === 'primary' ? 'primary.main' : 'white',
        }}
      >
        LeaveHub
      </Typography>
    </Box>
  );
};

export default Logo;