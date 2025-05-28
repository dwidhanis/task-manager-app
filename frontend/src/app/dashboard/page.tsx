// frontend/src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/services/authService';
import axios from 'axios';
import type { AuthResponse, ErrorResponse } from '@/types/auth'; // Impor tipe

interface UserProfile {
    _id: string;
    username: string;
    email: string;
    role: 'member' | 'manager' | 'admin';
}

export default function DashboardPage() {
    const [user, setUser] = useState<UserProfile | null>(null); // Tipe UserProfile atau null
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await axios.get<{ user: UserProfile }>(`${API_URL}/auth/profile`, { // Tipe respons
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data.user);
            } catch (error: any) {
                console.error('Failed to fetch user profile:', error);
                const errorData = error.response?.data as ErrorResponse;
                if (errorData?.message === 'Tidak diizinkan, token gagal.' || errorData?.message === 'Tidak diizinkan, tidak ada token.') {
                    authService.logout(); // Logout jika token tidak valid
                    router.push('/login');
                }
                // Handle other errors if necessary
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router, API_URL]);

    const handleLogout = () => {
        authService.logout();
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p>Memuat profil...</p>
            </div>
        );
    }

    if (!user) {
        return null; // Akan diarahkan ke login oleh useEffect
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-lg mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center">Dashboard Pengguna</h1>
                <p className="mb-2">Selamat datang, <span className="font-semibold">{user.username}</span>!</p>
                <p className="mb-2">Email: <span className="font-semibold">{user.email}</span></p>
                <p className="mb-6">Peran: <span className="font-semibold">{user.role}</span></p>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                >
                    Logout
                </button>
                <p className="mt-4 text-center text-gray-500">
                    Ini adalah halaman dashboard Anda. Di sini Anda akan mengelola tugas.
                </p>
            </div>
        </div>
    );
}