import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

const AdminLogin = ({ session }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [status, setStatus] = useState({ loading: false, error: null, success: null });

  if (session) return <Navigate to="/admin" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: null, success: null });
    try {
      if (!isSupabaseConfigured) throw new Error("Supabase belum dikonfigurasi.");
      if (resetMode) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/admin`,
        });
        if (error) throw error;
        setStatus({ loading: false, error: null, success: "Link reset password sudah dikirim ke email." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/admin", { replace: true });
      }
    } catch {
      setStatus({ loading: false, error: "Email atau password tidak valid.", success: null });
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-ink px-6 text-cream">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border border-cream/15 bg-charcoal p-8 shadow-2xl">
        <p className="eyebrow text-orange">OSSMAPA / Admin</p>
        <h1 className="mt-4 font-outfit text-4xl font-semibold">Masuk ke panel.</h1>
        <p className="mt-3 font-outfit text-sm leading-6 text-cream/55">
          Gunakan akun admin yang sudah diaktifkan oleh pengelola Supabase.
        </p>
        <label className="mt-8 block font-outfit text-xs text-cream/70">
          Email
          <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="admin-input" />
        </label>
        {!resetMode && (
          <label className="mt-4 block font-outfit text-xs text-cream/70">
            Password
            <input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="admin-input" />
          </label>
        )}
        {status.error && <p className="mt-4 text-sm text-red-400">{status.error}</p>}
        {status.success && <p className="mt-4 text-sm text-green-400">{status.success}</p>}
        <button disabled={status.loading} className="mt-7 w-full rounded-full bg-orange px-5 py-3 font-outfit text-sm font-semibold text-ink disabled:opacity-50">
          {status.loading ? "Memproses..." : resetMode ? "Kirim link reset" : "Masuk"}
        </button>
        <button type="button" onClick={() => setResetMode((value) => !value)} className="mt-5 w-full font-outfit text-xs text-cream/55 hover:text-orange">
          {resetMode ? "Kembali ke login" : "Lupa password?"}
        </button>
      </form>
    </main>
  );
};

export default AdminLogin;
