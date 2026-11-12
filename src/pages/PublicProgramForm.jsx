import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { fetchSekbidOptions } from "../lib/adminApi";

const initialForm = {
  title: "",
  sekbid_id: "",
  event_date: "",
  description: "",
};

const PublicProgramForm = () => {
  const [form, setForm] = useState(initialForm);
  const [sekbids, setSekbids] = useState([]);
  const [state, setState] = useState({ loading: true, error: null, success: false });

  useEffect(() => {
    fetchSekbidOptions()
      .then((data) => {
        setSekbids(data);
        setState({ loading: false, error: null, success: false });
      })
      .catch((error) => setState({ loading: false, error: error.message, success: false }));
  }, []);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setState({ loading: true, error: null, success: false });
    try {
      if (!supabase) throw new Error("Layanan sedang belum dikonfigurasi.");
      const { error } = await supabase.from("programs").insert({
        ...form,
        sort_order: 0,
        published: false,
      });
      if (error) throw new Error("Data Proker belum dapat dikirim. Silakan coba lagi.");
      setForm(initialForm);
      setState({ loading: false, error: null, success: true });
    } catch (error) {
      setState({ loading: false, error: error.message, success: false });
    }
  };

  return (
    <main className="min-h-screen bg-ink px-6 py-10 text-cream sm:px-10">
      <div className="mx-auto max-w-2xl">
        <div className="mt-16">
          <p className="eyebrow text-orange">OSSMAPA / Pendataan Proker</p>
          <h1 className="mt-4 font-outfit text-5xl font-semibold leading-none sm:text-7xl">Ajukan proker.</h1>
          <p className="mt-6 max-w-xl font-outfit leading-7 text-cream/55">Isi rancangan program kerja. Data akan ditinjau dan diverifikasi Admin sebelum tampil di website.</p>
        </div>
        <section className="mt-8 rounded-xl border border-orange/25 bg-orange/10 p-5">
          <p className="font-outfit text-sm font-semibold text-orange">Cara mengisi form</p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 font-outfit text-sm leading-6 text-cream/65">
            <li>Tulis nama proker yang singkat dan mudah dipahami.</li>
            <li>Pilih Sekbid yang menaungi proker tersebut.</li>
            <li>Isi waktu pelaksanaan serta deskripsi tujuan dan gambaran kegiatan.</li>
            <li>Periksa kembali data sebelum menekan tombol Kirim proker.</li>
          </ol>
        </section>
        <form onSubmit={submit} className="mt-12 rounded-2xl border border-cream/15 bg-charcoal p-6 sm:p-8">
          <label className="block font-outfit text-sm text-cream/70">Nama proker<input required value={form.title} onChange={(event) => update("title", event.target.value)} className="admin-input" placeholder="Contoh: OSIS Mengajar" /></label>
          <label className="mt-5 block font-outfit text-sm text-cream/70">Sekbid
            <select required value={form.sekbid_id} onChange={(event) => update("sekbid_id", event.target.value)} className="admin-input">
              <option value="">Pilih Sekbid</option>
              {sekbids.map((sekbid) => <option key={sekbid.id} value={sekbid.id}>{sekbid.name}</option>)}
            </select>
          </label>
          <label className="mt-5 block font-outfit text-sm text-cream/70">Waktu pelaksanaan<input required value={form.event_date} onChange={(event) => update("event_date", event.target.value)} className="admin-input" placeholder="Contoh: Januari 2027" /></label>
          <label className="mt-5 block font-outfit text-sm text-cream/70">Deskripsi<textarea required value={form.description} onChange={(event) => update("description", event.target.value)} className="admin-input min-h-32 resize-y" placeholder="Jelaskan tujuan dan gambaran kegiatan..." /></label>
          {state.error && <p className="mt-5 rounded-lg bg-red-950/50 p-4 text-sm text-red-300">{state.error}</p>}
          {state.success && <p className="mt-5 rounded-lg bg-green-950/50 p-4 text-sm text-green-300">Proker berhasil dikirim dan menunggu verifikasi Admin.</p>}
          <button disabled={state.loading} className="mt-7 rounded-full bg-orange px-6 py-3 font-outfit text-sm font-semibold text-ink disabled:opacity-50">{state.loading ? "Memuat..." : "Kirim proker ↗"}</button>
        </form>
      </div>
    </main>
  );
};

export default PublicProgramForm;
