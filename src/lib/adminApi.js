import { supabase } from "./supabase";

export const adminTables = {
  programs: {
    label: "Proker",
    columns: ["title", "sekbid_id", "event_date", "status", "description", "sort_order", "published"],
    fields: [
      { key: "title", label: "Judul", type: "text", required: true },
      { key: "sekbid_id", label: "Sekbid", type: "select", dynamicOptions: "sekbids", required: true },
      { key: "event_date", label: "Waktu pelaksanaan", type: "text", required: true },
      { key: "status", label: "Status pelaksanaan", type: "select", options: ["Belum dimulai", "Sedang berlangsung", "Selesai", "Ditunda", "Dibatalkan"], required: true },
      { key: "description", label: "Deskripsi", type: "textarea", required: true },
      { key: "sort_order", label: "Urutan", type: "number", required: true },
      { key: "published", label: "Tampilkan di website", type: "checkbox" },
    ],
  },
  sekbids: {
    label: "Sekbid",
    columns: ["name", "sort_order", "published"],
    fields: [
      { key: "name", label: "Nama Sekbid", type: "text", required: true },
      { key: "sort_order", label: "Urutan", type: "number", required: true },
      { key: "published", label: "Tampilkan di website", type: "checkbox" },
    ],
  },
  leaders: {
    label: "Pengurus",
    columns: ["name", "nis", "whatsapp", "instagram", "role", "period", "sekbid_id", "image_url", "sort_order", "published"],
    fields: [
      { key: "name", label: "Nama", type: "text", required: true },
      { key: "nis", label: "NIS", type: "text", required: true },
      { key: "whatsapp", label: "Nomor WhatsApp", type: "tel", required: true },
      { key: "instagram", label: "Instagram", type: "text" },
      { key: "period", label: "Periode", type: "text", required: true },
      { key: "sekbid_id", label: "Sekbid", type: "select", dynamicOptions: "sekbids", required: true },
      { key: "role", label: "Jabatan", type: "select", dynamicRoles: true, required: true },
      { key: "image_url", label: "URL foto", type: "url" },
      { key: "sort_order", label: "Urutan", type: "number", required: true },
      { key: "published", label: "Tampilkan di website", type: "checkbox" },
    ],
  },
  blog_posts: {
    label: "Blog",
    columns: ["category", "title", "slug", "excerpt", "content_html", "image_url", "author_name", "published_at", "published"],
    fields: [
      { key: "category", label: "Kategori", type: "text", required: true },
      { key: "title", label: "Judul", type: "text", required: true },
      { key: "slug", label: "Slug URL", type: "text", required: true },
      { key: "excerpt", label: "Ringkasan", type: "textarea", required: true },
      { key: "content_html", label: "Isi artikel", type: "richtext", required: true },
      { key: "image_url", label: "URL cover", type: "url" },
      { key: "author_name", label: "Penulis", type: "text" },
      { key: "published_at", label: "Tanggal terbit", type: "date", required: true },
      { key: "published", label: "Tampilkan di website", type: "checkbox" },
    ],
  },
  sponsors: {
    label: "Sponsor",
    columns: ["name", "image_url", "sort_order", "published"],
    fields: [
      { key: "name", label: "Nama sponsor", type: "text", required: true },
      { key: "image_url", label: "URL gambar / logo", type: "url" },
      { key: "sort_order", label: "Urutan", type: "number", required: true },
      { key: "published", label: "Tampilkan di website", type: "checkbox" },
    ],
  },
  aspirations: {
    label: "Aspirasi",
    columns: ["name", "message", "status"],
    fields: [
      { key: "name", label: "Nama", type: "text" },
      { key: "message", label: "Aspirasi", type: "textarea", required: true },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: ["baru", "dibaca", "ditindaklanjuti", "ditutup"],
        required: true,
      },
    ],
  },
  achievements: {
    label: "Prestasi",
    columns: ["name", "class_name", "title", "level", "event_date", "published"],
    fields: [
      { key: "name", label: "Nama siswa", type: "text", required: true },
      { key: "class_name", label: "Kelas", type: "text", required: true },
      { key: "title", label: "Prestasi", type: "text", required: true },
      { key: "level", label: "Tingkat", type: "text", required: true },
      { key: "event_date", label: "Tanggal / tahun", type: "text", required: true },
      { key: "description", label: "Cerita prestasi", type: "textarea" },
      { key: "published", label: "Tampilkan di website", type: "checkbox" },
    ],
  },
};

const assertConfigured = () => {
  if (!supabase) {
    throw new Error("Supabase belum dikonfigurasi.");
  }
};

export const fetchAdminRows = async (table) => {
  assertConfigured();
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Gagal memuat data: ${error.message}`);
  return data ?? [];
};

export const fetchSekbidOptions = async () => {
  assertConfigured();
  const { data, error } = await supabase
    .from("sekbids")
    .select("id,name")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(`Gagal memuat Sekbid: ${error.message}`);
  return data ?? [];
};

export const saveAdminRow = async (table, id, values) => {
  assertConfigured();
  const query = id
    ? supabase.from(table).update(values).eq("id", id)
    : supabase.from(table).insert(values);
  const { error } = await query;
  if (error) throw new Error(`Gagal menyimpan data: ${error.message}`);
};

export const saveAdminRows = async (table, values) => {
  assertConfigured();
  const { error } = await supabase.from(table).insert(values);
  if (error) throw new Error(`Gagal menyimpan data: ${error.message}`);
};

export const deleteAdminRow = async (table, id) => {
  assertConfigured();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw new Error(`Gagal menghapus data: ${error.message}`);
};

export const rowsToCsv = (rows, columns) => {
  const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  return [
    columns.map((column) => escape(column.label)).join(","),
    ...rows.map((row) => columns.map((column) => escape(row[column.key])).join(",")),
  ].join("\r\n");
};

export const downloadCsv = (filename, rows, columns) => {
  const blob = new Blob(["\ufeff", rowsToCsv(rows, columns)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const uploadSponsorImage = async (file) => {
  return uploadImage(file, "sponsors");
};

export const uploadLeaderImage = async (file) => {
  return uploadImage(file, "leaders");
};

export const uploadPublicLeaderImage = async (file) => {
  return uploadImage(file, "leader-submissions");
};

const uploadImage = async (file, bucket) => {
  assertConfigured();
  if (!file.type.startsWith("image/")) {
    throw new Error("File harus berupa gambar.");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Ukuran gambar maksimal 5 MB.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw new Error(`Gagal mengunggah gambar: ${error.message}`);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};
