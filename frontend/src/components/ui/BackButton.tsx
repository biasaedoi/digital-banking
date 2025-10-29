import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/home')}
      style={{
        backgroundColor: '#D32F2F',
        color: 'white',
        border: 'none',
        borderRadius: '30px',
        padding: '10px 20px',
        fontSize: '0.95rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
        transition: 'all 0.25s ease-in-out',
      }}
      onMouseEnter={(e) => {
        (e.target as HTMLButtonElement).style.backgroundColor = '#B71C1C';
        (e.target as HTMLButtonElement).style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        (e.target as HTMLButtonElement).style.backgroundColor = '#D32F2F';
        (e.target as HTMLButtonElement).style.transform = 'scale(1)';
      }}
    >
      {/* Ikon panah kiri */}
      <span style={{ fontSize: '1.2rem' }}>←</span>
      Back to Homepage
    </button>
  );
};

export default BackButton;
