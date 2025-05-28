const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware untuk melindungi rute (verifikasi token)
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Ambil token dari header
            token = req.headers.authorization.split(' ')[1];

            // Verifikasi token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Cari pengguna berdasarkan ID dari token (kecuali password)
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'Tidak diizinkan, pengguna tidak ditemukan.' });
            }

            next(); // Lanjutkan ke handler rute
        } catch (error) {
            console.error('Token error:', error.message);
            res.status(401).json({ message: 'Tidak diizinkan, token gagal.' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Tidak diizinkan, tidak ada token.' });
    }
};

// Middleware untuk otorisasi berdasarkan peran (RBAC)
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Peran ${req.user.role} tidak diizinkan untuk mengakses sumber daya ini.`
            });
        }
        next();
    };
};