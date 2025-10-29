

export interface User {
  id: number;
  name: string;
  email: string;
  account: {
    id: number;
    account_number: string;
    balance: number;
  } | null;
  created_at: string | null;
}

export interface Account {
  id: number;
  account_number: string;
  balance: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface Transaction {
  id: number;
  from_account: {
    id: number;
    account_number: string;
  };
  to_account: {
    id: number;
    account_number: string;
  };
  amount: number;
  description: string | null;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: any;
}