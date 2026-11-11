const steps = [
  ["1", "Mulai dari Dashboard", "Gunakan Dashboard untuk melihat jumlah data, pekerjaan yang menunggu verifikasi, dan aspirasi terbaru."],
  ["2", "Kelola data master", "Pilih menu Pengurus, Proker, Sekbid, Blog, Sponsor, atau Aspirasi untuk membuat, mengedit, dan menghapus data."],
  ["3", "Verifikasi kiriman publik", "Buka menu Pengurus atau Proker. Periksa data, lalu klik status Belum Diverifikasi agar data tampil di website."],
  ["4", "Tambah foto", "Pada Pengurus dan Sponsor, isi URL foto atau gunakan tombol Upload foto. File gambar maksimal 5 MB."],
  ["5", "Tulis Blog", "Buka Blog, klik tambah, lalu gunakan editor rich text untuk menulis artikel seperti di Word."],
  ["6", "Undang Admin", "Buka menu Admin, masukkan email, lalu minta calon admin mendaftar di /admin/register dan memverifikasi emailnya."],
];

const AdminTutorial = () => (
  <section className="mt-8 max-w-4xl">
    <p className="eyebrow text-orange">Panduan</p>
    <h2 className="mt-2 font-outfit text-3xl font-semibold">Cara menggunakan Admin</h2>
    <p className="mt-2 max-w-2xl font-outfit text-sm leading-6 text-cream/50">Ikuti alur sederhana ini untuk menjaga data OSSMAPA tetap rapi dan terverifikasi.</p>
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      {steps.map(([number, title, description]) => (
        <article key={number} className="rounded-xl border border-cream/15 bg-charcoal p-5">
          <span className="font-jersey-10 text-3xl text-orange">{number}</span>
          <h3 className="mt-4 font-outfit text-lg font-semibold">{title}</h3>
          <p className="mt-2 font-outfit text-sm leading-6 text-cream/55">{description}</p>
        </article>
      ))}
    </div>
    <div className="mt-8 rounded-xl border border-orange/25 bg-orange/10 p-5">
      <p className="font-outfit text-sm font-semibold text-orange">Catatan penting</p>
      <p className="mt-2 font-outfit text-sm leading-6 text-cream/60">Data dari form publik selalu masuk sebagai belum terverifikasi. Jangan menerbitkan data sebelum nama, NIS, Sekbid, jabatan, dan kontak diperiksa.</p>
    </div>
  </section>
);

export default AdminTutorial;
