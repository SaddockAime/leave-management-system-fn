import React, { useEffect, useState } from 'react';
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
  Alert,
  Chip,
  Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import MainLayout from '../components/Layout/MainLayout';
import { departmentService } from '../api/departmentService';
import { employeeService } from '../api/employeeService';
import { useAuth } from '../contexts/AuthContext';

const DepartmentsPage = () => {
  const { isAdmin } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departmentDetails, setDepartmentDetails] = useState(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    managerId: ''
  });

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await departmentService.getDepartments();
      setDepartments(data);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError(err.message || 'Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const fetchDepartmentDetails = async (id) => {
    try {
      setLoading(true);
      const data = await departmentService.getDepartmentById(id);
      setDepartmentDetails(data);
      setViewDetailsOpen(true);
    } catch (err) {
      console.error(`Error fetching department details for ${id}:`, err);
      setError(err.message || 'Failed to load department details');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (department = null) => {
    if (department) {
      setSelectedDepartment(department);
      setFormData({
        name: department.name || '',
        description: department.description || '',
        managerId: department.managerId || ''
      });
    } else {
      setSelectedDepartment(null);
      setFormData({
        name: '',
        description: '',
        managerId: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDeleteDialog = (department) => {
    setSelectedDepartment(department);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleCloseDetailsDialog = () => {
    setViewDetailsOpen(false);
    setDepartmentDetails(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      if (selectedDepartment) {
        await departmentService.updateDepartment(selectedDepartment.id, formData);
      } else {
        await departmentService.createDepartment(formData);
      }
      
      fetchDepartments();
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving department:', err);
      setError(err.message || 'Failed to save department');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await departmentService.deleteDepartment(selectedDepartment.id);
      fetchDepartments();
      handleCloseDeleteDialog();
    } catch (err) {
      console.error('Error deleting department:', err);
      setError(err.message || 'Failed to delete department');
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentManager = (managerId) => {
    if (!managerId) return 'No Manager';
    const manager = employees.find(emp => emp.id === managerId);
    return manager ? `${manager.firstName} ${manager.lastName}` : 'Unknown Manager';
  };

  const getDepartmentEmployeeCount = (departmentId) => {
    return employees.filter(emp => emp.departmentId === departmentId).length;
  };

  return (
    <MainLayout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Departments</Typography>
        {isAdmin() && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
          >
            Add Department
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading && !departments.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {departments.map((department) => (
            <Grid item xs={12} md={6} lg={4} key={department.id}>
              <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6">{department.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {department.description || 'No description'}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PeopleIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {getDepartmentEmployeeCount(department.id)} Employees
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    Manager: {getDepartmentManager(department.managerId)}
                  </Typography>
                </Box>
                <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    size="small"
                    onClick={() => fetchDepartmentDetails(department.id)}
                    sx={{ mr: 1 }}
                  >
                    View Details
                  </Button>
                  {isAdmin() && (
                    <>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleOpenDialog(department)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleOpenDeleteDialog(department)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create/Edit Department Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedDepartment ? 'Edit Department' : 'Add New Department'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Department Name"
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
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel>Department Manager</InputLabel>
              <Select
                name="managerId"
                value={formData.managerId}
                onChange={handleInputChange}
                label="Department Manager"
              >
                <MenuItem value="">No Manager</MenuItem>
                {employees.map((employee) => (
                  <MenuItem key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading || !formData.name}
          >
            {loading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the department "{selectedDepartment?.name}"?
            This action cannot be undone and may affect employees assigned to this department.
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

      {/* Department Details Dialog */}
      <Dialog open={viewDetailsOpen} onClose={handleCloseDetailsDialog} maxWidth="md" fullWidth>
        <DialogTitle>Department Details</DialogTitle>
        <DialogContent>
          {departmentDetails ? (
            <Box sx={{ p: 1 }}>
              <Typography variant="h6" gutterBottom>{departmentDetails.name}</Typography>
              <Typography variant="body1" paragraph>
                {departmentDetails.description || 'No description provided.'}
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Department Manager
              </Typography>
              <Box sx={{ mb: 3 }}>
                {departmentDetails.managerId ? (
                  <Chip 
                    label={getDepartmentManager(departmentDetails.managerId)} 
                    color="primary" 
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No manager assigned
                  </Typography>
                )}
              </Box>
              
              <Typography variant="subtitle1" gutterBottom>
                Department Members ({getDepartmentEmployeeCount(departmentDetails.id)})
              </Typography>
              
              {getDepartmentEmployeeCount(departmentDetails.id) > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Position</TableCell>
                        <TableCell>Email</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {employees
                        .filter(emp => emp.departmentId === departmentDetails.id)
                        .map(employee => (
                          <TableRow key={employee.id}>
                            <TableCell>{employee.firstName} {employee.lastName}</TableCell>
                            <TableCell>{employee.position}</TableCell>
                            <TableCell>{employee.email}</TableCell>
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No employees in this department yet.
                </Typography>
              )}
            </Box>
          ) : loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Typography color="error">Failed to load department details.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog}>Close</Button>
          {isAdmin() && departmentDetails && (
            <Button
              onClick={() => {
                handleCloseDetailsDialog();
                handleOpenDialog(departmentDetails);
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

export default DepartmentsPage;