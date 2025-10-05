// Authentication utility functions
import { jwtDecode } from 'jwt-decode';

export const checkAuthStatus = () => {
  try {
    const token = localStorage.getItem('webVault');
    
    if (!token) {
      return { isAuthenticated: false, user: null };
    }

    const decoded = jwtDecode(token);
    
    // Check if token is expired
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      // Token is expired
      localStorage.removeItem('webVault');
      return { isAuthenticated: false, user: null };
    }

    // Token is valid
    return { isAuthenticated: true, user: decoded.user };
  } catch (error) {
    console.error('Auth check failed:', error);
    localStorage.removeItem('webVault');
    return { isAuthenticated: false, user: null };
  }
};

export const login = (token) => {
  try {
    localStorage.setItem('webVault', token);
    const decoded = jwtDecode(token);
    return { success: true, user: decoded.user };
  } catch (error) {
    console.error('Login failed:', error);
    return { success: false, user: null };
  }
};

export const logout = () => {
  localStorage.removeItem('webVault');
};