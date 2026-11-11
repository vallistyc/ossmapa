import { Link } from "react-router-dom";

const LeadershipSection = ({ leaders }) => (
  <section id="pengurus" className="bg-charcoal px-6 py-24 sm:px-10 lg:px-20">
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow text-orange">02 / Pengurus</p>
          <h2 className="section-title mt-3">
            Orang-orang
            <br />
            <span className="text-orange">di balik gerak.</span>
          </h2>
        </div>
        <a
          href="#"
          className="font-outfit text-sm text-cream/65 underline decoration-orange underline-offset-8"
        >
          Lihat seluruh pengurus ↗
        </a>
      </div>
      <div className="mt-14 grid gap-8 border-t border-cream/15 pt-8 md:grid-cols-3 md:gap-5">
        {leaders.map((leader, index) => (
          <Link
            to={`/pengurus/${leader.id}`}
            key={leader.id}
            className={`person-card group ${index === 1 ? "md:-translate-y-8" : ""}`}
          >
            <div className="relative aspect-[0.9] overflow-hidden bg-gradient-to-br from-orange/40 to-ink">
              {leader.image_url ? (
                <img src={leader.image_url} alt={leader.name} className="h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0 grid place-items-center font-jersey-10 text-8xl text-cream/20">OS</div>
              )}
              <span className="absolute left-5 top-5 rounded-full border border-cream/25 px-3 py-1 font-outfit text-[10px] uppercase tracking-widest">
              {leader.period}
              </span>
              <span className="absolute bottom-5 right-5 grid h-10 w-10 place-items-center rounded-full bg-orange text-xl text-ink transition group-hover:rotate-45">
                ↗
              </span>
            </div>
            <p className="mt-5 font-outfit text-xs uppercase tracking-[0.22em] text-orange">
              {leader.role}
            </p>
            <h3 className="mt-1 font-outfit text-2xl font-medium">
              {leader.name}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default LeadershipSection;
