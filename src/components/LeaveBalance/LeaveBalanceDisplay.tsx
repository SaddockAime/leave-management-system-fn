import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress, Box, Alert } from '@mui/material';
import { leaveBalanceService } from '../../api/leaveBalanceService';
import { leaveTypeService } from '../../api/leaveTypeService';
import { dateUtils } from '../../utils/dateUtils';

interface LeaveBalance {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  year: number;
  total: number;
  used: number;
  pending: number;
  leaveType?: {
    id: string;
    name: string;
    color?: string;
  };
}

interface LeaveType {
  id: string;
  name: string;
  color?: string;
}

interface LeaveBalanceDisplayProps {
  employeeId?: string;
}

const LeaveBalanceDisplay: React.FC<LeaveBalanceDisplayProps> = ({ employeeId }) => {
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch leave types first to ensure we have them
        const types = await leaveTypeService.getLeaveTypes();
        setLeaveTypes(types);
        
        // Fetch leave balances based on props
        let balanceData;
        if (employeeId) {
          balanceData = await leaveBalanceService.getEmployeeBalances(employeeId);
        } else {
          balanceData = await leaveBalanceService.getMyBalances();
        }
        
        // Map leave types to balances if not already included
        const balancesWithTypes = balanceData.map((balance: LeaveBalance) => {
          if (!balance.leaveType) {
            const matchingType = types.find(type => type.id === balance.leaveTypeId);
            if (matchingType) {
              return { ...balance, leaveType: matchingType };
            }
          }
          return balance;
        });
        
        setBalances(balancesWithTypes);
      } catch (err: any) {
        console.error('Error fetching leave balances:', err);
        setError(err.message || 'Failed to load leave balances');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (balances.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="info">No leave balances available.</Alert>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {balances.map((balance) => {
        const available = Math.max(0, balance.total - balance.used - balance.pending);
        const percentage = Math.round((available / (balance.total || 1)) * 100) || 0;
        const color = balance.leaveType?.color || '#2196f3';
        
        return (
          <Grid item xs={12} sm={6} md={4} key={balance.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" component="div" sx={{ color }}>
                  {balance.leaveType?.name || 'Unknown Leave Type'}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Available:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {available} days
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Used:
                  </Typography>
                  <Typography variant="body1">
                    {balance.used} days
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Pending:
                  </Typography>
                  <Typography variant="body1">
                    {balance.pending} days
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Total:
                  </Typography>
                  <Typography variant="body1">
                    {balance.total} days
                  </Typography>
                </Box>
                <Box sx={{ mt: 1, position: 'relative', pt: 1 }}>
                  <Box
                    sx={{
                      height: 8,
                      borderRadius: 5,
                      bgcolor: 'rgba(0,0,0,0.1)'
                    }}
                  >
                    <Box
                      sx={{
                        height: '100%',
                        borderRadius: 5,
                        width: `${percentage}%`,
                        bgcolor: color,
                        transition: 'width 0.5s ease-in-out'
                      }}
                    />
                  </Box>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      position: 'absolute', 
                      right: 0, 
                      top: 0 
                    }}
                  >
                    {percentage}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default LeaveBalanceDisplay;