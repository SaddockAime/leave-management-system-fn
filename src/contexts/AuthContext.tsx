import React, { createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  login as reduxLogin, 
  logout as reduxLogout, 
  validateToken,
  selectUser, 
  selectIsAuthenticated, 
  selectAuthLoading
} from '../redux/slices/authSlice';
import { config } from '../config/config';
import { AppDispatch } from '../redux/store';
// Import the RoleName enum
import { RoleName } from '../types'; // Adjust the import path as needed

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  login: (token: string, user: any) => void;
  logout: () => void;
  loading: boolean;
  isAdmin: () => boolean;
  isManager: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    dispatch(validateToken());
  }, [dispatch]);
  
  const login = (token: string, userData: any) => {
    localStorage.setItem(config.authTokenKey, token);
  };
  
  const logout = () => {
    dispatch(reduxLogout());
    navigate('/login');
  };
  
  // Fix: Use the proper enum value comparison
  const isAdmin = () => {
    return user?.role === RoleName.ROLE_ADMIN || false;
  };
  
  const isManager = () => {
    return user?.role === RoleName.ROLE_MANAGER || user?.role === RoleName.ROLE_ADMIN || false;
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        login, 
        logout, 
        loading,
        isAdmin,
        isManager
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};