
import React, { useState, useEffect } from 'react';
import type { Transaction } from '../api/types';
import { fetchTransactionHistory } from '../api/account';
import { useAuth } from '../hooks/useAuth';

interface Props {
  accountId: number;
}

const TransactionHistory: React.FC<Props> = ({ accountId }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth(); 

  const currentAccountNumber = user?.account?.account_number;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0, 
    }).format(amount);
  };
  
  
  const getTransactionInfo = (tx: Transaction) => {
    
    const isCredit = tx.to_account.account_number === currentAccountNumber;
    const type = isCredit ? 'Credit' : 'Debit';
    const color = isCredit ? '#2E7D32' : '#C62828'; 
    const amountSign = isCredit ? '+' : '-';
    
    
    let counterPartyInfo = isCredit 
      ? `Dari: ${tx.from_account.account_number}` 
      : `Kepada: ${tx.to_account.account_number}`;

    
    

    return { type, color, amountSign, counterPartyInfo };
  };


  useEffect(() => {
    const loadHistory = async () => {
      if (!accountId) return;

      try {
        setLoading(true);
        const data = await fetchTransactionHistory(accountId);
        setTransactions(data);
      } catch (err: any) {
        
        const errorMessage = err.response?.data?.message || err.message;
        setError('Gagal memuat riwayat: ' + errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [accountId]);

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center', color: '#0047AB' }}>Memuat riwayat transaksi...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>{error}</div>;
  }

  if (transactions.length === 0) {
    return <div style={{ padding: '20px', textAlign: 'center', opacity: 0.7 }}>Belum ada transaksi di akun ini.</div>;
  }

  return (
    <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#E3F2FD', borderBottom: '2px solid #BBDEFB' }}>
            <th style={{ padding: '12px 15px', textAlign: 'left', color: '#0047AB' }}>Tanggal</th>
            <th style={{ padding: '12px 15px', textAlign: 'left', color: '#0047AB' }}>Deskripsi</th>
            <th style={{ padding: '12px 15px', textAlign: 'right', color: '#0047AB' }}>Jumlah</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const { type, color, amountSign, counterPartyInfo } = getTransactionInfo(tx);
            
            return (
              <tr key={tx.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px 15px', whiteSpace: 'nowrap', color: '#555' }}>
                  {new Date(tx.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                </td>
                <td style={{ padding: '10px 15px' }}>
                  <span style={{ fontWeight: 'bold', color: type === 'Credit' ? '#2E7D32' : '#C62828' }}>
                    {type} ({counterPartyInfo})
                  </span>
                  <p style={{ margin: '3px 0 0 0', fontSize: '0.9em', color: '#555' }}>{tx.description || 'Transfer Dana'}</p>
                </td>
                <td style={{ padding: '10px 15px', textAlign: 'right', fontWeight: 'bold', color: color }}>
                  {amountSign} {formatCurrency(tx.amount)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;