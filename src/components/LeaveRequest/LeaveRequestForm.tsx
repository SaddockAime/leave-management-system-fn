import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { 
  Button, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  TextField, 
  Typography, 
  Paper,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { CustomGridItemProps } from '../../types/GridTypes';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { createLeaveRequest } from '../../redux/slices/leaveRequestSlice';
import { differenceInDays, addDays } from 'date-fns';
import { 
  fetchLeaveTypes, 
  selectAllLeaveTypes, 
  selectLeaveTypesLoading, 
  selectLeaveTypesError 
} from '../../redux/slices/leaveTypeSlice';
import { selectUser } from '../../redux/slices/authSlice';
import {
  selectLeaveRequestsLoading,
  selectLeaveRequestsError
} from '../../redux/slices/leaveRequestSlice';


// Leave types will be fetched from the API

const LeaveRequestValidationSchema = Yup.object().shape({
  leaveTypeId: Yup.string().required('Leave type is required'),
  startDate: Yup.date()
    .required('Start date is required')
    .min(new Date(), 'Start date cannot be in the past'),
  endDate: Yup.date()
    .required('End date is required')
    .min(Yup.ref('startDate'), 'End date must be after start date'),
  reason: Yup.string()
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason cannot exceed 500 characters')
    .when('leaveTypeId', {
      is: (leaveTypeId: string, schema: any) => {
        // We'll check if the selected leave type requires a reason in the component
        return false;
      },
      then: (schema) => schema.required('Reason is required'),
      otherwise: (schema) => schema.optional()
    })
});

const LeaveRequestForm: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector(selectUser);
  const loading = useSelector(selectLeaveRequestsLoading);
  const error = useSelector(selectLeaveRequestsError);
  
  
  const leaveTypes = useSelector(selectAllLeaveTypes);
  const loadingLeaveTypes = useSelector(selectLeaveTypesLoading);
  const leaveTypeError = useSelector(selectLeaveTypesError);
  const [calculatedDays, setCalculatedDays] = useState(0);
  const [formValues, setFormValues] = useState({
    leaveTypeId: '',
    startDate: null,
    endDate: null,
    reason: '',
  });

  // Fetch leave types when component mounts
  useEffect(() => {
    dispatch(fetchLeaveTypes());
  }, [dispatch]);

  // Get selected leave type
  const getSelectedLeaveType = () => {
    if (!formValues.leaveTypeId) return null;
    return leaveTypes.find(type => type.id === formValues.leaveTypeId);
  };

  // Check if reason is required based on selected leave type
  const isReasonRequired = () => {
    const selectedType = getSelectedLeaveType();
    return selectedType?.requiresDocumentation || false;
  };

  const formik = useFormik({
    initialValues: formValues,
    validationSchema: LeaveRequestValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        // Check if days exceed max consecutive days for the leave type
        const selectedLeaveType = getSelectedLeaveType();
        if (selectedLeaveType?.maxConsecutiveDays && calculatedDays > selectedLeaveType.maxConsecutiveDays) {
          formik.setFieldError('endDate', `This leave type allows a maximum of ${selectedLeaveType.maxConsecutiveDays} consecutive days`);
          return;
        }

        // Check if reason is required but not provided
        if (isReasonRequired() && !values.reason) {
          formik.setFieldError('reason', 'Reason is required for this leave type');
          return;
        }

        await dispatch(createLeaveRequest({
          leaveTypeId: values.leaveTypeId,
          startDate: values.startDate,
          endDate: values.endDate,
          reason: values.reason,
          employeeId: user?.id || '', // Add required employeeId field
          status: 'PENDING'
        })).unwrap();
        resetForm();
        setCalculatedDays(0);
      } catch (err) {
        console.error('Leave request submission failed', err);
      }
    }
  });

  // Calculate number of days when dates change
  useEffect(() => {
    if (formik.values.startDate && formik.values.endDate) {
      const start = new Date(formik.values.startDate);
      const end = new Date(formik.values.endDate);
      const days = differenceInDays(end, start) + 1; // Include both start and end days
      setCalculatedDays(days > 0 ? days : 0);
    } else {
      setCalculatedDays(0);
    }
  }, [formik.values.startDate, formik.values.endDate]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper elevation={3} sx={{ p: 3, maxWidth: 600, margin: 'auto' }}>
        <Typography variant="h5" gutterBottom>
          Submit Leave Request
        </Typography>
        
        {leaveTypeError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {leaveTypeError}
          </Alert>
        )}
        
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid {...{ item: true, xs: 12, component: 'div' }}>
              <FormControl fullWidth error={formik.touched.leaveTypeId && Boolean(formik.errors.leaveTypeId)}>
                <InputLabel>Leave Type</InputLabel>
                <Select
                  name="leaveTypeId"
                  value={formik.values.leaveTypeId}
                  label="Leave Type"
                  onChange={formik.handleChange}
                  disabled={loadingLeaveTypes}
                >
                  {loadingLeaveTypes ? (
                    <MenuItem disabled>Loading leave types...</MenuItem>
                  ) : (
                    leaveTypes.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {formik.touched.leaveTypeId && formik.errors.leaveTypeId && (
                  <Typography color="error" variant="caption">
                    {formik.errors.leaveTypeId}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid {...{ item: true, xs: 12, component: 'div' }}>
              <DatePicker
                label="Start Date"
                value={formik.values.startDate}
                onChange={(value) => formik.setFieldValue('startDate', value)}
                slots={{
                  textField: (params) => (
                    <TextField 
                      {...params} 
                      fullWidth 
                      error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                      helperText={formik.touched.startDate && formik.errors.startDate}
                    />
                  )
                }}
              />
            </Grid>
            <Grid {...{ item: true, xs: 12, component: 'div' }}>
              <DatePicker
                label="End Date"
                value={formik.values.endDate}
                onChange={(value) => formik.setFieldValue('endDate', value)}
                slots={{
                  textField: (params) => (
                    <TextField 
                      {...params} 
                      fullWidth 
                      error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                      helperText={formik.touched.endDate && formik.errors.endDate}
                    />
                  )
                }}
              />
            </Grid>
            <Grid {...{ item: true, xs: 12, component: 'div' }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="reason"
                label="Reason for Leave"
                value={formik.values.reason}
                onChange={formik.handleChange}
                error={formik.touched.reason && Boolean(formik.errors.reason)}
                helperText={formik.touched.reason && formik.errors.reason}
              />
            </Grid>
            {calculatedDays > 0 && (
              <Grid {...{ item: true, xs: 12, component: 'div' }}>
                <Alert severity="info">
                  <Typography variant="body2">
                    You are requesting <strong>{calculatedDays}</strong> day{calculatedDays !== 1 ? 's' : ''} of leave
                  </Typography>
                  {getSelectedLeaveType() && getSelectedLeaveType()?.maxConsecutiveDays && (
                    <Typography variant="body2">
                      Maximum consecutive days allowed: {getSelectedLeaveType()?.maxConsecutiveDays}
                    </Typography>
                  )}
                </Alert>
              </Grid>
            )}
            
            <Grid {...{ item: true, xs: 12, component: 'div' }}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth
                disabled={loading || loadingLeaveTypes}
              >
                {loading ? 'Submitting...' : 'Submit Leave Request'}
              </Button>
              {error && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
            </Grid>
          </Grid>
        </form>
      </Paper>
    </LocalizationProvider>
  );
};

export default LeaveRequestForm;
