// backend/server.js
require('dotenv').config(); // Muat variabel lingkungan pertama kali
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Izinkan semua origin. Di produksi, batasi ke origin frontend Anda.
app.use(express.json()); // Untuk mengurai JSON body dari request

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected!'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Keluar dari proses jika koneksi gagal
    });

// Rute Dasar (Untuk pengujian)
app.get('/', (req, res) => {
    res.send('Task Manager API is running!');
});

// Jalankan Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});