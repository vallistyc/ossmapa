import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchAchievements, fetchHomeData, fetchProgramById, submitAspiration } from "../lib/homeDataApi";

const PageShell = ({ eyebrow, title, children, compact = false, showHomeLink = true }) => (
  <main className={`min-h-screen bg-ink px-5 pb-24 text-cream sm:px-10 lg:px-20 ${compact ? "pt-10 sm:pt-12" : "pt-36"}`}>
    <div className="mx-auto max-w-7xl">{showHomeLink && <Link to="/" className="font-outfit text-sm text-orange hover:underline">← Beranda</Link>}<p className={`eyebrow text-orange ${showHomeLink ? (compact ? "mt-6 sm:mt-8" : "mt-16") : "mt-0"}`}>{eyebrow}</p><h1 className="mt-1 font-outfit text-5xl font-semibold sm:text-7xl">{title}</h1>{children}</div>
  </main>
);

const usePublicData = () => {
  const [state, setState] = useState({ loading: true, data: null, error: null });
  useEffect(() => {
    fetchHomeData().then((result) => setState({ loading: false, data: result.data, error: result.error }));
  }, []);
  return state;
};

export const ProgramsPage = () => {
  const { loading, data, error } = usePublicData();
  if (loading) return <PageShell eyebrow="Proker" title="Program kerja." >Memuat data...</PageShell>;
  const divisions = ["Semua", ...new Set(data.programs.map((program) => program.division).filter(Boolean))];
  return <ProgramsList data={data} error={error} divisions={divisions} />;
};

const ProgramsList = ({ data, error, divisions }) => {
  const [division, setDivision] = useState("Semua");
  const programs = data.programs.filter((program) => division === "Semua" || program.division === division);
  return (
    <PageShell eyebrow="Program kerja" title="Aksi nyata OSSMAPA." compact showHomeLink={false}>
      {error && <p className="mt-5 text-sm text-orange">Menampilkan data cadangan.</p>}
      <div className="mt-5 flex gap-2 overflow-x-auto pb-2 sm:mt-6">
        {divisions.map((item) => <button key={item} type="button" onClick={() => setDivision(item)} className={`shrink-0 border px-4 py-2 font-outfit text-xs transition ${division === item ? "border-orange bg-orange text-ink" : "border-cream/20 text-cream/55 hover:border-orange hover:text-orange"}`}>{item}</button>)}
      </div>
      <div className="mt-4 grid gap-4 md:mt-5 md:grid-cols-2">
        {programs.map((program) => (
          <Link to={`/proker/${program.id}`} key={program.id} className="group border-t border-cream/15 py-6 transition hover:border-orange">
            <p className="font-outfit text-xs text-orange">{program.division} · {program.event_date} · {program.status || "Belum dimulai"}</p>
            <h2 className="mt-3 font-outfit text-2xl transition group-hover:text-orange">{program.title}</h2>
            <p className="mt-2 font-outfit text-sm leading-6 text-cream/55">{program.description}</p>
            <span className="mt-5 inline-block font-outfit text-xs text-orange">Lihat detail ↗</span>
          </Link>
        ))}
      </div>
      {programs.length === 0 && <p className="mt-8 font-outfit text-sm text-cream/50">Belum ada proker pada Sekbid ini.</p>}
    </PageShell>
  );
};

export const ProgramDetailPage = () => {
  const { id } = useParams();
  const [state, setState] = useState({ loading: true, program: null, error: null });
  useEffect(() => {
    fetchProgramById(id).then((result) => setState({ loading: false, ...result }));
  }, [id]);
  if (state.loading) return <PageShell eyebrow="Proker" title="Memuat detail.">Memuat data...</PageShell>;
  if (state.error || !state.program) return <PageShell eyebrow="Proker" title="Proker tidak ditemukan." showHomeLink={false}><p className="mt-6 font-outfit text-sm text-cream/55">Proker mungkin belum diverifikasi atau sudah tidak tersedia.</p><Link to="/proker" className="mt-6 inline-block text-orange">← Kembali ke Proker</Link></PageShell>;
  const { program } = state;
  return <PageShell eyebrow={program.division || "Program kerja"} title={program.title} showHomeLink={false}><div className="mt-12 max-w-3xl border-t border-cream/15 pt-8"><dl className="grid gap-6 sm:grid-cols-3"><div><dt className="font-outfit text-xs uppercase tracking-widest text-cream/40">Sekbid</dt><dd className="mt-2 font-outfit text-lg text-orange">{program.division || "Belum ditentukan"}</dd></div><div><dt className="font-outfit text-xs uppercase tracking-widest text-cream/40">Tanggal perkiraan</dt><dd className="mt-2 font-outfit text-lg">{program.event_date}</dd></div><div><dt className="font-outfit text-xs uppercase tracking-widest text-cream/40">Status pelaksanaan</dt><dd className="mt-2 font-outfit text-lg">{program.status || "Belum dimulai"}</dd></div></dl><div className="mt-10"><h2 className="font-outfit text-xl font-semibold">Deskripsi</h2><p className="mt-4 whitespace-pre-line font-outfit text-base leading-8 text-cream/65">{program.description}</p></div><Link to="/proker" className="mt-10 inline-block text-orange hover:underline">← Kembali ke daftar Proker</Link></div></PageShell>;
};

export const BlogPage = () => {
  const { loading, data } = usePublicData();
  if (loading) return <PageShell eyebrow="Blog" title="Cerita terbaru.">Memuat data...</PageShell>;
  return <PageShell eyebrow="Blog OSIS" title="Cerita dari kami." compact showHomeLink={false}><div className="mt-5 grid gap-6 md:mt-6 md:grid-cols-3">{data.articles.map((article) => <article key={article.id}><img src={article.image_url} alt="" className="aspect-[1.35] w-full rounded-xl object-cover" /><p className="mt-4 font-outfit text-xs uppercase text-orange">{article.category}</p><Link to={`/blog/${article.slug || article.id}`} className="mt-2 block font-outfit text-xl hover:text-orange">{article.title}</Link><p className="mt-2 font-outfit text-sm text-cream/55">{article.excerpt}</p></article>)}</div></PageShell>;
};

export const AspirationsPage = () => {
  const [values, setValues] = useState({ name: "", message: "" });
  const [state, setState] = useState({ loading: false, error: null, success: false });

  const update = (key, value) => setValues((current) => ({ ...current, [key]: value }));
  const submit = async (event) => {
    event.preventDefault();
    setState({ loading: true, error: null, success: false });
    try {
      await submitAspiration(values);
      setValues({ name: "", message: "" });
      setState({ loading: false, error: null, success: true });
    } catch (error) {
      setState({ loading: false, error: error.message, success: false });
    }
  };

  return (
    <PageShell eyebrow="Aspirasi" title="Suara siswa.">
      <form onSubmit={submit} className="mt-8 max-w-2xl rounded-2xl border border-cream/15 bg-charcoal p-6 sm:mt-10 sm:p-8">
        <p className="font-outfit text-sm leading-6 text-cream/55">Sampaikan ide, masukan, atau keresahanmu kepada OSIS.</p>
        <label className="mt-6 block font-outfit text-xs text-cream/65">Nama <span className="text-cream/35">(opsional)</span><input value={values.name} onChange={(event) => update("name", event.target.value)} placeholder="Nama kamu" className="admin-input" /></label>
        <label className="mt-5 block font-outfit text-xs text-cream/65">Aspirasi<textarea required value={values.message} onChange={(event) => update("message", event.target.value)} placeholder="Tulis aspirasi kamu di sini..." rows="6" className="admin-input resize-y" /></label>
        {state.error && <p className="mt-5 rounded-lg bg-red-950/50 p-4 text-sm text-red-300">{state.error}</p>}
        {state.success && <p className="mt-5 rounded-lg bg-green-950/50 p-4 text-sm text-green-300">Aspirasi berhasil dikirim. Terima kasih sudah menyampaikan suaramu.</p>}
        <button type="submit" disabled={state.loading} className="mt-6 rounded-full bg-orange px-6 py-3 font-outfit text-sm font-semibold text-ink disabled:opacity-50">{state.loading ? "Mengirim..." : "Kirim aspirasi ↗"}</button>
      </form>
    </PageShell>
  );
};

export const AchievementsPage = () => {
  const [state, setState] = useState({ loading: true, achievements: [] });
  useEffect(() => { fetchAchievements().then((result) => setState({ loading: false, achievements: result.achievements })); }, []);
  return <PageShell eyebrow="Prestasi siswa" title="Apresiasi yang menginspirasi."><Link to="/pendataan/prestasi" className="mt-8 inline-block rounded-full bg-orange px-5 py-3 font-outfit text-sm font-semibold text-ink">Kirim prestasi ↗</Link>{state.loading ? <p className="mt-12 font-outfit text-sm text-cream/50">Memuat prestasi...</p> : <div className="mt-12 grid gap-4 md:grid-cols-2">{state.achievements.map((item) => <article key={item.id} className="rounded-xl border border-cream/15 bg-charcoal p-5"><p className="font-outfit text-xs text-orange">{item.level} · {item.event_date}</p><h2 className="mt-3 font-outfit text-xl">{item.title}</h2><p className="mt-2 font-outfit text-sm text-cream/55">{item.name} · {item.class_name}</p>{item.description && <p className="mt-4 font-outfit text-sm leading-6 text-cream/60">{item.description}</p>}</article>)}</div>}</PageShell>;
};
