// frontend/src/services/authService.ts
import axios from 'axios';
import type { UserData, AuthResponse, ErrorResponse } from '@/types/auth'; // Impor tipe data

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const register = async (userData: UserData): Promise<AuthResponse> => {
    try {
        const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, userData);
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data as ErrorResponse;
        }
        throw new Error('Terjadi kesalahan yang tidak diketahui.');
    }
};

const login = async (userData: UserData): Promise<AuthResponse> => {
    try {
        const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, userData);
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw error.response.data as ErrorResponse;
        }
        throw new Error('Terjadi kesalahan yang tidak diketahui.');
    }
};

const logout = (): void => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
};

const authService = {
    register,
    login,
    logout,
};

export default authService;