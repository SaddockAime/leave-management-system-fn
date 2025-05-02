import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import { employeeService } from '../api/employeeService';
import { departmentService } from '../api/departmentService';
import { useAuth } from '../contexts/AuthContext';

const OnboardingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    position: '',
    departmentId: '',
    hireDate: ''
  });

  useEffect(() => {
    checkOnboardingStatus();
    fetchDepartments();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      setLoading(true);
      // Try to get current profile, if it exists, redirect to dashboard
      await employeeService.getMyProfile();
      // If no error, profile exists
      navigate('/dashboard');
    } catch (error) {
      // Profile doesn't exist, continue with onboarding
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await departmentService.getDepartments();
      setDepartments(data);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError('Failed to load departments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        return !!formData.position;
      case 1:
        return !!formData.departmentId;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await employeeService.onboardSelf(formData);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Onboarding error:', err);
      setError(err.message || 'Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    'Basic Information',
    'Department Selection',
    'Review & Confirm'
  ];

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ py: 3 }}>
            <Typography variant="h6" gutterBottom>
              Let's get started with your position
            </Typography>
            <TextField
              fullWidth
              label="Your Position"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Hire Date (Optional)"
              name="hireDate"
              type="date"
              value={formData.hireDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ py: 3 }}>
            <Typography variant="h6" gutterBottom>
              Select your department
            </Typography>
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
          </Box>
        );
      case 2:
        return (
          <Box sx={{ py: 3 }}>
            <Typography variant="h6" gutterBottom>
              Review your information
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle2">Name</Typography>
              <Typography variant="body1" gutterBottom>
                {user?.firstName} {user?.lastName}
              </Typography>
              
              <Typography variant="subtitle2">Email</Typography>
              <Typography variant="body1" gutterBottom>
                {user?.email}
              </Typography>
              
              <Typography variant="subtitle2">Position</Typography>
              <Typography variant="body1" gutterBottom>
                {formData.position}
              </Typography>
              
              <Typography variant="subtitle2">Department</Typography>
              <Typography variant="body1" gutterBottom>
                {departments.find(d => d.id === formData.departmentId)?.name || 'Not selected'}
              </Typography>
              
              {formData.hireDate && (
                <>
                  <Typography variant="subtitle2">Hire Date</Typography>
                  <Typography variant="body1" gutterBottom>
                    {formData.hireDate}
                  </Typography>
                </>
              )}
            </Paper>
            <Typography variant="body2" color="text.secondary">
              Please confirm that all information is correct. You can edit some details later in your profile.
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Employee Onboarding
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success ? (
        <Alert severity="success" sx={{ mb: 3 }}>
          Onboarding completed successfully! Redirecting to dashboard...
        </Alert>
      ) : (
        <Paper sx={{ p: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {renderStepContent(activeStep)}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Box>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                      disabled={!validateStep(activeStep)}
                    >
                      Complete Onboarding
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      disabled={!validateStep(activeStep)}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Box>
            </>
          )}
        </Paper>
      )}
    </MainLayout>
  );
};

export default OnboardingPage;