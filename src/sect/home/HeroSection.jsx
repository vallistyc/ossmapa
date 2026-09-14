const HeroSection = () => (
  <section className="hero-grid hero-orange relative flex min-h-[calc(100vh-6rem)] items-center overflow-hidden px-6 py-20 sm:px-10 lg:px-20">
    <div className="hero-orange-glow pointer-events-none absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="animate-rise">
            <span className="hero-orange-pill inline-flex items-center gap-2 rounded-full px-4 py-2 font-outfit text-[10px] uppercase tracking-[0.22em]">
              <span className="h-1.5 w-1.5 rounded-full bg-orange" />
              Organisasi Siswa Intra Sekolah
            </span>
            <h1 className="mt-8 font-outfit text-5xl font-semibold leading-[0.9] tracking-tight text-cream sm:text-7xl lg:text-[8.5rem]">
              Bergerak untuk
              <br />
              <span className="font-jersey-10 font-normal text-orange">tumbuh bersama.</span>
            </h1>
            <p className="mx-auto mt-7 max-w-lg font-outfit text-sm leading-7 text-cream/55 sm:text-base">
              OSSMAPA menjadi ruang bagi siswa SMAN 1 Paciran untuk menyuarakan ide,
              mengasah kepemimpinan, dan menciptakan aksi nyata.
            </p>
          </div>
        </div>
        <a href="#layanan" aria-label="Scroll ke layanan" className="hero-scroll absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-orange">
          <span className="font-outfit text-[9px] uppercase tracking-[0.3em] text-cream/50">Scroll</span>
          <span className="scroll-line relative h-10 w-px bg-cream/25"><span className="absolute left-1/2 top-0 h-5 w-px -translate-x-1/2 bg-orange" /></span>
          <span className="text-lg leading-none">↓</span>
        </a>
  </section>
);

export default HeroSection;
