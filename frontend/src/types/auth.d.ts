// frontend/src/types/auth.d.ts
// Ini adalah deklarasi tipe global atau lokal untuk auth

interface UserData {
    username?: string; // Opsional untuk login
    email: string;
    password: string;
    role?: 'member' | 'manager' | 'admin'; // Opsional untuk login, default 'member' untuk register
}

interface AuthResponse {
    message: string;
    user: {
        _id: string;
        username: string;
        email: string;
        role: 'member' | 'manager' | 'admin';
    };
    token: string;
}

interface ErrorResponse {
    message: string;
    error?: string; // Opsional, tergantung backend memberikan detail error atau tidak
}