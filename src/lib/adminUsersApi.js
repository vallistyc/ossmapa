import { supabase } from "./supabase";

const assertConfigured = () => {
  if (!supabase) throw new Error("Supabase belum dikonfigurasi.");
};

export const fetchAdminInvitations = async () => {
  assertConfigured();
  const { data, error } = await supabase
    .from("admin_accounts")
    .select("id,email,created_at,approved,approved_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Gagal memuat akun admin: ${error.message}`);
  return data ?? [];
};

export const createAdminInvitation = async (email) => {
  assertConfigured();
  const { error } = await supabase.from("admin_invitations").upsert(
    { email: email.trim().toLowerCase(), invited_by: (await supabase.auth.getUser()).data.user.id },
    { onConflict: "email" },
  );
  if (error) throw new Error(`Gagal membuat undangan: ${error.message}`);
};

export const revokeAdminInvitation = async (id) => {
  assertConfigured();
  const { error } = await supabase.from("admin_accounts").update({ approved: false, approved_at: null, approved_by: null }).eq("id", id);
  if (error) throw new Error(`Gagal membatalkan verifikasi admin: ${error.message}`);
};

export const verifyAdminAccount = async (id) => {
  assertConfigured();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) throw new Error("Sesi admin tidak ditemukan.");
  const { error } = await supabase
    .from("admin_accounts")
    .update({ approved: true, approved_at: new Date().toISOString(), approved_by: userData.user.id })
    .eq("id", id);
  if (error) throw new Error(`Gagal memverifikasi admin: ${error.message}`);
};
