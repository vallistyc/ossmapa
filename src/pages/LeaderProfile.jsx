import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchLeaderById } from "../lib/homeDataApi";

const LeaderProfile = () => {
  const { id } = useParams();
  const [state, setState] = useState({ loading: true, leader: null, error: null });

  useEffect(() => {
    let active = true;
    fetchLeaderById(id)
      .then((result) => {
        if (active) setState({ loading: false, ...result });
      })
      .catch((error) => {
        if (active) setState({ loading: false, leader: null, error });
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (state.loading) return <main className="grid min-h-screen place-items-center bg-ink text-cream">Memuat profil...</main>;
  if (state.error || !state.leader) {
    return <main className="grid min-h-screen place-items-center bg-ink px-6 text-center text-cream"><div><p className="font-outfit text-lg">Profil pengurus tidak ditemukan.</p><Link to="/#pengurus" className="mt-4 inline-block text-orange">Kembali ke Pengurus ↗</Link></div></main>;
  }

  const { leader } = state;
  return (
    <main className="min-h-screen bg-ink px-6 pb-24 pt-12 text-cream sm:px-10 lg:px-20">
      <article className="mx-auto max-w-4xl">
        <Link to="/#pengurus" className="font-outfit text-sm text-orange hover:underline">← Kembali ke Pengurus</Link>
        <div className="mt-14 grid gap-10 md:grid-cols-[minmax(0,0.8fr)_1fr] md:items-center">
          <div className="aspect-[0.9] overflow-hidden rounded-2xl bg-gradient-to-br from-orange/40 to-ink">
            {leader.image_url ? <img src={leader.image_url} alt={leader.name} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center font-jersey-10 text-8xl text-cream/20">OS</div>}
          </div>
          <div>
            <p className="eyebrow text-orange">{leader.sekbid || "Pengurus OSSMAPA"}</p>
            <h1 className="mt-4 font-outfit text-5xl font-semibold leading-tight sm:text-7xl">{leader.name}</h1>
            <p className="mt-5 font-outfit text-xl text-cream/65">{leader.role}</p>
            <p className="mt-2 font-outfit text-sm text-cream/45">Periode {leader.period}</p>
            <div className="mt-8 space-y-3 border-t border-cream/15 pt-6 font-outfit text-sm text-cream/65">
              {leader.class_name && <p><span className="text-cream/35">Kelas</span> {leader.class_name}</p>}
              {leader.motto && <p><span className="text-cream/35">Motto</span> {leader.motto}</p>}
              {leader.instagram && <p><span className="text-cream/35">Instagram</span> {leader.instagram}</p>}
            </div>
          </div>
        </div>
      </article>
    </main>
  );
};

export default LeaderProfile;
