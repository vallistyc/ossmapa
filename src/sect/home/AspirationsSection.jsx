const AspirationsSection = ({ onOpen }) => (
  <section
    id="aspirasi"
    data-cursor-theme="dark"
    className="relative overflow-hidden bg-orange px-6 py-24 text-ink sm:px-10 lg:px-20"
  >
    <div className="absolute -right-20 -top-40 h-96 w-96 rounded-full border-[50px] border-ink/10" />
    <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-10 lg:flex-row lg:items-end">
      <div>
        <p className="eyebrow text-ink/60">05 / Suara siswa</p>
        <h2 className="mt-4 max-w-3xl font-outfit text-5xl font-semibold leading-none tracking-tight sm:text-7xl">
          Punya sesuatu
          <br />
          untuk disampaikan?
        </h2>
      </div>
      <button
        type="button"
        onClick={onOpen}
        className="group flex w-fit items-center gap-4 rounded-full bg-ink px-6 py-4 font-outfit text-sm font-semibold text-cream transition hover:bg-cream hover:text-ink"
      >
        Kirim aspirasi{" "}
        <span className="grid h-8 w-8 place-items-center rounded-full bg-orange text-lg text-ink">
          ↗
        </span>
      </button>
    </div>
  </section>
);

export default AspirationsSection;
