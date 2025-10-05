import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PublicRoute = ({ children }) => {
  const [authState, setAuthState] = useState({ isAuthenticated: null, isLoading: true });

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('webVault');
      
      if (!token) {
        setAuthState({ isAuthenticated: false, isLoading: false });
        return;
      }

      try {
        const decoded = jwtDecode(token);
        
        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          // Token is expired, remove it
          localStorage.removeItem('webVault');
          setAuthState({ isAuthenticated: false, isLoading: false });
          return;
        }

        // Token is valid
        setAuthState({ isAuthenticated: true, isLoading: false });
      } catch (error) {
        // Invalid token
        console.error('Invalid token:', error);
        localStorage.removeItem('webVault');
        setAuthState({ isAuthenticated: false, isLoading: false });
      }
    };

    checkAuth();
  }, []);

  // Show loading state while checking authentication
  if (authState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-blue-700 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to dashboard if already authenticated
  if (authState.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render the public component if not authenticated
  return children;
};

export default PublicRoute;