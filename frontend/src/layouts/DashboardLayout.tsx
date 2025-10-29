import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BackButton from '../components/ui/BackButton';

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const showBackButton = location.pathname !== '/home'; 

  return (
    <div style={{
      backgroundColor: '#f9fafc',
      minHeight: '100vh',
      paddingTop: '70px', 
    }}>
      {showBackButton && (
        <div
          style={{
            position: 'fixed',
            top: '75px',
            left: '20px',
            zIndex: 50,
          }}
        >
          <BackButton />
        </div>
      )}

      <main
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '20px',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
