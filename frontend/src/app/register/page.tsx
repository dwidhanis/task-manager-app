// frontend/src/app/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/services/authService';
import type { ErrorResponse } from '@/types/auth'; // Impor tipe

export default function RegisterPage() {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [role, setRole] = useState<'member' | 'manager' | 'admin'>('member'); // Tipe enum
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        try {
            await authService.register({ username, email, password, role });
            router.push('/login');
        } catch (err: any) {
            const errorData = err as ErrorResponse;
            setError(errorData.message || 'Registrasi gagal.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6 text-center">Registrasi</h1>
                <form onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Nama Pengguna:</label>
                        <input
                            type="text"
                            id="username"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={username}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                        <input
                            type="email"
                            id="email"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                        <input
                            type="password"
                            id="password"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">Peran:</label>
                        <select
                            id="role"
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={role}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRole(e.target.value as 'member' | 'manager' | 'admin')} // Casting value
                        >
                            <option value="member">Member</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Daftar
                        </button>
                        <a href="/login" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                            Sudah punya akun? Login di sini.
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}