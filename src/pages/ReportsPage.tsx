import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  Button, 
  CircularProgress, 
  Tabs, 
  Tab, 
  Card, 
  CardContent,
  Alert
} from '@mui/material';
import MainLayout from '../components/Layout/MainLayout';
import { reportService } from '../api/reportService';
import { useAuth } from '../contexts/AuthContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ReportsPage = () => {
  const { user, isAdmin, isManager } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [departmentData, setDepartmentData] = useState([]);
  const [leaveTypeData, setLeaveTypeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    if (activeTab === 0) {
      fetchDepartmentData();
    } else if (activeTab === 1) {
      fetchLeaveTypeData();
    }
  }, [activeTab]);

  const fetchDepartmentData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportService.getLeaveByDepartment();
      setDepartmentData(data);
    } catch (err) {
      setError(err.message || 'Failed to load department report data');
      console.error('Error fetching department data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveTypeData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportService.getLeaveByType();
      setLeaveTypeData(data);
    } catch (err) {
      setError(err.message || 'Failed to load leave type report data');
      console.error('Error fetching leave type data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      setLoading(true);
      await reportService.exportToCsv();
    } catch (err) {
      setError(err.message || 'Failed to export CSV');
      console.error('Error exporting to CSV:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setLoading(true);
      await reportService.exportToExcel();
    } catch (err) {
      setError(err.message || 'Failed to export Excel');
      console.error('Error exporting to Excel:', err);
    } finally {
      setLoading(false);
    }
  };

  // Only allow access to managers and admins
  if (!isManager()) {
    return (
      <MainLayout>
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Access Denied
          </Alert>
          <Typography variant="body1">
            You don't have permission to view reports.
          </Typography>
        </Box>
      </MainLayout>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <MainLayout>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Reports
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="By Department" />
        <Tab label="By Leave Type" />
        {isAdmin() && <Tab label="Export Options" />}
      </Tabs>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ p: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      ) : (
        <>
          <TabPanel value={activeTab} index={0}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Leave Distribution by Department
                </Typography>
                {departmentData.length > 0 ? (
                  <Box sx={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={departmentData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="departmentName" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="approved" name="Approved" fill="#4caf50" />
                        <Bar dataKey="pending" name="Pending" fill="#ff9800" />
                        <Bar dataKey="rejected" name="Rejected" fill="#f44336" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                ) : (
                  <Typography>No department data available</Typography>
                )}
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Leave Distribution by Type
                </Typography>
                {leaveTypeData.length > 0 ? (
                  <Box sx={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={leaveTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="typeName"
                          label={({ typeName, percent }) => 
                            `${typeName}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {leaveTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                ) : (
                  <Typography>No leave type data available</Typography>
                )}
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            {isAdmin() && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Export to CSV
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Export all leave data to a CSV file for further analysis.
                    </Typography>
                    <Button 
                      variant="contained" 
                      onClick={handleExportCSV}
                      color="primary"
                      disabled={loading}
                    >
                      Export CSV
                    </Button>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Export to Excel
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Export all leave data to an Excel file for advanced reporting.
                    </Typography>
                    <Button 
                      variant="contained" 
                      onClick={handleExportExcel}
                      color="success"
                      disabled={loading}
                    >
                      Export Excel
                    </Button>
                  </Paper>
                </Grid>
              </Grid>
            )}
          </TabPanel>
        </>
      )}
    </MainLayout>
  );
};

export default ReportsPage;