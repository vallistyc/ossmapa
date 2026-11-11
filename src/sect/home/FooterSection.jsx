const FooterSection = () => (
  <footer className="bg-ink px-6 py-12 sm:px-10 lg:px-20">
    <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 sm:flex-row">
      <div>
        <img
          src="/osis.png"
          alt="Logo OSIS SMAN 1 Paciran"
          className="h-20 w-20 object-contain"
        />
        <p className="mt-5 font-outfit text-xs leading-6 text-cream/40">
          Organisasi Siswa Intra Sekolah
          <br />
          SMAN 1 Paciran · Periode 2026/2027
        </p>
      </div>
      <div className="flex flex-col gap-3 font-outfit text-sm text-cream/55 sm:items-end">
        <a href="#tentang" className="hover:text-orange">
          Tentang OSSMAPA
        </a>
        <a href="#proker" className="hover:text-orange">
          Program kerja
        </a>
        <a href="#aspirasi" className="hover:text-orange">
          Kirim aspirasi
        </a>
        <a
          href="https://www.instagram.com/osissman1paciran/"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram OSSMAPA"
          className="inline-flex items-center gap-2 hover:text-orange"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" className="fill-current stroke-none" />
          </svg>
        </a>
      </div>
    </div>
    <div className="mx-auto mt-16 flex max-w-7xl justify-between border-t border-cream/10 pt-5 font-outfit text-[10px] uppercase tracking-widest text-cream/30">
      <span>© 2026 OSSMAPA</span>
      <span>Made with purpose.</span>
    </div>
  </footer>
);

export default FooterSection;
