import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  IconButton, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Avatar,
  useMediaQuery,
  useTheme,
  Badge,
  Menu,
  MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import AssessmentIcon from '@mui/icons-material/Assessment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { logout } from '../../redux/slices/authSlice';
import { markAsRead } from '../../redux/slices/notificationSlice';

const drawerWidth = 260;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notifications.items);
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const notificationsOpen = Boolean(notificationAnchorEl);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  
  const handleNotificationsClose = () => {
    setNotificationAnchorEl(null);
  };
  
  const handleNotificationClick = (notificationId: string, entityType?: string, entityId?: string) => {
    // Mark notification as read
    dispatch(markAsRead(notificationId));
    
    // Navigate to related entity if available
    if (entityType === 'LEAVE_REQUEST' && entityId) {
      navigate(`/leave-requests?id=${entityId}`);
    }
    
    handleNotificationsClose();
  };

  // Define menu items with role-based access
  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <DashboardIcon />, 
      onClick: () => navigate('/dashboard'),
      roles: ['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_STAFF']
    },
    { 
      text: 'Leave Requests', 
      icon: <RequestPageIcon />, 
      onClick: () => navigate('/leave-requests'),
      roles: ['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_STAFF']
    },
    { 
      text: 'Leave Calendar', 
      icon: <CalendarTodayIcon />, 
      onClick: () => navigate('/calendar'),
      roles: ['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_STAFF']
    },
    { 
      text: 'Reports', 
      icon: <AssessmentIcon />, 
      onClick: () => navigate('/reports'),
      roles: ['ROLE_ADMIN', 'ROLE_MANAGER']
    },
    { 
      text: 'Employees', 
      icon: <PeopleIcon />, 
      onClick: () => navigate('/employees'),
      roles: ['ROLE_ADMIN', 'ROLE_MANAGER']
    },
    { 
      text: 'Departments', 
      icon: <BusinessIcon />, 
      onClick: () => navigate('/departments'),
      roles: ['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_USER']
    },
    { 
      text: 'Profile', 
      icon: <PersonIcon />, 
      onClick: () => navigate('/profile'),
      roles: ['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_STAFF']
    },
    { 
      text: 'Leave Types', 
      icon: <CategoryIcon />, 
      onClick: () => navigate('/leave-types'),
      roles: ['ROLE_ADMIN'] // Only for admin
    }
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => {
    if (!user || !user.role) return false;
    return item.roles.includes(user.role);
  });

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Leave Management
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => {
              item.onClick();
              if (isMobile) setMobileOpen(false);
            }}>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          
          {/* Notifications */}
          <IconButton color="inherit" onClick={handleNotificationsOpen}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Menu
            id="notifications-menu"
            anchorEl={notificationAnchorEl}
            open={notificationsOpen}
            onClose={handleNotificationsClose}
            sx={{ mt: 1 }}
            PaperProps={{
              style: { maxWidth: 350, maxHeight: 400 }
            }}
          >
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <MenuItem 
                  key={notification.id}
                  onClick={() => handleNotificationClick(
                    notification.id, 
                    notification.entityType, 
                    notification.relatedEntityId
                  )}
                  sx={{ 
                    backgroundColor: notification.read ? 'inherit' : '#f0f7ff',
                    whiteSpace: 'normal'
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle2">{notification.title}</Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(notification.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                </MenuItem>
              ))
            ) : (
              <MenuItem>
                <Typography variant="body2">No notifications</Typography>
              </MenuItem>
            )}
          </Menu>

          {/* User avatar */}
          <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar 
              sx={{ width: 32, height: 32 }}
              alt={`${user?.firstName} ${user?.lastName}`}
              src={user?.profilePicture || ""}
            />
            <Typography variant="body2" sx={{ ml: 1, display: { xs: 'none', md: 'block' } }}>
              {user?.firstName} {user?.lastName}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: '#f5f5f5'
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;