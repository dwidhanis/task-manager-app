const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Nama pengguna harus diisi'],
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: [true, 'Email harus diisi'],
        unique: true,
        match: [/.+@.+\..+/, 'Harap masukkan alamat email yang valid']
    },
    password: {
        type: String,
        required: [true, 'Password harus diisi'],
        minlength: 6 // Contoh minimal panjang password
    },
    role: {
        type: String,
        enum: ['member', 'manager', 'admin'], // Peran yang mungkin
        default: 'member'
    }
}, {
    timestamps: true // Otomatis menambahkan createdAt dan updatedAt
});

// Middleware Mongoose untuk hashing password sebelum disimpan
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Metode untuk membandingkan password
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);