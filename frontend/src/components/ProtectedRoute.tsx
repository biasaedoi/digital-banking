import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'; 
import { useAuth } from '../hooks/useAuth';


const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    
    return <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      fontSize: '1.2em',
      color: '#0047AB'
    }}>Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    
    return <Navigate to="/login" replace />;
  }
  
  
  
  return (
    <div style={{ padding: '20px' }}>
      <Outlet />
    </div>
  );
};

export default ProtectedRoute;