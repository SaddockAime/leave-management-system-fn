import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
  Alert,
  Box,
  Tabs,
  Tab
} from '@mui/material';
import { format } from 'date-fns';
import { LeaveRequest } from '../../types';
import { RoleName } from '../../types'; // Import the RoleName enum
import {
  fetchMyLeaves,
  approveLeaveRequest,
  rejectLeaveRequest,
  cancelLeaveRequest,
  selectLeaveRequests,
  selectLeaveRequestsLoading,
  selectLeaveRequestsError
} from '../../redux/slices/leaveRequestSlice';
import { selectUser } from '../../redux/slices/authSlice';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`leave-tabpanel-${index}`}
      aria-labelledby={`leave-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `leave-tab-${index}`,
    'aria-controls': `leave-tabpanel-${index}`,
  };
}

const LeaveRequestList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  // Use selectors for consistency
  const user = useSelector(selectUser);
  const leaveRequests = useSelector(selectLeaveRequests);
  const loading = useSelector(selectLeaveRequestsLoading);
  const error = useSelector(selectLeaveRequestsError);
  const isManager = user?.role === RoleName.ROLE_MANAGER || user?.role === RoleName.ROLE_ADMIN;

  const [tabValue, setTabValue] = useState(0);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [approveComments, setApproveComments] = useState('');

  useEffect(() => {
    dispatch(fetchMyLeaves());
  }, [dispatch]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleApproveClick = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setOpenApproveDialog(true);
  };

  const handleRejectClick = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setOpenRejectDialog(true);
  };

  const handleCancelClick = async (requestId: string) => {
    if (window.confirm('Are you sure you want to cancel this leave request?')) {
      try {
        await dispatch(cancelLeaveRequest(requestId)).unwrap();
      } catch (error) {
        console.error('Failed to cancel leave request', error);
      }
    }
  };

  const handleApproveConfirm = async () => {
    if (selectedRequest) {
      try {
        await dispatch(approveLeaveRequest({
          id: selectedRequest.id,
          comments: approveComments
        })).unwrap();
        setOpenApproveDialog(false);
        setApproveComments('');
      } catch (error) {
        console.error('Failed to approve leave request', error);
      }
    }
  };

  const handleRejectConfirm = async () => {
    if (selectedRequest && rejectReason) {
      try {
        await dispatch(rejectLeaveRequest({
          id: selectedRequest.id,
          comments: rejectReason
        })).unwrap();
        setOpenRejectDialog(false);
        setRejectReason('');
      } catch (error) {
        console.error('Failed to reject leave request', error);
      }
    }
  };

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'error';
      case 'CANCELLED': return 'default';
      case 'PENDING': return 'warning';
      default: return 'default';
    }
  };
  const pendingRequests = leaveRequests.filter(req => req.status === 'PENDING');
  const approvedRequests = leaveRequests.filter(req => req.status === 'APPROVED');
  const rejectedRequests = leaveRequests.filter(req => req.status === 'REJECTED');
  const cancelledRequests = leaveRequests.filter(req => req.status === 'CANCELLED');

  const renderLeaveRequestTable = (requests: LeaveRequest[]) => {
    if (requests.length === 0) {
      return <Typography variant="body1">No leave requests found.</Typography>;
    }

    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Leave Type</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Days</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.leaveType?.name || 'Unknown'}</TableCell>
                <TableCell>{format(new Date(request.startDate), 'MMM dd, yyyy')}</TableCell>
                <TableCell>{format(new Date(request.endDate), 'MMM dd, yyyy')}</TableCell>
                <TableCell>{request.days}</TableCell>
                <TableCell>
                  <Chip 
                    label={request.status} 
                    color={getStatusChipColor(request.status) as any} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  {request.status === 'PENDING' && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {isManager && (
                        <>
                          <Button 
                            size="small" 
                            variant="contained" 
                            color="success" 
                            onClick={() => handleApproveClick(request)}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="small" 
                            variant="contained" 
                            color="error" 
                            onClick={() => handleRejectClick(request)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {(user?.id === request.employeeId) && (
                        <Button 
                          size="small" 
                          variant="outlined" 
                          color="warning" 
                          onClick={() => handleCancelClick(request.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 0 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="leave request tabs">
          <Tab label={`Pending (${pendingRequests.length})`} {...a11yProps(0)} />
          <Tab label={`Approved (${approvedRequests.length})`} {...a11yProps(1)} />
          <Tab label={`Rejected (${rejectedRequests.length})`} {...a11yProps(2)} />
          <Tab label={`Cancelled (${cancelledRequests.length})`} {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        {renderLeaveRequestTable(pendingRequests)}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {renderLeaveRequestTable(approvedRequests)}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {renderLeaveRequestTable(rejectedRequests)}
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        {renderLeaveRequestTable(cancelledRequests)}
      </TabPanel>

      {/* Reject Dialog */}
      <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)}>
        <DialogTitle>Reject Leave Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a reason for rejecting this leave request.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="reason"
            label="Reason for Rejection"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRejectDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleRejectConfirm} 
            color="error" 
            disabled={!rejectReason.trim()}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={openApproveDialog} onClose={() => setOpenApproveDialog(false)}>
        <DialogTitle>Approve Leave Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add optional comments for this approval.
          </DialogContentText>
          <TextField
            margin="dense"
            id="comments"
            label="Comments (Optional)"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={approveComments}
            onChange={(e) => setApproveComments(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenApproveDialog(false)}>Cancel</Button>
          <Button onClick={handleApproveConfirm} color="success">
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default LeaveRequestList;
