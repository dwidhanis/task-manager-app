// backend/models/Task.js
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Judul tugas harus diisi'],
        trim: true,
        minlength: 3
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'], // Status yang mungkin
        default: 'pending'
    },
    dueDate: {
        type: Date,
        nullable: true // Tugas bisa tidak memiliki due date
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Merujuk ke model User
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Merujuk ke model User
        nullable: true // Tugas bisa belum ditugaskan ke siapa-siapa
    }
}, {
    timestamps: true // Otomatis menambahkan createdAt dan updatedAt
});

module.exports = mongoose.model('Task', TaskSchema);