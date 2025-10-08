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
