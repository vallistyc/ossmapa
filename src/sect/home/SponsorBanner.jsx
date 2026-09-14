const SponsorBanner = () => (
  <section className="sponsor-banner relative overflow-hidden border-y border-ink/10 bg-orange px-6 pb-5 pt-12 text-ink">
    <p className="absolute left-1/2 top-3 -translate-x-1/2 font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/60">
      Sponsor Kami Sebelumnya
    </p>
    <div className="sponsor-track flex w-max items-center font-outfit text-2xl font-semibold uppercase">
      {[1, 2].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 2}
          className="sponsor-marquee-group flex min-w-[100vw] shrink-0 items-center justify-around"
        >
          <span>ANELA</span>
          <span>✦</span>
          <span>FAVORICH</span>
          <span>✦</span>
          <span>EMINA</span>
          <span>✦</span>
          <span>BUYNANA</span>
          <span>✦</span>
        </div>
      ))}
    </div>
  </section>
);

export default SponsorBanner;
