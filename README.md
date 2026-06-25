<div align="center">
  <h1>🍽️ SiWarung — Frontend</h1>
  <p>Aplikasi manajemen F&B UMKM berbasis React + Vite + Tailwind CSS</p>

  ![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)
  ![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat&logo=vite&logoColor=white)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
  ![License](https://img.shields.io/badge/license-MIT-green?style=flat)
</div>

---

## 📖 Tentang Project

**SiWarung** adalah sistem manajemen warung/restoran F&B untuk UMKM Indonesia. Repository ini adalah bagian **frontend** yang dibangun dengan React + Vite dan berkomunikasi dengan backend Laravel melalui REST API.

> 🔗 Backend Repository: [siwarung-backend](https://github.com/brynnstilearning/siwarung-backend)

## 📸 Screenshot

| Dashboard | Daftar Menu |
|---|---|
| <img src="https://github.com/user-attachments/assets/63adff8a-4664-4735-abea-3d4eb3a83bf5" width="420"/> | <img src="https://github.com/user-attachments/assets/17ec5437-7df0-4ec6-a9f1-a702fb8132b0" width="420"/> |

| Pesanan Baru (POS) | Manajemen Meja |
|---|---|
| <img src="https://github.com/user-attachments/assets/8b71918e-e721-4ade-80d1-a708a679a341" width="420"/> | <img src="https://github.com/user-attachments/assets/72403fb3-1cb8-4465-86a5-09266c7eaa8e" width="420"/> |

## ✨ Fitur Utama

- 🔐 **Autentikasi** — Halaman Login & Register dengan desain warung Indonesia
- 📊 **Dashboard** — Statistik omzet harian, order hari ini, dan menu terlaris
- 🍽️ **Manajemen Menu** — CRUD menu dengan upload foto, filter kategori
- 🪑 **Manajemen Meja** — Tampilkan QR Code tiap meja, unduh QR untuk dicetak
- 🛒 **POS Kasir** — Interface kasir untuk buat pesanan baru (pilih menu → keranjang → checkout)
- 📋 **Daftar Pesanan** — Pantau dan update status pesanan (Pending → Proses → Selesai)
- 🧭 **Navigasi Sidebar** — Sidebar persistent dengan active state dan info user

## 🛠️ Tech Stack

| Teknologi | Versi | Kegunaan |
|---|---|---|
| React | 19 | UI Framework |
| Vite | 6 | Build tool & dev server |
| Tailwind CSS | 4 | Utility-first styling |
| React Router DOM | 7 | Client-side routing |
| Axios | 1.x | HTTP client untuk API |
| Zustand | 5.x | State management (auth) |
| Lucide React | 0.x | Icon library |

## 🎨 Design System

Menggunakan palet warna yang terinspirasi dari estetika warung Indonesia:

| Warna | Hex | Kegunaan |
|---|---|---|
| Warung Green | `#1F2D24` | Background header, sidebar |
| Turmeric Gold | `#D98E2B` | Aksen, CTA button |
| Rice Paper | `#F7F3E8` | Background utama |
| Sambal Red | `#8C2F1E` | Danger, cancel, error |
| Banana Green | `#4A6741` | Success, completed |

## 🚀 Cara Menjalankan (Local Development)

### Prasyarat
- Node.js >= 18
- npm >= 8
- Backend SiWarung sudah berjalan di `http://127.0.0.1:8000`

### Langkah Instalasi

```bash
# 1. Clone repository
git clone https://github.com/brynnstilearning/siwarung-frontend.git
cd siwarung-frontend

# 2. Install dependencies
npm install

# 3. Jalankan dev server
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

### Konfigurasi API Base URL

Jika backend berjalan di URL berbeda, edit file `src/api/axios.js`:

```js
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // ganti sesuai URL backend
})
```

## 📁 Struktur Project
src/

├── api/

│   ├── axios.js          # Axios instance + interceptors

│   ├── authApi.js        # Auth endpoints

│   ├── menuApi.js        # Menu endpoints

│   ├── categoryApi.js    # Category endpoints

│   ├── tableApi.js       # Table endpoints

│   └── orderApi.js       # Order endpoints

├── components/

│   ├── AppLayout.jsx     # Layout wrapper dengan sidebar

│   ├── Sidebar.jsx       # Navigasi sidebar

│   ├── MenuFormModal.jsx # Modal tambah/edit menu

│   └── TableFormModal.jsx# Modal tambah/edit meja

├── pages/

│   ├── auth/

│   │   ├── Login.jsx

│   │   └── Register.jsx

│   ├── dashboard/

│   │   └── Dashboard.jsx

│   ├── menu/

│   │   └── MenuList.jsx

│   ├── tables/

│   │   └── TableList.jsx

│   └── orders/

│       ├── OrderList.jsx

│       └── NewOrder.jsx

├── store/

│   └── authStore.js      # Zustand auth state

└── App.jsx               # Router & route definitions

## 👨‍💻 Developer

**Nur Muhammad Anang Febriananto**
- GitHub: [@brynnstilearning](https://github.com/brynnstilearning)
- Email: briannur2102@gmail.com

## 📄 License

MIT License — bebas digunakan untuk keperluan belajar dan portofolio.

Copyright © 2026 Nur Muhammad Anang Febriananto ([@brynnstilearning](https://github.com/brynnstilearning))
