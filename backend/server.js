// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Import rute otentikasi

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected!'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Rute Dasar
app.get('/', (req, res) => {
    res.send('Task Manager API is running!');
});

// Gunakan Rute API
app.use('/api/auth', authRoutes); // Semua rute otentikasi akan diawali dengan /api/auth

// Handle error jika rute tidak ditemukan
app.use((req, res, next) => {
    res.status(404).json({ message: 'Endpoint tidak ditemukan.' });
});

// Middleware penanganan error umum (Opsional, tapi bagus untuk produksi)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Terjadi kesalahan server!');
});

// Jalankan Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});