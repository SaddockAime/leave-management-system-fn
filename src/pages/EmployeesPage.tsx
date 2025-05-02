import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store';
import {
  Typography,
  Grid,
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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Alert,
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MainLayout from '../components/Layout/MainLayout';
import { dateUtils } from '../utils/dateUtils';
import { RoleName, Employee } from '../types';
import { 
  fetchEmployees, 
  fetchEmployeeById,
  createEmployee, 
  updateEmployee,
  selectAllEmployees,
  selectCurrentEmployee,
  selectEmployeesLoading,
  selectEmployeesError,
  clearEmployeeError,
  clearCurrentEmployee
} from '../redux/slices/employeeSlice';
import {
  fetchDepartments,
  selectAllDepartments,
  selectDepartmentsLoading,
} from '../redux/slices/departmentSlice';
import { selectUser } from '../redux/slices/authSlice';

interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  departmentId: string;
  managerId: string;
  hireDate: string;
  profilePicture: string;
}

const EmployeesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Use Redux state instead of local state
  const user = useSelector(selectUser);
  const employees = useSelector(selectAllEmployees);
  const departments = useSelector(selectAllDepartments);
  const selectedEmployee = useSelector(selectCurrentEmployee);
  const loading = useSelector(selectEmployeesLoading);
  const error = useSelector(selectEmployeesError);
  const departmentsLoading = useSelector(selectDepartmentsLoading);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  
  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    departmentId: '',
    managerId: '',
    hireDate: '',
    profilePicture: ''
  });

  useEffect(() => {
    // Fetch data using Redux actions
    dispatch(fetchEmployees());
    dispatch(fetchDepartments());
    
    // Clean up when component unmounts
    return () => {
      dispatch(clearEmployeeError());
      dispatch(clearCurrentEmployee());
    };
  }, [dispatch]);

  useEffect(() => {
    // Update form when selected employee changes
    if (selectedEmployee && openDialog) {
      setFormData({
        firstName: selectedEmployee.firstName || '',
        lastName: selectedEmployee.lastName || '',
        email: selectedEmployee.email || '',
        position: selectedEmployee.position || '',
        departmentId: selectedEmployee.departmentId || '',
        managerId: selectedEmployee.managerId || '',
        hireDate: selectedEmployee.hireDate ? dateUtils.formatDateForApi(new Date(selectedEmployee.hireDate)) : '',
        profilePicture: selectedEmployee.profilePicture || ''
      });
    }
  }, [selectedEmployee, openDialog]);

  const handleOpenDialog = (employee: Employee | null = null) => {
    if (employee) {
      // Fetch fresh employee data (optional)
      dispatch(fetchEmployeeById(employee.id));
    } else {
      dispatch(clearCurrentEmployee());
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        position: '',
        departmentId: '',
        managerId: '',
        hireDate: '',
        profilePicture: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenViewDialog = async (employeeId: string) => {
    dispatch(fetchEmployeeById(employeeId));
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async () => {
    try {
      if (selectedEmployee) {
        // Create an object that preserves the missing properties from the selectedEmployee
        const updatedEmployee: Employee = {
          ...selectedEmployee,  // This preserves authUserId, role, and other fields
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          position: formData.position,
          departmentId: formData.departmentId,
          managerId: formData.managerId || null,  // Convert empty string to null
          hireDate: formData.hireDate,
          profilePicture: formData.profilePicture
        };
        
        await dispatch(updateEmployee(updatedEmployee)).unwrap();
      } else {
        // For new employees, you may need to provide default values for required fields
        const newEmployee: Omit<Employee, 'id'> = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          position: formData.position,
          departmentId: formData.departmentId,
          managerId: formData.managerId || null,  // Convert empty string to null
          hireDate: formData.hireDate,
          profilePicture: formData.profilePicture,
          role: RoleName.ROLE_STAFF,  // Set default role for new employees
          authUserId: null,  // This will be set on the backend
          // Add any other required fields from the Employee type with appropriate default values
        };
        
        await dispatch(createEmployee(newEmployee)).unwrap();
      }
      
      handleCloseDialog();
    } catch (err) {
      // Error is handled by Redux
      console.error('Error saving employee:', err);
    }
  };

  // Check if user has permission to access this page
  const isAdmin = user?.role === RoleName.ROLE_ADMIN;
  const isManager = user?.role === RoleName.ROLE_MANAGER || isAdmin;
  
  if (!isManager) {
    return (
      <MainLayout>
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            You don't have permission to access this page.
          </Alert>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Employees</Typography>
        {isAdmin && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
          >
            Add Employee
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        {(loading && !employees.length) ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Hire Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={employee.profilePicture} 
                          alt={employee.firstName}
                          sx={{ mr: 2 }}
                        >
                          {employee.firstName?.[0]}{employee.lastName?.[0]}
                        </Avatar>
                        <Typography>
                          {employee.firstName} {employee.lastName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>
                      {departments.find(d => d.id === employee.departmentId)?.name || 'N/A'}
                    </TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{dateUtils.formatDate(employee.hireDate)}</TableCell>
                    <TableCell>
                      <IconButton 
                        onClick={() => handleOpenViewDialog(employee.id)}
                        color="primary"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      {isAdmin && (
                        <IconButton 
                          onClick={() => handleOpenDialog(employee)}
                          color="secondary"
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Create/Edit Employee Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Department</InputLabel>
                <Select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleInputChange}
                  label="Department"
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Manager</InputLabel>
                <Select
                  name="managerId"
                  value={formData.managerId}
                  onChange={handleInputChange}
                  label="Manager"
                >
                  <MenuItem value="">No Manager</MenuItem>
                  {employees.map((emp) => (
                    <MenuItem 
                      key={emp.id} 
                      value={emp.id}
                      disabled={selectedEmployee && selectedEmployee.id === emp.id}
                    >
                      {emp.firstName} {emp.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Hire Date"
                name="hireDate"
                type="date"
                value={formData.hireDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Profile Picture URL"
                name="profilePicture"
                value={formData.profilePicture}
                onChange={handleInputChange}
                helperText="Enter the URL of the profile picture"
              />
            </Grid>
          </Grid>
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

      {/* View Employee Dialog */}
      <Dialog open={openViewDialog} onClose={handleCloseViewDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Employee Details</DialogTitle>
        <DialogContent>
          {selectedEmployee && (
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Avatar
                  src={selectedEmployee.profilePicture}
                  alt={selectedEmployee.firstName}
                  sx={{ width: 100, height: 100 }}
                >
                  {selectedEmployee.firstName?.[0]}{selectedEmployee.lastName?.[0]}
                </Avatar>
              </Box>
              
              <Typography variant="h6" align="center" gutterBottom>
                {selectedEmployee.firstName} {selectedEmployee.lastName}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Chip 
                  label={selectedEmployee.position} 
                  color="primary" 
                  variant="outlined"
                  sx={{ mr: 1 }}
                />
                <Chip 
                  label={departments.find(d => d.id === selectedEmployee.departmentId)?.name || 'No Department'} 
                  color="secondary"
                  variant="outlined"
                />
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Email</Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedEmployee.email}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Hire Date</Typography>
                  <Typography variant="body1" gutterBottom>
                    {dateUtils.formatDate(selectedEmployee.hireDate)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Manager</Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedEmployee.managerId 
                      ? employees.find(e => e.id === selectedEmployee.managerId)
                        ? `${employees.find(e => e.id === selectedEmployee.managerId)?.firstName} ${employees.find(e => e.id === selectedEmployee.managerId)?.lastName}`
                        : 'Unknown Manager'
                      : 'No Manager'
                    }
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
          {isAdmin && selectedEmployee && (
            <Button
              onClick={() => {
                handleCloseViewDialog();
                handleOpenDialog(selectedEmployee);
              }}
              variant="contained"
              color="primary"
            >
              Edit
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default EmployeesPage;