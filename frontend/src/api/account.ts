import api from './axios';
import type { ApiResponse, Account, Transaction } from './types';

export const fetchAccountDetail = async (accountId: number): Promise<Account> => {
  const response = await api.get<ApiResponse<Account>>(`/accounts/${accountId}`);
  if (response.data.success) {
    return response.data.data;
  }
  throw new Error(response.data.message || 'Failed to fetch account detail');
};


export const transferFunds = async (from_account_id: number, to_account_id: number, amount: number, description: string): Promise<Transaction> => {
    const response = await api.post<ApiResponse<Transaction>>('/transactions/transfer', {
        from_account_id,
        to_account_id,
        amount,
        description
    });
    if (response.data.success) {
        return response.data.data;
    }
    throw new Error(response.data.message || 'Transfer failed');
};


export const depositFunds = async (account_id: number, amount: number): Promise<Account> => {
    const response = await api.post<ApiResponse<Account>>('/transactions/deposit', {
        account_id,
        amount,
    });
    
    if (response.data.success) {
        
        return response.data.data;
    }
    throw new Error(response.data.message || 'Deposit failed');
};


export const withdrawFunds = async (account_id: number, amount: number): Promise<Account> => {
    const response = await api.post<ApiResponse<Account>>('/transactions/withdraw', {
        account_id,
        amount,
    });
    
    if (response.data.success) {
        
        return response.data.data;
    }
    throw new Error(response.data.message || 'Withdrawal failed');
};


export const fetchTransactionHistory = async (accountId: number): Promise<Transaction[]> => {
    const response = await api.get<ApiResponse<Transaction[]>>(`/transactions/history/${accountId}`);
    if (response.data.success) {
        return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch history');
};


export const searchAccount = async (account_number: string): Promise<Account> => {
    const response = await api.post<ApiResponse<Account>>('/accounts/search', {
        account_number,
    });
    if (response.data.success) {
        return response.data.data;
    }
    throw new Error(response.data.message || 'Account not found');
};