import { supabase } from "./supabase";

const assertConfigured = () => {
  if (!supabase) throw new Error("Supabase belum dikonfigurasi.");
};

export const fetchAdminInvitations = async () => {
  assertConfigured();
  const { data, error } = await supabase
    .from("admin_invitations")
    .select("id,email,created_at,accepted_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Gagal memuat undangan: ${error.message}`);
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
  const { error } = await supabase.from("admin_invitations").delete().eq("id", id);
  if (error) throw new Error(`Gagal mencabut undangan: ${error.message}`);
};
