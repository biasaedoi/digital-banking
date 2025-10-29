import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();

    setTimeout(() => {
      navigate('/login');
    }, 10);

  };

  return (
    <nav style={navContainer}>
      <Link to={isAuthenticated ? "/home" : "/"} style={logoStyle}>
        Digital Bank
      </Link>

      <div style={navRight}>
        {isAuthenticated ? (
          <>
            <Link to="/deposit-withdraw" style={linkStyle}>Deposit/Withdraw</Link>
            <Link to="/transfer" style={linkStyle}>Transfer</Link>
            <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={linkStyle}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const navContainer: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  zIndex: 100,
  background: '#0047AB',
  color: 'white',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 40px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
  maxWidth: '100vw',
};

const logoStyle: React.CSSProperties = {
  fontSize: '1.6em',
  fontWeight: 'bold',
  color: 'white',
  textDecoration: 'none',
};

const navRight: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
};

const linkStyle: React.CSSProperties = {
  color: 'white',
  background: '#0056b3',
  textDecoration: 'none',
  padding: '8px 14px',
  borderRadius: '6px',
  transition: 'background 0.3s, transform 0.2s',
  cursor: 'pointer',
};

const logoutButtonStyle: React.CSSProperties = {
  ...linkStyle,
  background: '#D32F2F',
  border: 'none',
  fontWeight: 'bold',
};

export default Navbar;