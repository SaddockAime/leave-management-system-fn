import { Socket } from 'socket.io-client';
import { config } from '../config/config';

export class SocketService {
  private _socket: typeof Socket | null = null;
  private _listeners: Map<string, Function[]> = new Map();

  public connect(token?: string): void {
    const apiUrl = config.apiBaseUrl.replace('/api', '');
    
    // Disconnect existing socket if any
    this.disconnect();

    // Get token from storage if not provided
    const authToken = token || localStorage.getItem(config.authTokenKey);
    if (!authToken) {
      console.error('Cannot connect to socket: No authentication token available');
      return;
    }

    try {
      // Establish new socket connection
      this._socket = io(apiUrl, {
        auth: { token: authToken },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      // Setup event listeners
      this._setupEventListeners();
      
      this._socket.on('connect', () => {
        console.log('Socket connected successfully');
      });
      
      this._socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    } catch (error) {
      console.error('Error initializing socket connection:', error);
    }
  }

  public disconnect(): void {
    if (this._socket) {
      this._socket.disconnect();
      this._socket = null;
    }
  }

  public addListener(event: string, callback: Function): void {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, []);
    }
    this._listeners.get(event)?.push(callback);
    
    // If socket exists, add listener immediately
    if (this._socket) {
      this._socket.on(event, (...args) => callback(...args));
    }
  }

  public removeListener(event: string, callback: Function): void {
    const listeners = this._listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
    
    // Remove from socket if it exists
    if (this._socket) {
      this._socket.off(event, callback as any);
    }
  }

  private _setupEventListeners(): void {
    if (!this._socket) return;
    
    // Add all registered listeners to the socket
    this._listeners.forEach((callbacks, event) => {
      callbacks.forEach(callback => {
        this._socket?.on(event, (...args) => callback(...args));
      });
    });
  }

  public get isConnected(): boolean {
    return !!this._socket?.connected;
  }
}

export const socketService = new SocketService();