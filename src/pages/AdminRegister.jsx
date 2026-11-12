import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const AdminRegister = ({ session }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", confirmation: "" });
  const [state, setState] = useState({ loading: false, error: null, success: null });

  if (session) return <Navigate to="/admin" replace />;

  const submit = async (event) => {
    event.preventDefault();
    if (form.password.length < 12) {
      setState({ loading: false, error: "Password minimal 12 karakter.", success: null });
      return;
    }
    if (form.password !== form.confirmation) {
      setState({ loading: false, error: "Konfirmasi password tidak sama.", success: null });
      return;
    }
    setState({ loading: true, error: null, success: null });
    try {
      if (!isSupabaseConfigured) throw new Error("Supabase belum dikonfigurasi.");
      const { data, error } = await supabase.auth.signUp({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      if (error) throw error;
      setState({
        loading: false,
        error: null,
        success: data.session
          ? "Akun berhasil dibuat. Silakan masuk."
          : "Akun berhasil dibuat. Tunggu admin memverifikasi akunmu dari tab Admin.",
      });
      setForm({ email: "", password: "", confirmation: "" });
    } catch (error) {
      setState({ loading: false, error: error.message, success: null });
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-ink px-6 text-cream">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-cream/15 bg-charcoal p-8 shadow-2xl">
        <p className="eyebrow text-orange">OSSMAPA / Admin</p>
        <h1 className="mt-4 font-outfit text-4xl font-semibold">Daftar admin.</h1>
        <p className="mt-3 font-outfit text-sm leading-6 text-cream/55">Setelah mendaftar, akunmu akan menunggu verifikasi dari admin melalui tab Admin.</p>
        <label className="mt-8 block font-outfit text-xs text-cream/70">Email<input required type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="admin-input" /></label>
        <label className="mt-4 block font-outfit text-xs text-cream/70">Password<input required type="password" autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="admin-input" /></label>
        <label className="mt-4 block font-outfit text-xs text-cream/70">Konfirmasi password<input required type="password" autoComplete="new-password" value={form.confirmation} onChange={(event) => setForm({ ...form, confirmation: event.target.value })} className="admin-input" /></label>
        {state.error && <p className="mt-4 text-sm text-red-400">{state.error}</p>}
        {state.success && <p className="mt-4 text-sm text-green-400">{state.success}</p>}
        <button disabled={state.loading} className="mt-7 w-full rounded-full bg-orange px-5 py-3 font-outfit text-sm font-semibold text-ink disabled:opacity-50">{state.loading ? "Mendaftarkan..." : "Daftar"}</button>
        <button type="button" onClick={() => navigate("/admin/login")} className="mt-5 w-full font-outfit text-xs text-cream/55 hover:text-orange">Kembali ke login</button>
      </form>
    </main>
  );
};

export default AdminRegister;
