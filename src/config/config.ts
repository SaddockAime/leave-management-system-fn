// Application configuration

interface AppConfig {
  apiBaseUrl: string;
  authTokenKey: string;
  validate: () => void;
}

export const config: AppConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  authTokenKey: import.meta.env.VITE_AUTH_TOKEN_KEY || 'leave_management_token',
  
  // Validate essential config
  validate() {
    if (!this.apiBaseUrl) {
      console.warn('API Base URL not provided in environment variables, using default');
    }
  }
};