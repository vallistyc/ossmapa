import { useState } from "react";
import { submitAchievement } from "../lib/homeDataApi";

const classGroups = {
  X: ["X-E1", "X-E2"],
  XI: Array.from({ length: 10 }, (_, index) => `XI-F${index + 1}`),
  XII: Array.from({ length: 10 }, (_, index) => `XII-F${index + 1}`),
};
const levels = ["Kabupaten", "Provinsi", "Nasional", "Internasional"];
const achievementResults = ["Juara 1", "Juara 2", "Juara 3", "Juara Harapan", "Nominasi"];
const achievementTypes = ["Lomba", "Pembicara", "Duta", "Riset", "Kepemilikan Bisnis", "Dan Lain-Lain"];
const initialValues = {
  name: "",
  nis: "",
  whatsapp: "",
  class_name: "",
  title: "",
  type: "",
  result: "",
  level: "",
  event_date: "",
  description: "",
  proof_file: null,
};

const PublicAchievementForm = () => {
  const [values, setValues] = useState(initialValues);
  const [classGroup, setClassGroup] = useState("");
  const [state, setState] = useState({ loading: false, error: null, success: false });
  const update = (key, value) => setValues((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setState({ loading: true, error: null, success: false });
    try {
      await submitAchievement(values);
      setValues(initialValues);
      setClassGroup("");
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
          <label className="font-outfit text-xs text-cream/65">Nama lengkap<input required value={values.name} onChange={(event) => update("name", event.target.value)} className="admin-input" /></label>
          <label className="font-outfit text-xs text-cream/65">NIS<input required value={values.nis} onChange={(event) => update("nis", event.target.value)} className="admin-input" /></label>
          <label className="font-outfit text-xs text-cream/65">Nomor WhatsApp<input required type="tel" value={values.whatsapp} onChange={(event) => update("whatsapp", event.target.value)} className="admin-input" /></label>
          <label className="font-outfit text-xs text-cream/65">Tingkat kelas<select required value={classGroup} onChange={(event) => { setClassGroup(event.target.value); update("class_name", ""); }} className="admin-input"><option value="">Pilih tingkat kelas</option>{Object.keys(classGroups).map((group) => <option key={group} value={group}>{group}</option>)}</select></label>
          <label className="font-outfit text-xs text-cream/65">Kelas<select required value={values.class_name} onChange={(event) => update("class_name", event.target.value)} disabled={!classGroup} className="admin-input disabled:opacity-40"><option value="">Pilih kelas</option>{(classGroups[classGroup] || []).map((className) => <option key={className} value={className}>{className}</option>)}</select></label>
          <label className="font-outfit text-xs text-cream/65">Nama prestasi<input required value={values.title} onChange={(event) => update("title", event.target.value)} className="admin-input" /></label>
          <label className="font-outfit text-xs text-cream/65">Jenis prestasi<select required value={values.type} onChange={(event) => update("type", event.target.value)} className="admin-input"><option value="">Pilih jenis</option>{achievementTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
          <label className="font-outfit text-xs text-cream/65">Prestasi<select required value={values.result} onChange={(event) => update("result", event.target.value)} className="admin-input"><option value="">Pilih prestasi</option>{achievementResults.map((result) => <option key={result}>{result}</option>)}</select></label>
          <label className="font-outfit text-xs text-cream/65">Tingkat<select required value={values.level} onChange={(event) => update("level", event.target.value)} className="admin-input"><option value="">Pilih tingkat</option>{levels.map((level) => <option key={level}>{level}</option>)}</select></label>
          <label className="font-outfit text-xs text-cream/65">Tanggal / tahun<input required value={values.event_date} onChange={(event) => update("event_date", event.target.value)} className="admin-input" /></label>
          <label className="font-outfit text-xs text-cream/65 sm:col-span-2">Bukti prestasi <span className="text-cream/35">(JPG, PNG, atau PDF)</span><input required type="file" accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf" onChange={(event) => update("proof_file", event.target.files?.[0] || null)} className="admin-input file:mr-3 file:rounded-full file:border-0 file:bg-orange file:px-3 file:py-1 file:font-outfit file:text-xs file:font-semibold file:text-ink" /></label>
          <label className="font-outfit text-xs text-cream/65 sm:col-span-2">Deskripsi prestasi<textarea required value={values.description} onChange={(event) => update("description", event.target.value)} rows="5" className="admin-input resize-y" /></label>
        </div>
        {state.error && <p className="mt-5 rounded-lg bg-red-950/50 p-4 text-sm text-red-300">{state.error}</p>}
        {state.success && <p className="mt-5 rounded-lg bg-green-950/50 p-4 text-sm text-green-300">Data berhasil dikirim dan menunggu verifikasi OSIS.</p>}
        <button disabled={state.loading} className="mt-7 rounded-full bg-orange px-6 py-3 font-outfit text-sm font-semibold text-ink disabled:opacity-50">{state.loading ? "Mengirim..." : "Kirim prestasi ↗"}</button>
      </form>
    </main>
  );
};

export default PublicAchievementForm;
