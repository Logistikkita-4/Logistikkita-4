/**
 * Simple Authentication Utility
 * Untuk manage state login/logout di seluruh aplikasi
 */

// PERBAIKAN: Simpan auth state di localStorage dan memory
let authState = {
  isAuthenticated: false,
  user: null,
  token: null
};

// Initialize dari localStorage
const initializeAuth = () => {
  const token = localStorage.getItem('auth_token');
  const userData = localStorage.getItem('user_data');
  
  if (token && userData) {
    authState = {
      isAuthenticated: true,
      user: JSON.parse(userData),
      token: token
    };
  }
  
  return authState;
};

// Login function
const login = (userData, token) => {
  authState = {
    isAuthenticated: true,
    user: userData,
    token: token
  };
  
  localStorage.setItem('auth_token', token);
  localStorage.setItem('user_data', JSON.stringify(userData));
  
  // Dispatch event untuk notify components
  window.dispatchEvent(new Event('authStateChanged'));
  
  return authState;
};

// Logout function
const logout = () => {
  authState = {
    isAuthenticated: false,
    user: null,
    token: null
  };
  
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
  
  // Dispatch event untuk notify components
  window.dispatchEvent(new Event('authStateChanged'));
  
  return authState;
};

// Get current auth state
const getAuthState = () => {
  return { ...authState }; // Return copy untuk immutability
};

// Check if user is authenticated
const isAuthenticated = () => {
  return authState.isAuthenticated;
};

// Get user data
const getUser = () => {
  return authState.user;
};

// Get token
const getToken = () => {
  return authState.token;
};

// Subscribe to auth changes
const subscribe = (callback) => {
  const handler = () => callback(getAuthState());
  window.addEventListener('authStateChanged', handler);
  
  // Return unsubscribe function
  return () => window.removeEventListener('authStateChanged', handler);
};

// Initialize on import
initializeAuth();

export {
  login,
  logout,
  getAuthState,
  isAuthenticated,
  getUser,
  getToken,
  subscribe,
  initializeAuth
};
