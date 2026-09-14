import { useRef } from "react";
import { divisions, programs } from "./homeData";

const ProgramsSection = ({
  activeDivision,
  onDivisionChange,
  showAll,
  onToggleShowAll,
}) => {
  const divisionScroller = useRef(null);
  const visiblePrograms = programs.filter(
    (program) => activeDivision === "Semua" || program[1] === activeDivision,
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
          {visiblePrograms
            .slice(0, showAll ? visiblePrograms.length : 4)
            .map(([title, division, date], index) => (
              <article
                key={title}
                className="program-row group border-t border-cream/15 py-6"
              >
                <div className="flex items-start justify-between">
                  <span className="font-jersey-10 text-2xl text-orange/70">
                    0{index + 1}
                  </span>
                  <span className="font-outfit text-[10px] uppercase tracking-widest text-cream/40">
                    {date}
                  </span>
                </div>
                <h3 className="mt-5 font-outfit text-2xl font-medium transition group-hover:text-orange">
                  {title}
                </h3>
                <p className="mt-2 font-outfit text-sm leading-6 text-cream/50">
                  Program kolaboratif untuk bertumbuh dan memberi dampak.
                </p>
                <span className="mt-6 inline-block font-outfit text-[10px] uppercase tracking-widest text-orange">
                  {division}
                </span>
              </article>
            ))}
        </div>
        <button
          type="button"
          onClick={onToggleShowAll}
          className="mt-10 border-b border-orange pb-2 font-outfit text-sm text-orange"
        >
          {showAll ? "Tampilkan lebih sedikit" : "Lihat semua program kerja"}{" "}
          <span className="ml-3">↗</span>
        </button>
      </div>
    </section>
  );
};

export default ProgramsSection;
