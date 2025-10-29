import React, { useState, useEffect, useCallback } from 'react';
import { fetchAccountDetail, fetchTransactionHistory } from '../../api/account';
import type { Account, Transaction } from '../../api/types';
import DepositWithdrawForm from '../../components/DepositWithdrawForm';

interface Props {
  accountId: number;
}

const AccountDetail: React.FC<Props> = ({ accountId }) => {
  const [account, setAccount] = useState<Account | null>(null);
  const [history, setHistory] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  
  const loadData = useCallback(async () => {
    try {
      const [accountData, historyData] = await Promise.all([
        fetchAccountDetail(accountId),
        fetchTransactionHistory(accountId),
      ]);
      setAccount(accountData);
      setHistory(historyData);
    } catch (error) {
      console.error("Error loading account data:", error);
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) return <div>Loading account details and history...</div>;
  if (!account) return <div>Failed to load account details.</div>;

  const formatAmount = (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`;

  return (
    <div>
      <h2>My Account</h2>
      <div style={{ border: '1px solid #eee', padding: '15px', marginBottom: '20px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
        <p><strong>Account Number:</strong> {account.account_number}</p>
        <h3>Current Balance: <span style={{ color: 'green' }}>{formatAmount(account.balance)}</span></h3>
      </div>

      <DepositWithdrawForm 
        accountId={accountId} 
        onTransactionSuccess={loadData} 
      />

      <h3>Transaction History</h3>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {history.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {history.map((tx) => {
              const isSender = tx.from_account.id === accountId;
              const amount = tx.amount;
              const type = isSender ? 'Sent' : 'Received';
              const counterparty = isSender
                ? tx.to_account.account_number
                : tx.from_account.account_number;

              return (
                <li
                  key={tx.id}
                  style={{
                    borderBottom: '1px dotted #ccc',
                    padding: '10px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <p style={{ margin: 0 }}>
                      <strong>{type}</strong> to/from: <strong>{counterparty}</strong>
                    </p>
                    <small>{tx.description || 'No description'}</small>
                  </div>
                  <div
                    style={{
                      color: isSender ? 'red' : 'green',
                      fontWeight: 'bold',
                      textAlign: 'right',
                    }}
                  >
                    {isSender ? '-' : '+'} {formatAmount(amount)}
                    <div style={{ fontSize: '0.8em', fontWeight: 'normal' }}>
                      {new Date(tx.created_at).toLocaleString()}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AccountDetail;
