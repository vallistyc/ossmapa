import { useState } from "react";

const steps = [
  {
    title: "Mulai dari Dashboard",
    description: "Dashboard menampilkan ringkasan data dan jumlah kiriman yang belum diverifikasi. Gunakan menu di bagian atas untuk berpindah antar modul.",
    checklist: ["Periksa indikator koneksi.", "Lihat jumlah Pengurus, Proker, dan Aspirasi baru.", "Buka Tutorial ini kapan saja dari tombol Panduan."],
  },
  {
    title: "Kelola Pengurus",
    description: "Buka tab Pengurus untuk menambah atau mengubah data pengurus. Gunakan Pendataan cepat untuk memasukkan beberapa orang sekaligus.",
    checklist: ["Pastikan nama, NIS, WhatsApp, Sekbid, jabatan, dan periode benar.", "Upload foto JPG, PNG, atau WEBP maksimal 5 MB langsung dari perangkat.", "Klik Salin link form untuk membagikan form pendataan kepada siswa."],
  },
  {
    title: "Kelola dan bagikan Proker",
    description: "Buka tab Proker untuk mengelola program kerja. Form publik memungkinkan pengusul mengirim rancangan proker tanpa akses admin.",
    checklist: ["Isi nama, Sekbid, waktu pelaksanaan, dan deskripsi.", "Klik Salin link form untuk menyalin URL form proker.", "Periksa isi kiriman sebelum menerbitkannya."],
  },
  {
    title: "Verifikasi kiriman publik",
    description: "Semua data dari form publik masuk sebagai Belum Diverifikasi. Data baru tampil di website setelah statusnya diubah.",
    checklist: ["Buka tab Pengurus, Proker, atau Prestasi.", "Klik status Belum Diverifikasi setelah data diperiksa.", "Klik lagi jika perlu membatalkan publikasi."],
  },
  {
    title: "Kelola Prestasi",
    description: "Form prestasi meminta data siswa, kelas bertingkat, jenis dan hasil prestasi, tingkat perlombaan, deskripsi, serta bukti.",
    checklist: ["Pilih tingkat kelas terlebih dahulu, lalu pilih kelasnya.", "Periksa NIS, WhatsApp, jenis, hasil, dan tingkat prestasi.", "Bukti hanya boleh JPG, PNG, atau PDF maksimal 10 MB."],
  },
  {
    title: "Kelola konten dan admin",
    description: "Gunakan tab Sekbid, Blog, Sponsor, dan Aspirasi untuk memperbarui konten. Tab Admin dipakai untuk mengatur akses pengelola.",
    checklist: ["Gunakan editor rich text untuk menulis Blog.", "Perbarui status Aspirasi setelah ditindaklanjuti.", "Undang email, minta calon admin mendaftar, lalu klik Verifikasi pada tab Admin."],
  },
];

const AdminTutorial = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  return (
    <section className="mt-8 max-w-4xl">
      <p className="eyebrow text-orange">Panduan walkthrough</p>
      <h2 className="mt-2 font-outfit text-3xl font-semibold">Kelola OSSMAPA dari awal sampai terbit</h2>
      <p className="mt-2 max-w-2xl font-outfit text-sm leading-6 text-cream/50">Ikuti langkah berikut untuk memahami alur terbaru, mulai dari menerima data sampai mempublikasikannya.</p>
      <div className="mt-8 rounded-2xl border border-orange/30 bg-charcoal p-5 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <span className="font-outfit text-xs font-semibold uppercase tracking-widest text-orange">Langkah {stepIndex + 1} dari {steps.length}</span>
          <span className="font-outfit text-xs text-cream/45">{Math.round(((stepIndex + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-cream/10">
          <div className="h-full rounded-full bg-orange transition-all" style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} />
        </div>
        <div className="mt-8 flex gap-4">
          <span className="font-jersey-10 text-5xl leading-none text-orange">{String(stepIndex + 1).padStart(2, "0")}</span>
          <div>
            <h3 className="font-outfit text-2xl font-semibold">{step.title}</h3>
            <p className="mt-3 font-outfit text-sm leading-6 text-cream/60">{step.description}</p>
          </div>
        </div>
        <ul className="mt-6 space-y-3 border-t border-cream/10 pt-5">
          {step.checklist.map((item) => <li key={item} className="flex gap-3 font-outfit text-sm leading-6 text-cream/70"><span className="text-orange">✓</span><span>{item}</span></li>)}
        </ul>
        <div className="mt-8 flex flex-wrap justify-between gap-3">
          <button type="button" onClick={() => setStepIndex((current) => Math.max(0, current - 1))} disabled={stepIndex === 0} className="rounded-full border border-cream/20 px-5 py-2.5 font-outfit text-sm text-cream/70 hover:border-orange hover:text-orange disabled:cursor-not-allowed disabled:opacity-30">Sebelumnya</button>
          <button type="button" onClick={() => setStepIndex((current) => isLastStep ? 0 : current + 1)} className="rounded-full bg-orange px-5 py-2.5 font-outfit text-sm font-semibold text-ink">{isLastStep ? "Ulangi walkthrough" : "Langkah berikutnya"} →</button>
        </div>
      </div>
      <div className="mt-8 rounded-xl border border-orange/25 bg-orange/10 p-5">
        <p className="font-outfit text-sm font-semibold text-orange">Catatan penting</p>
        <p className="mt-2 font-outfit text-sm leading-6 text-cream/60">Data dari form publik selalu masuk sebagai belum terverifikasi. Periksa data sebelum menerbitkan, terutama nama, NIS, kontak, Sekbid, jabatan, dan bukti prestasi.</p>
      </div>
    </section>
  );
};

export default AdminTutorial;
