import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { fetchSekbidOptions, uploadPublicLeaderImage } from "../lib/adminApi";

const initialForm = {
  name: "",
  nis: "",
  period: "2026—27",
  sekbid_id: "",
  role: "",
  image_url: "",
};

const bphRoles = [
  "Ketua Umum",
  "Ketua 1",
  "Ketua 2",
  "Sekretaris 1",
  "Sekretaris 2",
  "Bendahara 1",
  "Bendahara 2",
];
const divisionRoles = ["Co", "Anggota"];

const PublicLeaderForm = () => {
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
  const selectedSekbid = sekbids.find((sekbid) => String(sekbid.id) === String(form.sekbid_id));
  const roleOptions = selectedSekbid?.name.toLowerCase() === "bph" ? bphRoles : divisionRoles;

  const updateSekbid = (value) => setForm((current) => ({ ...current, sekbid_id: value, role: "" }));

  const submit = async (event) => {
    event.preventDefault();
    setState({ loading: true, error: null, success: false });
    try {
      if (!supabase) throw new Error("Layanan sedang belum dikonfigurasi.");
      const { error } = await supabase.from("leaders").insert({
        ...form,
        published: false,
        sort_order: 0,
      });
      if (error) throw new Error("Data belum dapat dikirim. Silakan coba lagi.");
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
          <p className="eyebrow text-orange">OSSMAPA / Pendataan</p>
          <h1 className="mt-4 font-outfit text-5xl font-semibold leading-none sm:text-7xl">Data pengurus.</h1>
          <p className="mt-6 max-w-xl font-outfit leading-7 text-cream/55">Isi data diri kepengurusan. Data akan diperiksa pengurus inti sebelum ditampilkan di website.</p>
        </div>
        <section className="mt-8 rounded-xl border border-orange/25 bg-orange/10 p-5">
          <p className="font-outfit text-sm font-semibold text-orange">Cara mengisi form</p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 font-outfit text-sm leading-6 text-cream/65">
            <li>Isi nama, NIS, dan periode kepengurusan dengan data yang benar.</li>
            <li>Pilih Sekbid terlebih dahulu, lalu pilih jabatan yang sesuai.</li>
            <li>Upload foto JPG, PNG, atau WEBP maksimal 5 MB.</li>
            <li>Periksa kembali data sebelum menekan tombol Kirim data.</li>
          </ol>
        </section>
        <form onSubmit={submit} className="mt-12 rounded-2xl border border-cream/15 bg-charcoal p-6 sm:p-8">
          <label className="block font-outfit text-sm text-cream/70">Nama lengkap<input required value={form.name} onChange={(event) => update("name", event.target.value)} className="admin-input" /></label>
          <label className="mt-5 block font-outfit text-sm text-cream/70">NIS<input required value={form.nis} onChange={(event) => update("nis", event.target.value)} className="admin-input" inputMode="numeric" /></label>
          <label className="mt-5 block font-outfit text-sm text-cream/70">Periode<input required value={form.period} onChange={(event) => update("period", event.target.value)} className="admin-input" /></label>
          <label className="mt-5 block font-outfit text-sm text-cream/70">Sekbid
            <select required value={form.sekbid_id} onChange={(event) => updateSekbid(event.target.value)} className="admin-input">
              <option value="">Pilih Sekbid</option>
              {sekbids.map((sekbid) => <option key={sekbid.id} value={sekbid.id}>{sekbid.name}</option>)}
            </select>
          </label>
          <label className="mt-5 block font-outfit text-sm text-cream/70">Jabatan
            <select required value={form.role} onChange={(event) => update("role", event.target.value)} className="admin-input" disabled={!form.sekbid_id}>
              <option value="">{form.sekbid_id ? "Pilih jabatan" : "Pilih Sekbid terlebih dahulu"}</option>
              {roleOptions.map((role) => <option key={role} value={role}>{role}</option>)}
            </select>
          </label>
          <label className="mt-5 block font-outfit text-sm text-cream/70">
            Upload foto (opsional)
            <input type="file" accept="image/*" className="admin-input file:mr-3 file:rounded-full file:border-0 file:bg-orange file:px-3 file:py-1 file:text-ink" onChange={async (event) => { const file = event.target.files[0]; if (!file) return; try { update("image_url", await uploadPublicLeaderImage(file)); } catch (error) { setState({ loading: false, error: error.message, success: false }); } }} />
            <span className="mt-2 block text-xs text-cream/40">JPG, PNG, atau WEBP. Maksimal 5 MB.</span>
          </label>
          {state.error && <p className="mt-5 rounded-lg bg-red-950/50 p-4 text-sm text-red-300">{state.error}</p>}
          {state.success && <p className="mt-5 rounded-lg bg-green-950/50 p-4 text-sm text-green-300">Data berhasil dikirim dan menunggu verifikasi.</p>}
          <button disabled={state.loading} className="mt-7 rounded-full bg-orange px-6 py-3 font-outfit text-sm font-semibold text-ink disabled:opacity-50">{state.loading ? "Mengirim..." : "Kirim data ↗"}</button>
        </form>
      </div>
    </main>
  );
};

export default PublicLeaderForm;
