import { useRef } from "react";
import { Link } from "react-router-dom";
const ProgramsSection = ({
  divisions,
  programs,
  activeDivision,
  onDivisionChange,
}) => {
  const divisionScroller = useRef(null);
  const visiblePrograms = programs.filter(
    (program) => activeDivision === "Semua" || program.division === activeDivision,
  );

  const scrollDivisions = (distance) => {
    divisionScroller.current?.scrollBy({
      left: distance,
      behavior: "smooth",
    });
  };

  return (
    <section id="proker" className="px-6 py-28 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow text-orange">03 / Program kerja</p>
            <h2 className="section-title mt-3">
              Ide yang menjadi
              <br />
              <span className="font-jersey-10 text-orange">aksi nyata.</span>
            </h2>
          </div>
          <div className="flex max-w-full items-center gap-2 lg:max-w-[42rem]">
            <button
              type="button"
              onClick={() => scrollDivisions(-180)}
              className="division-scroll-button"
              aria-label="Geser daftar sekbid ke kiri"
            >
              ←
            </button>
            <div ref={divisionScroller} className="hide-scrollbar flex min-w-0 gap-2 overflow-x-auto">
              {divisions.map((division) => (
                <button
                  key={division}
                  type="button"
                  onClick={() => onDivisionChange(division)}
                  className={`shrink-0 border px-4 py-2 font-outfit text-xs transition ${activeDivision === division ? "border-orange bg-orange text-ink" : "border-cream/20 text-cream/55 hover:border-orange hover:text-orange"}`}
                >
                  {division}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => scrollDivisions(180)}
              className="division-scroll-button"
              aria-label="Geser daftar sekbid ke kanan"
            >
              →
            </button>
          </div>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {visiblePrograms.length === 0 ? (
            <p className="font-outfit text-sm text-cream/50">Tidak Ada Data</p>
          ) : visiblePrograms
            .slice(0, 4)
            .map((program, index) => (
              <article
                key={program.id}
                className="program-row group border-t border-cream/15 py-6"
              >
                <div className="flex items-start justify-between">
                  <span className="font-jersey-10 text-2xl text-orange/70">
                    0{index + 1}
                  </span>
                  <span className="font-outfit text-[10px] uppercase tracking-widest text-cream/40">
                    {program.event_date}
                  </span>
                </div>
                <h3 className="mt-5 font-outfit text-2xl font-medium transition group-hover:text-orange">
                  {program.title}
                </h3>
                <p className="mt-2 font-outfit text-sm leading-6 text-cream/50">
                  {program.description}
                </p>
                <span className="mt-6 inline-block font-outfit text-[10px] uppercase tracking-widest text-orange">
                  {program.division}
                </span>
              </article>
            ))}
        </div>
        <Link to="/proker" className="mt-10 inline-block border-b border-orange pb-2 font-outfit text-sm text-orange">
          Lihat semua program kerja <span className="ml-3">↗</span>
        </Link>
      </div>
    </section>
  );
};

export default ProgramsSection;
