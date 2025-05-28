# Sistem Manajemen Tugas Fullstack

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/yourusername/task-manager-app/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/yourusername/task-manager-app.svg?style=social)](https://github.com/yourusername/task-manager-app/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/task-manager-app.svg?style=social)](https://github.com/yourusername/task-manager-app/network/members)

Proyek ini adalah aplikasi Sistem Manajemen Tugas *fullstack* yang dibangun dengan **Next.js** (Frontend) dan **Node.js + Express.js** (Backend), menggunakan **MongoDB** sebagai *database*. Aplikasi ini mengimplementasikan **Role-Based Access Control (RBAC)** dan dirancang dengan fokus pada keamanan data sesuai standar pengembangan *software* modern.

---

## Daftar Isi

* [Fitur](#fitur)
* [Teknologi yang Digunakan](#teknologi-yang-digunakan)
* [Persyaratan Sistem](#persyaratan-sistem)
* [Panduan Instalasi & Setup](#panduan-instalasi--setup)
    * [Backend Setup](#backend-setup)
    * [Frontend Setup](#frontend-setup)
* [Penggunaan Aplikasi](#penggunaan-aplikasi)
* [Struktur Proyek](#struktur-proyek)
* [Flowchart & ERD](#flowchart--erd)
* [Kontribusi](#kontribusi)
* [Lisensi](#lisensi)

---

## Fitur

* **Otentikasi Pengguna:**
    * Registrasi Pengguna baru
    * Login Pengguna
    * Proteksi rute dengan JWT (JSON Web Tokens)
* **Otorisasi RBAC (Role-Based Access Control):**
    * Peran pengguna: Admin, Manajer, Member
    * Akses ke fitur/data dibatasi berdasarkan peran pengguna
* **Manajemen Tugas (CRUD):**
    * Membuat tugas baru
    * Melihat daftar semua tugas (dengan filter berdasarkan peran)
    * Melihat detail tugas
    * Memperbarui tugas
    * Menghapus tugas
* **Keamanan Data:**
    * *Hashing* password menggunakan `bcryptjs`
    * Validasi input sisi server
    * Penggunaan variabel lingkungan untuk kredensial sensitif
* **API RESTful:** Komunikasi antara *frontend* dan *backend* melalui API RESTful.
* **Antarmuka Pengguna Responsif:** Dibangun dengan Tailwind CSS.

---

## Teknologi yang Digunakan

### Backend (API)

* **Node.js**: Runtime JavaScript
* **Express.js**: Framework web
* **MongoDB**: NoSQL Database
* **Mongoose**: ODM (Object Data Modeling) untuk MongoDB
* **`dotenv`**: Mengelola variabel lingkungan
* **`bcryptjs`**: Library untuk *hashing* password
* **`jsonwebtoken`**: Untuk implementasi JWT
* **`cors`**: Middleware untuk mengizinkan permintaan lintas *origin*
* **`nodemon`**: Untuk *development* server otomatis *restart*

### Frontend (UI)

* **Next.js**: Framework React untuk pengembangan web
* **React.js**: Library JavaScript untuk membangun antarmuka pengguna
* **Tailwind CSS**: Framework CSS utility-first
* **`axios`**: HTTP client berbasis Promise untuk browser dan Node.js
* **Next.js App Router**: Untuk *routing* yang modern dan efisien
* **`localStorage`**: Untuk menyimpan token otentikasi

---

## Persyaratan Sistem

Pastikan Anda memiliki hal-hal berikut terinstal di sistem Anda:

* **Node.js** (v18.x atau lebih baru)
* **npm** (biasanya terinstal bersama Node.js)
* **MongoDB Community Server** (terinstal dan berjalan secara lokal atau akses ke MongoDB Atlas/lainnya)
* **Git**

---

## Panduan Instalasi & Setup

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi secara lokal.

### Backend Setup

1.  **Clone Repositori:**
    ```bash
    git clone [https://github.com/yourusername/task-manager-app.git](https://github.com/yourusername/task-manager-app.git)
    cd task-manager-app
    ```
    *(Ganti `yourusername` dengan nama pengguna GitHub Anda jika Anda sudah meng-*fork* atau membuat repositori ini)*

2.  **Masuk ke Direktori Backend:**
    ```bash
    cd backend
    ```

3.  **Install Dependencies:**
    ```bash
    npm install
    ```

4.  **Buat File `.env`:**
    Buat file bernama `.env` di *root* direktori `backend` (`task-manager-app/backend/.env`) dan tambahkan konfigurasi berikut. Pastikan Anda mengganti nilai `JWT_SECRET` dengan string acak dan kompleks.

    ```dotenv
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/task_manager_db
    JWT_SECRET=your_very_secure_and_random_jwt_secret_key_here
    JWT_EXPIRES_IN=1h
    ```
    * Jika Anda menggunakan MongoDB Atlas atau layanan *cloud* lainnya, ganti `MONGO_URI` dengan *connection string* yang sesuai.

5.  **Jalankan Server Backend:**
    ```bash
    npm run dev
    ```
    Server akan berjalan di `http://localhost:5000`. Anda akan melihat pesan "MongoDB Connected!" dan "Server running on port 5000" di *console*.

### Frontend Setup

1.  **Buka Terminal Baru** (jangan tutup terminal *backend* Anda).
2.  **Masuk ke Direktori Frontend:**
    ```bash
    cd ../frontend # Kembali ke root folder task-manager-app lalu masuk ke frontend
    ```
    Atau jika Anda sudah berada di root `task-manager-app`, cukup:
    ```bash
    cd frontend
    ```

3.  **Install Dependencies:**
    ```bash
    npm install
    ```

4.  **Buat File `.env.local`:**
    Buat file bernama `.env.local` di *root* direktori `frontend` (`task-manager-app/frontend/.env.local`) dan tambahkan konfigurasi berikut:

    ```dotenv
    NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
    ```
    * Pastikan port ini sesuai dengan port yang Anda gunakan untuk *backend* Anda.

5.  **Jalankan Aplikasi Frontend:**
    ```bash
    npm run dev
    ```
    Aplikasi *frontend* akan berjalan di `http://localhost:3000`.

---

## Penggunaan Aplikasi

1.  **Registrasi Pengguna:** Buka `http://localhost:3000/register` di *browser* Anda.
    * Anda dapat membuat pengguna dengan peran `member`, `manager`, atau `admin`.
    * **Catatan:** Untuk tujuan pengujian awal, Anda dapat membuat pengguna `admin` terlebih dahulu.
2.  **Login Pengguna:** Setelah registrasi berhasil, Anda akan diarahkan ke halaman *login* di `http://localhost:3000/login`.
3.  **Dashboard:** Setelah *login* berhasil, Anda akan diarahkan ke `http://localhost:3000/dashboard` yang menampilkan profil pengguna Anda (nama, email, peran). Ini adalah rute yang dilindungi.
4.  **Fitur Manajemen Tugas:** (Akan diimplementasikan di iterasi selanjutnya)

---

## Struktur Proyek

Proyek ini terbagi menjadi dua bagian utama:

task-manager-app/
├── backend/                  # Kode sumber Backend (Node.js/Express.js API)
│   ├── config/               # Konfigurasi aplikasi (DB, CORS, dll.)
│   ├── controllers/          # Logika bisnis inti (User, Task, Auth)
│   ├── middleware/           # Middleware (Auth, RBAC)
│   ├── models/               # Skema database (User, Task)
│   ├── routes/               # Definisi endpoint API
│   ├── .env                  # Variabel lingkungan backend
│   ├── package.json
│   └── server.js             # Titik masuk aplikasi backend
│
└── frontend/                 # Kode sumber Frontend (Next.js App)
├── public/               # File statis
├── src/                  # Kode sumber utama Next.js
│   ├── app/              # App Router: Routing & Pages (Login, Register, Dashboard)
│   ├── components/       # Komponen UI yang dapat digunakan kembali
│   ├── services/         # Fungsi untuk interaksi API backend
│   ├── styles/           # Global CSS (Tailwind CSS)
│   └── utils/            # Fungsi utilitas frontend
├── .env.local            # Variabel lingkungan frontend
├── package.json
└── next.config.js

## Flowchart & ERD

Untuk memahami alur kerja dan model data aplikasi, silakan lihat diagram berikut:

### Flowchart: Registrasi, Login & Akses Tugas (dengan RBAC)

```mermaid
graph TD
    subgraph Frontend (Browser/Client)
        A[Mulai Aplikasi] --> B{Form Registrasi/Login}
        B -- Submit Registrasi --> C{Kirim Permintaan POST<br>/api/auth/register}
        B -- Submit Login --> D{Kirim Permintaan POST<br>/api/auth/login}
    end

    subgraph Backend (Node.js/Express.js API)
        C --> E{Terima Data Registrasi<br>req.body: {username, email, password, role}}
        D --> F{Terima Data Login<br>req.body: {email, password}}

        E --> G{Validasi Input Registrasi<br>Email unik, Password kuat?}
        F --> H{Validasi Input Login<br>Email/Password ada?}

        G -- Valid --> I[Hash Password]
        H -- Valid --> J[Cari Pengguna di DB]

        I --> K[Simpan Pengguna Baru ke DB]
        J -- Pengguna ditemukan --> L[Bandingkan Password]

        K --> M{Kirim Respon:<br>201 Created / Error}
        L -- Password cocok --> N[Buat JWT (Token Akses)]
        L -- Password tidak cocok --> O{Kirim Respon:<br>400 Invalid Credentials}

        N --> P{Kirim Respon:<br>200 OK, {token, user_info}}

        P --> Q[Simpan Token & Info Pengguna<br>di Local Storage/State FE]

        Q --> R{Pengguna Coba Akses Tugas}
        R -- Request API Tugas<br>(dengan Token JWT di Header) --> S{Terima Permintaan Tugas<br>GET/POST/PUT/DELETE /api/tasks/:id}

        S --> T{Middleware Otentikasi<br>(Verifikasi JWT)}
        T -- JWT Valid & Ada --> U{Middleware Otorisasi<br>(Cek Role Pengguna)}
        T -- JWT Invalid/Tidak Ada --> V{Kirim Respon:<br>401 Unauthorized}

        U -- Role diizinkan --> W[Controller Tugas<br>(Logika CRUD)]
        U -- Role tidak diizinkan --> X{Kirim Respon:<br>403 Forbidden}

        W --> Y[Interaksi dengan Database<br>(Model Tugas)]

        Y -- Data diambil/disimpan --> Z{Kirim Respon Tugas<br>200 OK / 201 Created / Error}

        Z --> Z2[Tampilkan Data Tugas di UI /<br>Tampilkan Pesan Error]
    end

    subgraph Database
        K --> DB_User[Database Pengguna]
        J -- Query --> DB_User
        Y -- Query --> DB_Task[Database Tugas]
    end

    DB_User -.-> K
    DB_User -.-> J
    DB_Task -.-> Y
    M --> B
    O --> B
    V --> B
    X --> B
    Z2 --> B
    
## Kontribusi
Kontribusi disambut baik! Jika Anda menemukan bug atau ingin menyarankan fitur baru, silakan buka issue atau kirim pull request.

## Lisensi
Proyek ini dilisensikan di bawah lisensi MIT. Lihat file LICENSE untuk detail lebih lanjut.