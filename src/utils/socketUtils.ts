import { socketService } from '../api/socketService';
import { config } from '../config/config';
import { addNotification } from '../redux/slices/notificationSlice';
import { store } from '../redux/store';

/**
 * Check if a valid token exists and connect to socket if it does
 */
export const checkTokenAndConnect = (): void => {
  const token = localStorage.getItem(config.authTokenKey);
  if (token) {
    socketService.connect(token);
  }
};

/**
 * Register all necessary socket event listeners
 */
export const registerSocketListeners = (): void => {
  // Leave request notifications
  socketService.addListener('leave_request_created', (data: any) => {
    console.log('Leave request created:', data);
    store.dispatch(addNotification({
      id: Date.now().toString(), // temporary ID until server sync
      recipientId: data.managerId || 'admin',
      title: 'New Leave Request',
      message: `${data.employee.firstName} ${data.employee.lastName} requested leave from ${new Date(data.startDate).toLocaleDateString()} to ${new Date(data.endDate).toLocaleDateString()}`,
      type: 'LEAVE_REQUEST',
      read: false,
      relatedEntityId: data.id,
      entityType: 'LEAVE_REQUEST',
      createdAt: new Date()
    }));
  });
  
  socketService.addListener('leave_request_approved', (data: any) => {
    console.log('Leave request approved:', data);
    store.dispatch(addNotification({
      id: Date.now().toString(),
      recipientId: data.employeeId,
      title: 'Leave Request Approved',
      message: `Your leave request from ${new Date(data.startDate).toLocaleDateString()} to ${new Date(data.endDate).toLocaleDateString()} has been approved`,
      type: 'LEAVE_APPROVED',
      read: false,
      relatedEntityId: data.id,
      entityType: 'LEAVE_REQUEST',
      createdAt: new Date()
    }));
  });
  
  socketService.addListener('leave_request_rejected', (data: any) => {
    console.log('Leave request rejected:', data);
    store.dispatch(addNotification({
      id: Date.now().toString(),
      recipientId: data.employeeId,
      title: 'Leave Request Rejected',
      message: `Your leave request from ${new Date(data.startDate).toLocaleDateString()} to ${new Date(data.endDate).toLocaleDateString()} has been rejected: ${data.comments || 'No reason provided'}`,
      type: 'LEAVE_REJECTED',
      read: false,
      relatedEntityId: data.id,
      entityType: 'LEAVE_REQUEST',
      createdAt: new Date()
    }));
  });
  
  socketService.addListener('leave_request_canceled', (data: any) => {
    console.log('Leave request canceled:', data);
    if (data.managerId) {
      store.dispatch(addNotification({
        id: Date.now().toString(),
        recipientId: data.managerId,
        title: 'Leave Request Canceled',
        message: `${data.employee.firstName} ${data.employee.lastName} has canceled their leave request from ${new Date(data.startDate).toLocaleDateString()} to ${new Date(data.endDate).toLocaleDateString()}`,
        type: 'LEAVE_CANCELED',
        read: false,
        relatedEntityId: data.id,
        entityType: 'LEAVE_REQUEST',
        createdAt: new Date()
      }));
    }
  });
};