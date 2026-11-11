# OSSMAPA

## Menyiapkan Supabase

Data master diambil dari Supabase untuk:

- Sekbid (`sekbids`)
- Proker (`programs`)
- Pengurus (`leaders`)
- Blog (`blog_posts`)
- Aspirasi (`aspirations`)
- Sponsor (`sponsors`)

1. Buat project baru di [Supabase](https://supabase.com).
2. Buka **SQL Editor**, lalu jalankan seluruh isi [`supabase/schema.sql`](./supabase/schema.sql).
3. Salin `.env.example` menjadi `.env.local`, lalu isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` dari **Project Settings > API**.
4. Jalankan `npm run dev`.

Foto Pengurus dan logo Sponsor dapat diunggah langsung dari panel Admin ke Supabase Storage (maksimal 5 MB, hanya file gambar). URL publiknya otomatis disimpan pada kolom `image_url`. URL manual tetap dapat digunakan sebagai fallback.

Saat environment Supabase belum diisi, aplikasi menampilkan data cadangan lokal. Jika koneksi Supabase gagal, banner error ditampilkan agar masalahnya tidak tersembunyi.

## Panel Admin

Buka `/admin/login` untuk masuk ke panel admin. Panel menyediakan CRUD untuk Sekbid, Proker, Pengurus, Blog, Aspirasi, dan Sponsor. Proker memilih Sekbid dari master Sekbid melalui dropdown. Upload sponsor dibatasi ke file gambar maksimal 5 MB.

### Keamanan admin

1. Di Supabase Authentication, buat user admin dengan email terverifikasi dan password kuat. Nonaktifkan sign-up publik pada **Authentication > Providers > Email**.
2. Set `app_metadata.role` user menjadi `admin` melalui Supabase Dashboard pada detail user. Jangan pernah menaruh service role key di `.env` frontend.
3. RLS pada `supabase/schema.sql` membatasi semua operasi CRUD dan upload Storage hanya untuk JWT dengan `app_metadata.role = admin`. Data aspirasi tidak dapat dibaca publik.
4. Login menggunakan Supabase Auth, session tersimpan dan diperbarui melalui listener Auth, password reset memakai email, dan route admin tidak dapat diakses tanpa session + role admin. Aktifkan MFA di **Authentication > Multi-Factor** untuk akun admin sebagai lapisan tambahan.

Proker terhubung ke master Sekbid melalui `programs.sekbid_id`. Untuk project yang sudah menjalankan schema versi sebelumnya, jalankan juga [migration relasi Sekbid](./supabase/migrations/20261111_add_sekbids_relation.sql) di SQL Editor.

Blog menggunakan artikel lengkap dengan slug, ringkasan, isi HTML rich text, cover, penulis, dan tanggal terbit. Untuk database yang sudah dibuat sebelumnya, jalankan [migration Blog](./supabase/migrations/20261111_upgrade_blog_posts.sql).

Pendataan pengurus tersedia secara publik di `/pendataan/pengurus`. Kiriman masuk sebagai `published = false` dan harus diterbitkan oleh Admin setelah diverifikasi. Untuk database lama, jalankan [migration form publik Pengurus](./supabase/migrations/20261111_public_leader_form.sql).

Pengajuan Proker tersedia secara publik di `/pendataan/proker`. Kiriman juga masuk sebagai `published = false` dan perlu diverifikasi Admin. Proker memiliki status pelaksanaan (Belum dimulai, Sedang berlangsung, Selesai, Ditunda, atau Dibatalkan). Untuk database lama, jalankan [migration form publik Proker](./supabase/migrations/20261111_public_program_form.sql) dan [migration status Proker](./supabase/migrations/20261111_program_status.sql).

Form Apresiasi Prestasi tersedia di `/pendataan/prestasi`. Data prestasi masuk sebagai `published = false`, lalu dapat diperiksa dan diterbitkan Admin melalui menu **Prestasi**. Jalankan [migration Prestasi](./supabase/migrations/20261111_achievements.sql) pada database lama.

Form publik Pengurus meminta Sekbid dari dropdown master `sekbids`. Untuk database lama, jalankan [migration relasi Pengurus-Sekbid](./supabase/migrations/20261111_add_leader_sekbid_relation.sql).

Dashboard Admin menyediakan progress kelengkapan 47 pengurus, statistik Blog dan Sponsor, pencarian Pengurus berdasarkan nama/NIS/Sekbid, filter Proker per Sekbid, prioritas Aspirasi terbaru, badge data yang belum diverifikasi, tombol retry ketika koneksi bermasalah, dan export CSV untuk Pengurus, Proker, serta Aspirasi. Data Pengurus memiliki halaman profil publik di `/pengurus/:id`.

Data Pengurus juga mencakup NIS, nomor WhatsApp, dan Instagram (opsional). Untuk database lama, jalankan [migration identitas dan kontak Pengurus](./supabase/migrations/20261111_add_leader_contact_fields.sql).

Admin dengan role `admin` dapat membuka tab **Admin** untuk mengundang admin lain melalui email. Calon admin harus mendaftar di `/admin/register` menggunakan email yang diundang dan memverifikasi emailnya. Jalankan [migration undangan admin](./supabase/migrations/20261111_admin_invitations.sql) untuk database lama.

Form Blog menyimpan draft otomatis di browser selama pengisian. Validasi Admin mencegah NIS dan slug Blog duplikat serta memeriksa format nomor WhatsApp sebelum data disimpan.

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
