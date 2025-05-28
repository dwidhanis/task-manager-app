// backend/controllers/taskController.js
const Task = require('../models/Task');
const User = require('../models/User'); // Diperlukan untuk validasi assignedTo

// Helper untuk membangun query yang diizinkan berdasarkan peran
const buildTaskQuery = async (user) => {
    let query = {};
    if (user.role === 'member') {
        // Member hanya bisa melihat tugas yang dibuat atau ditugaskan padanya
        query = {
            $or: [
                { createdBy: user._id },
                { assignedTo: user._id }
            ]
        };
    } else if (user.role === 'manager') {
        // Manajer bisa melihat semua tugas yang dibuat atau ditugaskan kepadanya,
        // serta tugas yang dibuat/ditugaskan kepada 'members' di bawahnya.
        // Untuk contoh sederhana ini, kita asumsikan manager bisa melihat semua tugas member.
        // Dalam aplikasi yang lebih kompleks, ini akan melibatkan struktur tim.
        // Untuk sementara, manager melihat semua tugas (bisa disaring lebih lanjut).
        query = {}; // Semua tugas untuk manager
    } else if (user.role === 'admin') {
        // Admin bisa melihat semua tugas
        query = {};
    }
    return query;
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private (RBAC: Member, Manager, Admin)
exports.getTasks = async (req, res) => {
    try {
        const query = await buildTaskQuery(req.user);
        const tasks = await Task.find(query)
            .populate('createdBy', 'username email') // Tampilkan info username & email pembuat
            .populate('assignedTo', 'username email'); // Tampilkan info username & email yang ditugaskan

        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private (RBAC: Member, Manager, Admin - but only if authorized)
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('createdBy', 'username email')
            .populate('assignedTo', 'username email');

        if (!task) {
            return res.status(404).json({ message: 'Tugas tidak ditemukan' });
        }

        // Implementasi RBAC untuk melihat detail tugas
        // Admin bisa melihat semua
        // Manager bisa melihat semua (atau yang terkait dengan timnya)
        // Member hanya bisa melihat tugas yang dibuatnya atau ditugaskan padanya
        if (req.user.role === 'member' &&
            String(task.createdBy._id) !== String(req.user._id) &&
            (task.assignedTo && String(task.assignedTo._id) !== String(req.user._id))) {
            return res.status(403).json({ message: 'Tidak diizinkan untuk melihat tugas ini.' });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private (RBAC: Member, Manager, Admin)
exports.createTask = async (req, res) => {
    const { title, description, status, dueDate, assignedTo } = req.body;

    try {
        if (!title) {
            return res.status(400).json({ message: 'Judul tugas harus diisi.' });
        }

        // Jika assignedTo diberikan, pastikan user tersebut ada
        if (assignedTo) {
            const assignedUser = await User.findById(assignedTo);
            if (!assignedUser) {
                return res.status(400).json({ message: 'Pengguna yang ditugaskan tidak ditemukan.' });
            }
        }

        const task = new Task({
            title,
            description,
            status,
            dueDate,
            createdBy: req.user._id, // Penulis tugas adalah user yang sedang login
            assignedTo: assignedTo || null // Bisa null
        });

        const createdTask = await task.save();
        res.status(201).json(createdTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private (RBAC: Admin bisa semua, Manager bisa tugasnya/timnya, Member bisa tugasnya sendiri)
exports.updateTask = async (req, res) => {
    const { title, description, status, dueDate, assignedTo } = req.body;

    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Tugas tidak ditemukan.' });
        }

        // Validasi otoritas untuk mengedit tugas
        // Admin bisa mengedit semua tugas
        // Manager bisa mengedit tugas yang dibuatnya atau ditugaskan padanya (atau bawahannya)
        // Member hanya bisa mengedit tugas yang dibuatnya
        if (req.user.role === 'member' && String(task.createdBy) !== String(req.user._id)) {
            return res.status(403).json({ message: 'Tidak diizinkan untuk mengedit tugas ini.' });
        }
        // Asumsi: Manager bisa mengedit semua task. Dalam skenario nyata, manager hanya bisa mengedit task yang relevan dengan timnya.
        // Jika admin/manager ingin mengubah assignedTo, pastikan user tersebut ada.
        if (assignedTo) {
            const assignedUser = await User.findById(assignedTo);
            if (!assignedUser) {
                return res.status(400).json({ message: 'Pengguna yang ditugaskan tidak ditemukan.' });
            }
            task.assignedTo = assignedTo;
        } else if (assignedTo === null) { // Izinkan untuk menghapus assignedTo
            task.assignedTo = null;
        }

        // Update bidang-bidang tugas
        task.title = title || task.title;
        task.description = description !== undefined ? description : task.description; // Izinkan description kosong
        task.status = status || task.status;
        task.dueDate = dueDate !== undefined ? dueDate : task.dueDate; // Izinkan dueDate dihapus/diatur null

        const updatedTask = await task.save();
        res.status(200).json(updatedTask);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private (RBAC: Admin bisa semua, Manager bisa tugasnya/timnya, Member bisa tugasnya sendiri)
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Tugas tidak ditemukan.' });
        }

        // Validasi otoritas untuk menghapus tugas
        // Admin bisa menghapus semua tugas
        // Manager bisa menghapus tugas yang dibuatnya atau ditugaskan padanya (atau bawahannya)
        // Member hanya bisa menghapus tugas yang dibuatnya
        if (req.user.role === 'member' && String(task.createdBy) !== String(req.user._id)) {
            return res.status(403).json({ message: 'Tidak diizinkan untuk menghapus tugas ini.' });
        }
        // Asumsi: Manager bisa menghapus semua task. Dalam skenario nyata, manager hanya bisa menghapus task yang relevan dengan timnya.

        await Task.deleteOne({ _id: req.params.id }); // Menggunakan deleteOne() atau findByIdAndDelete()
        res.status(200).json({ message: 'Tugas berhasil dihapus.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};