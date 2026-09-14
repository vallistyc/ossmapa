import { pancapilar } from "./homeData";

const AboutSection = () => (
    <section id="tentang" className="px-6 py-24 sm:px-10 lg:px-20 lg:py-32">
        <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-20">
                <div>
                    <p className="eyebrow text-orange">01 / Tentang kami</p>
                    <h2 className="mt-6 max-w-3xl font-outfit text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
                        OSSMAPA
                        <br />
                        <span className="font-jersey-10 font-normal text-orange">punya kita.</span>
                    </h2>
                </div>
                <div className="flex items-end gap-6 border-l border-orange/40 pl-6 sm:pl-8">
                    <img src="/osis.png" alt="Logo OSIS SMAN 1 Paciran" className="h-20 w-20 object-contain sm:h-28 sm:w-28" />
                    <p className="max-w-sm font-outfit text-sm leading-7 text-cream/65">
                        Organisasi Siswa Intra Sekolah SMAN 1 Paciran hadir sebagai wadah bagi siswa untuk belajar memimpin, bekerja bersama, dan menciptakan perubahan yang berarti.
                    </p>
                </div>
            </div>

            <div className="mt-20 border-t border-cream/15 pt-8">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <p className="eyebrow text-orange">Nilai dasar OSIS</p>
                        <h3 className="mt-3 font-jersey-10 text-5xl uppercase text-cream sm:text-6xl">Pancapilar</h3>
                    </div>
                    <p className="max-w-xs font-outfit text-xs leading-6 text-cream/45">Lima prinsip yang menjadi arah setiap langkah dan keputusan kami.</p>
                </div>
                <div className="mt-10 grid gap-px overflow-hidden border-y border-cream/15 bg-cream/15 sm:grid-cols-5">
                    {pancapilar.map((value, index) => (
                        <div key={value} className="group bg-ink px-4 py-6 transition hover:bg-orange hover:text-ink sm:px-5">
                            <span className="font-jersey-10 text-3xl text-orange transition-colors group-hover:text-ink">0{index + 1}</span>
                            <p className="mt-8 font-outfit text-base font-medium">{value}</p>
                        </div>
                    ))}
                </div>
            </div>
    </div>
  </section>
);

export default AboutSection;
