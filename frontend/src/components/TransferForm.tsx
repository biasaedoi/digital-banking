import React, { useState } from 'react';
import { searchAccount, transferFunds } from '../api/account';
import type { Account } from '../api/types';
import { useAuth } from '../hooks/useAuth'; 

interface Props {
    fromAccountId: number;
}

const TransferForm: React.FC<Props> = ({ fromAccountId }) => {
    const [toAccountNumber, setToAccountNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [recipient, setRecipient] = useState<Account | null>(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [transferLoading, setTransferLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const { refetchUser } = useAuth(); 

    
    const handleSearch = async () => {
        if (toAccountNumber.length < 6) return;
        setSearchLoading(true);
        setRecipient(null);
        setMessage(null);

        try {
            const foundAccount = await searchAccount(toAccountNumber);
            setRecipient(foundAccount);
            setMessage({ type: 'success', text: `Recipient found: ${foundAccount.user.name}` });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Account not found.';
            setMessage({ type: 'error', text: errorMessage });
            setRecipient(null);
        } finally {
            setSearchLoading(false);
        }
    };

    
    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!recipient || transferLoading) return;
        
        const transferAmount = parseFloat(amount);
        if (isNaN(transferAmount) || transferAmount <= 0) {
            setMessage({ type: 'error', text: 'Invalid amount.' });
            return;
        }

        setTransferLoading(true);
        setMessage(null);

        try {
            await transferFunds(
                fromAccountId, 
                recipient.id, 
                transferAmount, 
                description
            );
            setMessage({ type: 'success', text: `Transfer of Rp ${transferAmount.toLocaleString()} successful!` });
            
            
            setAmount('');
            setDescription('');
            setToAccountNumber('');
            setRecipient(null);
            refetchUser(); 
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.errors?.amount || 'Transfer failed.';
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setTransferLoading(false);
        }
    };

    return (
        <div>
            <h2>Transfer Funds</h2>
            {message && (
                <div style={{ padding: '10px', background: message.type === 'success' ? '#d4edda' : '#f8d7da', color: message.type === 'success' ? '#155724' : '#721c24', marginBottom: '15px', borderRadius: '4px' }}>
                    {message.text}
                </div>
            )}
            
            <form onSubmit={handleTransfer}>
                {/* Search Recipient */}
                <div style={{ marginBottom: '15px' }}>
                    <label>Recipient Account Number:</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input 
                            type="text" 
                            value={toAccountNumber} 
                            onChange={(e) => setToAccountNumber(e.target.value)} 
                            style={{ flex: 1, padding: '8px' }}
                            placeholder="e.g., ACC-123456"
                            required
                        />
                        <button type="button" onClick={handleSearch} disabled={searchLoading} style={{ padding: '8px 15px', background: 'orange', color: 'white', border: 'none' }}>
                            {searchLoading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </div>

                {/* Recipient Details */}
                {recipient && (
                    <div style={{ border: '1px solid green', padding: '10px', marginBottom: '15px', borderRadius: '4px', background: '#e6ffe6' }}>
                        <p style={{ margin: 0 }}>**Recipient:** {recipient.user.name}</p>
                        <p style={{ margin: 0 }}>**Account ID:** {recipient.id}</p>
                    </div>
                )}

                {/* Transfer Details */}
                <div style={{ marginBottom: '15px' }}>
                    <label>Amount (Rp):</label>
                    <input 
                        type="number" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)} 
                        min="1"
                        required
                        disabled={!recipient}
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label>Description (Optional):</label>
                    <input 
                        type="text" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        disabled={!recipient}
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={!recipient || transferLoading || parseFloat(amount) <= 0}
                    style={{ padding: '10px 15px', background: 'green', color: 'white', border: 'none', cursor: 'pointer', width: '100%' }}
                >
                    {transferLoading ? 'Processing...' : 'Execute Transfer'}
                </button>
            </form>
        </div>
    );
};

export default TransferForm;