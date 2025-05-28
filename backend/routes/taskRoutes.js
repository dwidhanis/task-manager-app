// backend/routes/taskRoutes.js
const express = require('express');
const {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
} = require('../controllers/taskController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Semua rute ini akan diawali dengan /api/tasks
// Terapkan middleware 'protect' untuk semua rute tugas
router.use(protect); // Semua rute di bawah ini memerlukan otentikasi

router.route('/')
    .get(getTasks) // Semua pengguna terautentikasi bisa melihat tugas (dengan filter RBAC di controller)
    .post(authorizeRoles('admin', 'manager', 'member'), createTask); // Siapa saja bisa membuat tugas

router.route('/:id')
    .get(getTaskById) // Semua pengguna terautentikasi bisa melihat detail tugas (dengan filter RBAC di controller)
    .put(authorizeRoles('admin', 'manager', 'member'), updateTask) // Semua pengguna terautentikasi bisa mengedit tugas (dengan filter RBAC di controller)
    .delete(authorizeRoles('admin', 'manager', 'member'), deleteTask); // Semua pengguna terautentikasi bisa menghapus tugas (dengan filter RBAC di controller)

module.exports = router;