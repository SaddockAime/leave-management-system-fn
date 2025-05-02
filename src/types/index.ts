export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: RoleName;
}

export enum RoleName {
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_MANAGER = 'ROLE_MANAGER',
  ROLE_STAFF = 'ROLE_STAFF'
}

export interface Employee {
  id: string;
  authUserId: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  departmentId: string;
  managerId?: string;
  role: RoleName;
  hireDate: string;
  profilePicture?: string;
  department?: Department;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: Date;
  endDate: Date;
  days: number;
  reason?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  approvedById?: string;
  approvalDate?: Date;
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
  employee?: Employee;
  leaveType?: LeaveType;
}

export interface LeaveType {
  id: string;
  name: string;
  description?: string;
  accrualRate: number;
  requiresDocumentation: boolean;
  requiresApproval: boolean;
  maxDays?: number;
  maxConsecutiveDays?: number;
  active: boolean;
  color?: string;
}

export interface LeaveBalance {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  year: number;
  total: number;
  used: number;
  pending: number;
  employee?: Employee;
  leaveType?: LeaveType;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  manager?: Employee;
}

export interface Notification {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  relatedEntityId?: string;
  entityType?: string;
  createdAt: Date;
  recipient?: Employee;
}

export interface LoginResponse {
  token: string;
  user: Employee;
}

export interface CreateLeaveRequestDto {
  employeeId: string;
  leaveTypeId: string;
  startDate: Date;
  endDate: Date;
  reason?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateEmployeeDto {
  authUserId: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  departmentId: string;
  managerId?: string;
  hireDate?: Date;
  profilePicture?: string;
}

export interface CreateDepartmentDto {
  name: string;
  description?: string;
  managerId?: string;
}

export interface CreateLeaveTypeDto {
  name: string;
  description?: string;
  accrualRate: number;
  requiresDocumentation: boolean;
  requiresApproval: boolean;
  maxDays?: number;
  maxConsecutiveDays?: number;
  active?: boolean;
  color?: string;
}

export interface LeaveBalanceAdjustmentDto {
  employeeId: string;
  leaveTypeId: string;
  adjustment: number;
  reason: string;
}

export interface ApproveRejectLeaveRequestDto {
  comments?: string;
}
