import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const ProtectedAdminRoute = ({ session, children }) => {
  if (!session) return <Navigate to="/admin/login" replace />;
  if (session.user.app_metadata?.role !== "admin") {
    return <PendingAdminAccess session={session}>{children}</PendingAdminAccess>;
  }
  return children;
};

const PendingAdminAccess = ({ session, children }) => {
  const [approved, setApproved] = useState(null);

  useEffect(() => {
    let active = true;
    supabase
      ?.from("admin_accounts")
      .select("approved")
      .eq("user_id", session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (active) setApproved(Boolean(data?.approved));
      });
    return () => {
      active = false;
    };
  }, [session.user.id]);

  if (approved === null) {
    return <main className="grid min-h-screen place-items-center bg-ink px-6 text-center text-cream"><p className="font-outfit text-sm text-cream/60">Memeriksa status verifikasi admin...</p></main>;
  }
  if (approved) return children;
  return (
    <main className="grid min-h-screen place-items-center bg-ink px-6 text-cream">
      <div className="w-full max-w-md rounded-2xl border border-orange/30 bg-charcoal p-8 text-center shadow-2xl">
        <p className="eyebrow text-orange">OSSMAPA / Admin</p>
        <h1 className="mt-4 font-outfit text-3xl font-semibold">Menunggu verifikasi.</h1>
        <p className="mt-4 font-outfit text-sm leading-6 text-cream/55">Akun kamu sudah terdaftar, tetapi belum diverifikasi oleh admin lain melalui tab Admin.</p>
        <button type="button" onClick={() => supabase?.auth.signOut()} className="mt-7 rounded-full border border-cream/20 px-5 py-3 font-outfit text-sm hover:border-orange hover:text-orange">Keluar</button>
      </div>
    </main>
  );
};

export default ProtectedAdminRoute;
