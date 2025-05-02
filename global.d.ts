declare module 'react-redux';
declare module 'socket.io-client';
declare module '@mui/x-date-pickers/DatePicker';
declare module '@mui/x-date-pickers/LocalizationProvider';
declare module '@mui/x-date-pickers/AdapterDateFns';

type AppDispatch = any;
type RootState = any;
type Socket = any;

interface LeaveType {
  id: number;
  name: string;
}
