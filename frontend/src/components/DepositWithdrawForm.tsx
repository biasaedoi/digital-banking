import React, { useState } from 'react';
import { depositFunds, withdrawFunds } from '../api/account';
import { useAuth } from '../hooks/useAuth';

interface Props {
    accountId: number;
    onTransactionSuccess?: () => void;
}

const DepositWithdrawForm: React.FC<Props> = ({ accountId, onTransactionSuccess }) => { 
    const [amount, setAmount] = useState('');
    const [operation, setOperation] = useState<'deposit' | 'withdraw'>('deposit');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const { refetchUser } = useAuth();

    const handleTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        const txAmount = parseFloat(amount);
        if (isNaN(txAmount) || txAmount <= 0) {
            setMessage({ type: 'error', text: 'Invalid amount. Must be a positive number.' });
            setLoading(false);
            return;
        }

        try {
            if (operation === 'deposit') {
                await depositFunds(accountId, txAmount);
                setMessage({ type: 'success', text: `Successfully deposited Rp ${txAmount.toLocaleString()}.` });
            } else {
                await withdrawFunds(accountId, txAmount);
                setMessage({ type: 'success', text: `Successfully withdrew Rp ${txAmount.toLocaleString()}.` });
            }

            await refetchUser(); 
            onTransactionSuccess?.(); 

            setAmount('');
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.errors?.amount?.[0] ||
                error.response?.data?.message ||
                'Transaction failed.';
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
            {message && (
                <div
                    style={{
                        padding: '10px',
                        marginBottom: '15px',
                        borderRadius: '4px',
                        background: message.type === 'success' ? '#d4edda' : '#f8d7da',
                        color: message.type === 'success' ? '#155724' : '#721c24',
                    }}
                >
                    {message.text}
                </div>
            )}

            <form onSubmit={handleTransaction}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Operation:</label>
                    <select
                        value={operation}
                        onChange={(e) => setOperation(e.target.value as 'deposit' | 'withdraw')}
                        style={{ padding: '8px', width: '100%' }}
                    >
                        <option value="deposit">Deposit</option>
                        <option value="withdraw">Withdraw</option>
                    </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label>Amount (Rp):</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="1"
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || parseFloat(amount) <= 0}
                    style={{
                        padding: '12px 18px',
                        background: operation === 'deposit' ? '#1976D2' : '#673AB7',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        width: '100%',
                        fontWeight: 'bold',
                        boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
                    }}
                >
                    {loading ? 'Processing...' : (operation === 'deposit' ? 'Execute Deposit' : 'Execute Withdrawal')}
                </button>
            </form>
        </div>
    );
};

export default DepositWithdrawForm;
