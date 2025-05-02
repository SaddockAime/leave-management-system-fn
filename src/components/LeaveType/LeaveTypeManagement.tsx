import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import {
  Typography,
  Paper,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { RoleName, LeaveType } from '../../types'; // Import LeaveType type
import { 
  fetchLeaveTypes, 
  createLeaveType, 
  updateLeaveType, 
  deleteLeaveType,
  selectAllLeaveTypes,
  selectLeaveTypesLoading,
  selectLeaveTypesError,
  clearLeaveTypeError
} from '../../redux/slices/leaveTypeSlice';
import { selectUser } from '../../redux/slices/authSlice';

// Define type for form data
interface LeaveTypeFormData {
  name: string;
  description: string;
  accrualRate: number;
  requiresDocumentation: boolean;
  requiresApproval: boolean;
  maxDays: string | number | null;
  maxConsecutiveDays: string | number | null;
  active: boolean;
  color: string;
}

const LeaveTypeManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Use Redux selectors
  const user = useSelector(selectUser);
  const leaveTypes = useSelector(selectAllLeaveTypes);
  const loading = useSelector(selectLeaveTypesLoading);
  const error = useSelector(selectLeaveTypesError);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const [currentLeaveType, setCurrentLeaveType] = useState<LeaveType | null>(null);
  
  const [formData, setFormData] = useState<LeaveTypeFormData>({
    name: '',
    description: '',
    accrualRate: 0,
    requiresDocumentation: false,
    requiresApproval: true,
    maxDays: '',
    maxConsecutiveDays: '',
    active: true,
    color: '#2196f3'
  });

  useEffect(() => {
    // Dispatch Redux action instead of direct API call
    dispatch(fetchLeaveTypes());
    
    // Clear any leave type errors when component unmounts
    return () => {
      dispatch(clearLeaveTypeError());
    };
  }, [dispatch]);

  const handleOpenDialog = (leaveType: LeaveType | null = null) => {
    if (leaveType) {
      setCurrentLeaveType(leaveType);
      setFormData({
        name: leaveType.name,
        description: leaveType.description,
        accrualRate: leaveType.accrualRate,
        requiresDocumentation: leaveType.requiresDocumentation,
        requiresApproval: leaveType.requiresApproval,
        maxDays: leaveType.maxDays ?? '',
        maxConsecutiveDays: leaveType.maxConsecutiveDays ?? '',
        active: leaveType.active,
        color: leaveType.color || '#2196f3'
      });
    } else {
      setCurrentLeaveType(null);
      setFormData({
        name: '',
        description: '',
        accrualRate: 0,
        requiresDocumentation: false,
        requiresApproval: true,
        maxDays: '',
        maxConsecutiveDays: '',
        active: true,
        color: '#2196f3'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDeleteDialog = (leaveType: LeaveType) => {
    setCurrentLeaveType(leaveType);
    setDeleteConfirmDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteConfirmDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Allow empty string (to clear the field) or valid numbers
    if (value === '' || !isNaN(parseFloat(value))) {
      setFormData({
        ...formData,
        [name]: value === '' ? '' : parseFloat(value)
      });
    }
  };

  const handleSubmit = async () => {
    try {
      // Prepare data - convert empty strings to null, ensure proper number types
      const submitData = {
        name: formData.name,
        description: formData.description,
        accrualRate: formData.accrualRate,
        requiresDocumentation: formData.requiresDocumentation,
        requiresApproval: formData.requiresApproval,
        active: formData.active,
        color: formData.color,
        // Convert string to number or null for maxDays
        maxDays: formData.maxDays === '' ? null : 
                typeof formData.maxDays === 'string' ? parseFloat(formData.maxDays) : formData.maxDays,
        // Convert string to number or null for maxConsecutiveDays
        maxConsecutiveDays: formData.maxConsecutiveDays === '' ? null :
                typeof formData.maxConsecutiveDays === 'string' ? parseFloat(formData.maxConsecutiveDays) : formData.maxConsecutiveDays
      };
      
      if (currentLeaveType) {
        // Update existing leave type
        await dispatch(updateLeaveType({
          id: currentLeaveType.id,
          ...submitData
        } as LeaveType)).unwrap();
      } else {
        // Create new leave type - needs proper typing
        await dispatch(createLeaveType(submitData as Omit<LeaveType, 'id'>)).unwrap();
      }
      
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving leave type:', err);
      // Error state will be handled by Redux
    }
  };

  const handleDelete = async () => {
    try {
      if (currentLeaveType) {
        await dispatch(deleteLeaveType(currentLeaveType.id)).unwrap();
        handleCloseDeleteDialog();
      }
    } catch (err) {
      console.error('Error deleting leave type:', err);
      // Error state will be handled by Redux
    }
  };

  // Check if user is admin using role from Redux state
  const isAdmin = () => {
    return user?.role === RoleName.ROLE_ADMIN;
  };

  // Only allow admins to access this component
  if (!isAdmin()) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">You don't have permission to manage leave types.</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Leave Types</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => handleOpenDialog()}
        >
          Add Leave Type
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading && !leaveTypes.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Accrual Rate</TableCell>
                <TableCell>Max Days</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaveTypes.map((leaveType) => (
                <TableRow key={leaveType.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          bgcolor: leaveType.color || '#2196f3',
                          borderRadius: '50%',
                          mr: 1
                        }}
                      />
                      {leaveType.name}
                    </Box>
                  </TableCell>
                  <TableCell>{leaveType.description}</TableCell>
                  <TableCell>{leaveType.accrualRate} days/month</TableCell>
                  <TableCell>{leaveType.maxDays || 'Unlimited'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={leaveType.active ? 'Active' : 'Inactive'}
                      color={leaveType.active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(leaveType)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleOpenDeleteDialog(leaveType)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {/* Dialog content remains the same */}
        <DialogTitle>
          {currentLeaveType ? 'Edit Leave Type' : 'Create Leave Type'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              multiline
              rows={2}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Accrual Rate (days/month)"
              name="accrualRate"
              type="number"
              value={formData.accrualRate}
              onChange={handleNumberInputChange}
              required
              inputProps={{ step: 0.5, min: 0 }}
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Max Days Per Year"
                name="maxDays"
                type="number"
                value={formData.maxDays}
                onChange={handleNumberInputChange}
                inputProps={{ step: 1, min: 0 }}
                fullWidth
                helperText="Leave empty for unlimited"
              />
              
              <TextField
                label="Max Consecutive Days"
                name="maxConsecutiveDays"
                type="number"
                value={formData.maxConsecutiveDays}
                onChange={handleNumberInputChange}
                inputProps={{ step: 1, min: 0 }}
                fullWidth
                helperText="Leave empty for unlimited"
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Color"
                name="color"
                type="color"
                value={formData.color}
                onChange={handleInputChange}
                sx={{ width: 120 }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.requiresDocumentation}
                    onChange={handleInputChange}
                    name="requiresDocumentation"
                  />
                }
                label="Requires Documentation"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.requiresApproval}
                    onChange={handleInputChange}
                    name="requiresApproval"
                  />
                }
                label="Requires Approval"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.active}
                    onChange={handleInputChange}
                    name="active"
                  />
                }
                label="Active"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary" 
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the leave type "{currentLeaveType?.name}"?
            This action cannot be undone and may affect existing leave balances.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeaveTypeManagement;