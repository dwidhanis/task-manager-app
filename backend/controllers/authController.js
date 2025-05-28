const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Fungsi untuk menghasilkan JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // Validasi dasar
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Harap lengkapi semua bidang.' });
        }

        // Cek apakah email sudah terdaftar
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email sudah terdaftar.' });
        }

        // Buat user baru (password akan di-hash oleh pre-save middleware)
        const user = await User.create({
            username,
            email,
            password,
            role: role || 'member' // Default role
        });

        if (user) {
            res.status(201).json({
                message: 'Registrasi berhasil!',
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                },
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(400).json({ message: 'Data pengguna tidak valid.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validasi dasar
        if (!email || !password) {
            return res.status(400).json({ message: 'Harap masukkan email dan password.' });
        }

        // Cari pengguna
        const user = await User.findOne({ email });

        // Cek pengguna dan password
        if (user && (await user.matchPassword(password))) {
            res.json({
                message: 'Login berhasil!',
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                },
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(401).json({ message: 'Kredensial tidak valid.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get user profile (example of protected route)
// @route   GET /api/auth/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
    // req.user akan tersedia dari middleware auth
    res.json({
        user: {
            _id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role,
        }
    });
};