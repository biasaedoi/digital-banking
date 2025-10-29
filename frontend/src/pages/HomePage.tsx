import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import TransactionHistory from '../components/TransactionHistory';

const HomePage: React.FC = () => {
  const { user, loading, refetchUser } = useAuth();

  useEffect(() => {
    refetchUser(); 
  }, []);

  if (loading || !user) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }
  
  const account = user.account;
  const balance = account?.balance || 0;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ 
        background: '#1976D2',
        color: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0, 71, 171, 0.2)',
        marginBottom: '40px'
      }}>
        <h1 style={{ margin: '0 0 5px 0', fontSize: '2em' }}>
            Halo, {user.name}
        </h1>
        <p style={{ margin: '0 0 20px 0', fontSize: '1.1em', opacity: 0.9 }}>
            Akun: {account?.account_number || 'N/A'}
        </p>

        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2em', opacity: 0.8 }}>
            Total Saldo Anda:
        </h3>
        <p style={{ margin: 0, fontSize: '3em', fontWeight: 'bold' }}>
            {formatCurrency(balance)}
        </p>
      </div>

      <div style={{ borderTop: '2px solid #eee', paddingTop: '20px' }}>
          <h2>Riwayat Transaksi Terakhir</h2>
          {account && <TransactionHistory accountId={account.id} />}
      </div>
    </div>
  );
};

export default HomePage;
