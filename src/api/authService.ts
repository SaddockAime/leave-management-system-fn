import axios from 'axios';
import { config } from '../config/config';

const API_URL = `${config.apiBaseUrl}/auth`;

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: any;
}

interface TokenValidationResponse {
  valid: boolean;
  user?: any;
}

export const authApi = {
  /**
   * Register a new user
   */
  async register(firstName: string, lastName: string, email: string, password: string): Promise<any> {
    try {
      const data = { firstName, lastName, email, password };
      const response = await axios.post(`${API_URL}/register`, data);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Login a user
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const data = { email, password };
      const response = await axios.post(`${API_URL}/login`, data);
      
      // Save token to localStorage
      if (response.data.token) {
        localStorage.setItem(config.authTokenKey, response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Logout the current user
   */
  logout(): void {
    localStorage.removeItem(config.authTokenKey);
  },

  /**
   * Validate the current token
   */
  async validateToken(): Promise<TokenValidationResponse> {
    const token = localStorage.getItem(config.authTokenKey);
    
    if (!token) {
      return { valid: false };
    }
    
    try {
      const response = await axios.post(`${API_URL}/validate-token`, {});
      return response.data;
    } catch (error) {
      console.error('Token validation error:', error);
      localStorage.removeItem(config.authTokenKey);
      return { valid: false };
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem(config.authTokenKey);
  },

  /**
   * Get current auth token
   */
  getToken(): string | null {
    return localStorage.getItem(config.authTokenKey);
  }
};