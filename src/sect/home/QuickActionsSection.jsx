import { services } from "./homeData";

const QuickActionsSection = () => (
  <section
    id="layanan"
    className="border-y border-cream/10 bg-ink px-6 py-20 text-cream sm:px-10 lg:px-20"
  >
    <div className="mx-auto max-w-7xl">
      <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow text-orange">Akses cepat</p>
          <h2 className="section-title mt-3">Layanan OSSMAPA</h2>
        </div>
        <p className="max-w-xs font-outfit text-sm leading-6 text-cream/50">
          Akses Layanan Web OSIS dengan cepat dan mudah dengan fitur-fitur
          berikut.
        </p>
      </div>
      <div className="grid border-y border-cream/15 md:grid-cols-3">
        {services.map(([number, title, text, href]) => (
          <a
            href={href}
            key={number}
            className="service-card group border-b border-cream/15 bg-charcoal px-1 py-7 transition hover:bg-orange hover:text-ink md:border-b-0 md:px-7 md:even:border-x md:even:border-cream/15"
          >
            <span className="font-jersey-10 text-2xl text-orange group-hover:text-ink">
              {number}
            </span>
            <h3 className="mt-14 font-outfit text-2xl font-semibold">
              {title}
            </h3>
            <p className="mt-3 font-outfit text-sm leading-6 text-cream/50 group-hover:text-ink/70">
              {text}
            </p>
            <span className="mt-8 block text-2xl transition group-hover:translate-x-2">
              →
            </span>
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default QuickActionsSection;
