import { useCallback, useEffect, useState } from "react";
import { fetchAdminRows } from "../lib/adminApi";

const targetLeaders = 47;

const AdminDashboardOverview = ({ onOpenTable }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    return Promise.all(["leaders", "programs", "blog_posts", "sponsors", "aspirations"].map(fetchAdminRows))
      .then(([leaders, programs, blogPosts, sponsors, aspirations]) => {
        setData({ leaders, programs, blogPosts, sponsors, aspirations });
      })
      .catch((loadError) => {
        setError(loadError.message);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (error) return <div className="rounded-lg bg-red-950/50 p-4 text-sm text-red-300"><p>{error}</p><button onClick={load} className="mt-3 rounded-full border border-red-300/40 px-4 py-2 font-semibold hover:bg-red-300/10">Coba lagi</button></div>;
  if (!data) return <p className="p-6 font-outfit text-sm text-cream/50">Memuat dashboard...</p>;

  const pendingLeaders = data.leaders.filter((leader) => !leader.published).length;
  const pendingPrograms = data.programs.filter((program) => !program.published).length;
  const pendingAspirations = data.aspirations.filter((item) => item.status === "baru").length;
  const latestAspirations = [...data.aspirations]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <p className="eyebrow text-orange">Overview</p>
        <h2 className="mt-2 font-outfit text-2xl font-semibold sm:text-3xl">Selamat datang kembali.</h2>
        <p className="mt-2 font-outfit text-sm text-cream/50">Ringkasan kondisi website dan pekerjaan yang perlu ditindaklanjuti.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <button onClick={() => onOpenTable("leaders")} className="rounded-xl border border-cream/15 bg-charcoal p-5 text-left hover:border-orange">
          <p className="font-outfit text-xs text-cream/50">Kelengkapan Pengurus</p>
          <p className="mt-3 font-outfit text-4xl font-semibold text-orange">{data.leaders.length}<span className="text-xl text-cream/40">/{targetLeaders}</span></p>
          <p className="mt-2 font-outfit text-xs text-cream/45">{pendingLeaders} menunggu verifikasi</p>
        </button>
        <button onClick={() => onOpenTable("blog_posts")} className="rounded-xl border border-cream/15 bg-charcoal p-5 text-left hover:border-orange">
          <p className="font-outfit text-xs text-cream/50">Blog</p>
          <p className="mt-3 font-outfit text-4xl font-semibold">{data.blogPosts.filter((post) => post.published).length}</p>
          <p className="mt-2 font-outfit text-xs text-cream/45">terpublish · {data.blogPosts.filter((post) => !post.published).length} draft</p>
        </button>
        <button onClick={() => onOpenTable("sponsors")} className="rounded-xl border border-cream/15 bg-charcoal p-5 text-left hover:border-orange">
          <p className="font-outfit text-xs text-cream/50">Sponsor</p>
          <p className="mt-3 font-outfit text-4xl font-semibold">{data.sponsors.length}</p>
          <p className="mt-2 font-outfit text-xs text-cream/45">total kerja sama</p>
        </button>
        <button onClick={() => onOpenTable("aspirations")} className="rounded-xl border border-orange/30 bg-orange p-5 text-left text-ink hover:bg-cream">
          <p className="font-outfit text-xs text-ink/60">Aspirasi Prioritas</p>
          <p className="mt-3 font-outfit text-4xl font-semibold">{pendingAspirations}</p>
          <p className="mt-2 font-outfit text-xs text-ink/60">perlu ditindaklanjuti</p>
        </button>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-xl border border-orange/25 bg-charcoal p-4 sm:p-6">
          <p className="eyebrow text-orange">Pekerjaan utama</p>
          <h3 className="mt-2 font-outfit text-xl font-semibold">Yang perlu diperiksa</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button onClick={() => onOpenTable("leaders")} className="rounded-lg border border-cream/10 bg-ink p-4 text-left hover:border-orange">
              <p className="font-outfit text-sm">Verifikasi Pengurus</p>
              <p className="mt-2 font-outfit text-2xl font-semibold text-orange">{pendingLeaders}</p>
              <p className="mt-1 font-outfit text-xs text-cream/45">{pendingLeaders} data menunggu review ↗</p>
            </button>
            <button onClick={() => onOpenTable("programs")} className="rounded-lg border border-cream/10 bg-ink p-4 text-left hover:border-orange">
              <p className="font-outfit text-sm">Verifikasi Proker</p>
              <p className="mt-2 font-outfit text-2xl font-semibold text-orange">{pendingPrograms}</p>
              <p className="mt-1 font-outfit text-xs text-cream/45">proker menunggu review ↗</p>
            </button>
          </div>
        </section>
        <section className="rounded-xl border border-cream/15 bg-charcoal p-4 sm:p-6">
          <div className="flex items-end justify-between gap-3"><div><p className="eyebrow text-orange">Terbaru</p><h3 className="mt-2 font-outfit text-xl font-semibold">Aspirasi</h3></div><button onClick={() => onOpenTable("aspirations")} className="font-outfit text-xs text-orange hover:underline">Lihat semua ↗</button></div>
          <div className="mt-5 space-y-4">{latestAspirations.map((item) => <div key={item.id} className="border-t border-cream/10 pt-3"><div className="flex justify-between gap-3"><p className="font-outfit text-sm">{item.name || "Anonim"}</p><span className={`font-outfit text-[10px] uppercase ${item.status === "baru" ? "text-orange" : "text-cream/40"}`}>{item.status}</span></div><p className="mt-1 line-clamp-2 font-outfit text-xs leading-5 text-cream/50">{item.message}</p></div>)}</div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboardOverview;
