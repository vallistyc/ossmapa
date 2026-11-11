import { useState } from "react";
import { submitAchievement } from "../lib/homeDataApi";

const PublicAchievementForm = () => {
  const [values, setValues] = useState({ name: "", class_name: "", title: "", level: "", event_date: "", description: "" });
  const [state, setState] = useState({ loading: false, error: null, success: false });
  const update = (key, value) => setValues((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setState({ loading: true, error: null, success: false });
    try {
      await submitAchievement(values);
      setValues({ name: "", class_name: "", title: "", level: "", event_date: "", description: "" });
      setState({ loading: false, error: null, success: true });
    } catch (error) {
      setState({ loading: false, error: error.message, success: false });
    }
  };

  return (
    <main className="min-h-screen bg-ink px-5 py-10 text-cream sm:px-10 sm:py-16">
      <form onSubmit={submit} className="mx-auto max-w-2xl rounded-2xl border border-cream/15 bg-charcoal p-6 sm:p-10">
        <p className="eyebrow text-orange">Apresiasi Prestasi</p>
        <h1 className="mt-3 font-outfit text-4xl font-semibold">Ceritakan prestasimu.</h1>
        <p className="mt-3 font-outfit text-sm leading-6 text-cream/55">Data akan diperiksa oleh OSIS sebelum dipublikasikan.</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {[["name", "Nama lengkap"], ["class_name", "Kelas"], ["title", "Nama prestasi"], ["level", "Tingkat perlombaan"], ["event_date", "Tanggal / tahun"]].map(([key, label]) => (
            <label key={key} className="font-outfit text-xs text-cream/65">{label}<input required value={values[key]} onChange={(event) => update(key, event.target.value)} className="admin-input" /></label>
          ))}
          <label className="font-outfit text-xs text-cream/65 sm:col-span-2">Ceritakan prestasimu<textarea value={values.description} onChange={(event) => update("description", event.target.value)} rows="5" className="admin-input resize-y" /></label>
        </div>
        {state.error && <p className="mt-5 rounded-lg bg-red-950/50 p-4 text-sm text-red-300">{state.error}</p>}
        {state.success && <p className="mt-5 rounded-lg bg-green-950/50 p-4 text-sm text-green-300">Data berhasil dikirim dan menunggu verifikasi OSIS.</p>}
        <button disabled={state.loading} className="mt-7 rounded-full bg-orange px-6 py-3 font-outfit text-sm font-semibold text-ink disabled:opacity-50">{state.loading ? "Mengirim..." : "Kirim prestasi ↗"}</button>
      </form>
    </main>
  );
};

export default PublicAchievementForm;
