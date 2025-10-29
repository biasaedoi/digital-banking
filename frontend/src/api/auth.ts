
import api from './axios';
import type { ApiResponse, User } from './types';

export const loginApi = async (email: string, password: string): Promise<{ user: User, token: string }> => {
  const response = await api.post<ApiResponse<{ user: User, token: string }>>('/auth/login', {
    email,
    password,
  });
  if (response.data.success) {
    return response.data.data;
  }
  throw new Error(response.data.message || 'Login failed');
};

export const registerApi = async (name: string, email: string, password: string, password_confirmation: string): Promise<User> => {
    const response = await api.post<ApiResponse<User>>('/auth/register', {
        name,
        email,
        password,
        password_confirmation,
    });
    if (response.data.success) {
        return response.data.data;
    }
    throw new Error(response.data.message || 'Registration failed');
};

export const fetchMe = async (): Promise<User> => {
  const response = await api.get<ApiResponse<User>>('/auth/me');
  if (response.data.success) {
    return response.data.data;
  }
  throw new Error(response.data.message || 'Failed to fetch user data');
};