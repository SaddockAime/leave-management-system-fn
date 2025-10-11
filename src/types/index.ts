// User and Auth Types
export type UserRole = 'GUEST' | 'EMPLOYEE' | 'MANAGER' | 'HR_MANAGER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING';
export type OnboardingStatus = 'GUEST_AWAITING_PROFILE' | 'PENDING_APPROVAL' | 'ACTIVE_EMPLOYEE';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  profilePicture?: string;
  isActive: boolean;
  lastLogin?: string;
  employeeId?: string;
  department?: string;
  emailVerified: boolean;
}

export interface UserStatusData {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  emailVerified: boolean;
  hasEmployeeProfile: boolean;
  needsEmployeeProfile: boolean;
  status: OnboardingStatus;
}

// Auth Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResendVerificationRequest {
  email: string;
}

// Auth Response Types
export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    refreshToken: string;
    expiresIn: number;
  };
  error?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    emailVerified: boolean;
    message: string;
  };
  error?: string;
}

export interface UserInfoResponse {
  success: boolean;
  message: string;
  data?: User;
  error?: string;
}

export interface UserStatusResponse {
  success: boolean;
  data?: UserStatusData;
  error?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Pagination Types
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
}

// User Management Types
export interface UserListItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  profilePicture?: string;
  lastLogin?: string;
  createdAt: string;
  employeeId: string | null;
  department: string;
  position: string;
  hasEmployeeRecord: boolean;
}

export interface UpdateUserRoleRequest {
  roleIds: string[];
}

export interface UpdateUserStatusRequest {
  status: UserStatus;
}

// Employee Management Types
export interface Employee {
  id: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  position: string;
  hireDate: string;
  status: string;
  department: {
    id: string;
    name: string;
  };
  manager?: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

export interface CreateEmployeeRequest {
  userId: string;
  position: string;
  departmentId: string;
  hireDate?: string;
  managerId?: string;
}

export interface UpdateEmployeeRequest {
  position?: string;
  departmentId?: string;
  managerId?: string;
  status?: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  managerId?: string;
  manager?: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };
  employees?: Employee[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDepartmentRequest {
  name: string;
  description?: string;
  managerId?: string;
}

export interface UpdateDepartmentRequest {
  name?: string;
  description?: string;
  managerId?: string;
}

// Leave Management Types
export interface LeaveType {
  id: string;
  name: string;
  description?: string;
  defaultDays: number;
  color?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLeaveTypeRequest {
  name: string;
  description?: string;
  defaultDays: number;
  color?: string;
  active?: boolean;
}

export interface UpdateLeaveTypeRequest {
  name?: string;
  description?: string;
  defaultDays?: number;
  color?: string;
  active?: boolean;
}

export type LeaveRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface LeaveRequest {
  id: string;
  employee: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
    department?: {
      id: string;
      name: string;
    };
  };
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveRequestStatus;
  numberOfDays: number;
  approvedBy?: string;
  rejectedBy?: string;
  cancelledBy?: string;
  approverComments?: string;
  rejectionReason?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeaveRequestRequest {
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface UpdateLeaveRequestRequest {
  startDate?: string;
  endDate?: string;
  reason?: string;
}

export interface ApproveLeaveRequest {
  comments?: string;
}

export interface RejectLeaveRequest {
  reason: string;
}

export interface CancelLeaveRequest {
  reason?: string;
}
