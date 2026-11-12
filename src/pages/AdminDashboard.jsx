import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  adminTables,
  deleteAdminRow,
  fetchAdminRows,
  fetchSekbidOptions,
  saveAdminRow,
  saveAdminRows,
  downloadCsv,
  uploadLeaderImage,
  uploadBlogImage,
  uploadSponsorImage,
} from "../lib/adminApi";
import RichTextEditor from "../components/RichTextEditor";
import AdminDashboardOverview from "./AdminDashboardOverview";
import AdminTutorial from "./AdminTutorial";
import {
  fetchAdminInvitations,
  revokeAdminInvitation,
  verifyAdminAccount,
} from "../lib/adminUsersApi";

const emptyValues = (config) =>
  Object.fromEntries(config.fields.map((field) => [field.key, field.type === "checkbox" ? true : ""]));

const createLeaderRow = (index) => ({
  name: "",
  nis: "",
  whatsapp: "",
  instagram: "",
  period: "2026—27",
  sekbid_id: "",
  role: "",
  image_url: "",
  sort_order: index,
  published: true,
});

const bphRoles = ["Ketua Umum", "Ketua 1", "Ketua 2", "Sekretaris 1", "Sekretaris 2", "Bendahara 1", "Bendahara 2"];
const divisionRoles = ["Co", "Anggota"];
const slugify = (value) => value
  .toLowerCase()
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");
const exportColumns = {
  leaders: [
    { key: "name", label: "Nama" }, { key: "nis", label: "NIS" }, { key: "whatsapp", label: "WhatsApp" },
    { key: "instagram", label: "Instagram" }, { key: "role", label: "Jabatan" }, { key: "period", label: "Periode" },
  ],
  programs: [
    { key: "title", label: "Judul" }, { key: "event_date", label: "Waktu pelaksanaan" }, { key: "description", label: "Deskripsi" },
    { key: "published", label: "Diverifikasi" },
  ],
  aspirations: [
    { key: "name", label: "Nama" }, { key: "message", label: "Aspirasi" }, { key: "status", label: "Status" },
  ],
};

const BulkLeadersModal = ({ onClose, onSaved, setStatus, sekbids, existingLeaders }) => {
  const [rows, setRows] = useState([createLeaderRow(1)]);
  const [saving, setSaving] = useState(false);

  const updateRow = (index, key, value) => {
    setRows((current) => current.map((row, rowIndex) => (
      rowIndex === index ? { ...row, [key]: value } : row
    )));
  };

  const uploadRowImage = async (index, file) => {
    try {
      const imageUrl = await uploadLeaderImage(file);
      updateRow(index, "image_url", imageUrl);
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: null });
    }
  };

  const save = async (event) => {
    event.preventDefault();
    const incomplete = rows.some((row) => !row.name.trim() || !row.nis.trim() || !row.whatsapp.trim() || !row.role.trim() || !row.period.trim() || !row.sekbid_id);
    const nisValues = rows.map((row) => row.nis.trim());
    const duplicateNis = new Set(nisValues).size !== nisValues.length || existingLeaders.some((leader) => nisValues.includes(leader.nis));
    const invalidWhatsapp = rows.some((row) => !/^[+\d][\d\s-]{7,}$/.test(row.whatsapp));
    if (incomplete) {
      setStatus({ loading: false, error: "Lengkapi nama, jabatan, dan periode setiap pengurus.", success: null });
      return;
    }
    if (duplicateNis) {
      setStatus({ loading: false, error: "NIS tidak boleh duplikat.", success: null });
      return;
    }
    if (invalidWhatsapp) {
      setStatus({ loading: false, error: "Nomor WhatsApp tidak valid.", success: null });
      return;
    }
    setSaving(true);
    try {
      await saveAdminRows("leaders", rows.map((row) => ({ ...row, sort_order: Number(row.sort_order) })));
      onClose();
      await onSaved();
      setStatus({ loading: false, error: null, success: `${rows.length} pengurus berhasil ditambahkan.` });
    } catch (error) {
      setSaving(false);
      setStatus({ loading: false, error: error.message, success: null });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/80 p-4 backdrop-blur-md" role="dialog" aria-modal="true">
      <form onSubmit={save} className="mx-auto my-6 max-w-6xl rounded-2xl border border-cream/15 bg-charcoal p-5 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="eyebrow text-orange">Pendataan cepat</p>
            <h2 className="mt-2 font-outfit text-2xl font-semibold">Tambah banyak pengurus</h2>
            <p className="mt-2 font-outfit text-sm text-cream/50">Isi beberapa baris sekaligus. Foto diunggah langsung dari perangkat.</p>
          </div>
          <button type="button" onClick={onClose} className="text-2xl text-cream/50 hover:text-orange" aria-label="Tutup pendataan cepat">×</button>
        </div>
        <div className="mt-6 overflow-x-auto rounded-xl border border-cream/15">
          <table className="w-full min-w-[900px] text-left font-outfit text-sm">
            <thead className="bg-ink text-xs uppercase tracking-wider text-cream/45">
              <tr><th className="px-3 py-3">Nama</th><th className="px-3 py-3">NIS</th><th className="px-3 py-3">WhatsApp</th><th className="px-3 py-3">Instagram</th><th className="px-3 py-3">Sekbid</th><th className="px-3 py-3">Jabatan</th><th className="px-3 py-3">Periode</th><th className="px-3 py-3">Upload foto</th><th className="px-3 py-3">Urutan</th><th className="px-3 py-3" /></tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index} className="border-t border-cream/10 align-top">
                  {["name", "nis", "whatsapp", "instagram"].map((key) => (
                    <td key={key} className="p-2"><input required value={row[key]} onChange={(event) => updateRow(index, key, event.target.value)} className="admin-input mt-0" /></td>
                  ))}
                  <td className="p-2"><select required value={row.sekbid_id} onChange={(event) => { updateRow(index, "sekbid_id", event.target.value); updateRow(index, "role", ""); }} className="admin-input mt-0"><option value="">Pilih</option>{sekbids.map((sekbid) => <option key={sekbid.id} value={sekbid.id}>{sekbid.name}</option>)}</select></td>
                  <td className="p-2"><select required value={row.role} onChange={(event) => updateRow(index, "role", event.target.value)} className="admin-input mt-0"><option value="">Pilih</option>{(sekbids.find((sekbid) => String(sekbid.id) === String(row.sekbid_id))?.name.toLowerCase() === "bph" ? bphRoles : divisionRoles).map((role) => <option key={role}>{role}</option>)}</select></td>
                  <td className="p-2">
                  <label className="mt-2 inline-flex cursor-pointer items-center rounded-full border border-orange/60 px-3 py-1.5 font-outfit text-xs text-orange hover:bg-orange hover:text-ink">
                      Upload foto
                      <input type="file" accept="image/*" className="sr-only" onChange={(event) => uploadRowImage(index, event.target.files[0])} />
                    </label>
                  </td>
                  <td className="p-2"><input type="number" value={row.sort_order} onChange={(event) => updateRow(index, "sort_order", event.target.value)} className="admin-input mt-0 w-20" /></td>
                  <td className="p-2"><button type="button" onClick={() => setRows((current) => current.filter((_, rowIndex) => rowIndex !== index))} className="text-red-400 hover:underline" disabled={rows.length === 1}>Hapus</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 flex flex-wrap justify-between gap-3">
          <button type="button" onClick={() => setRows((current) => [...current, createLeaderRow(current.length + 1)])} className="rounded-full border border-cream/20 px-5 py-3 font-outfit text-sm hover:border-orange hover:text-orange">+ Tambah baris</button>
          <button disabled={saving} className="rounded-full bg-orange px-6 py-3 font-outfit text-sm font-semibold text-ink disabled:opacity-50">{saving ? "Menyimpan..." : `Simpan ${rows.length} pengurus`}</button>
        </div>
      </form>
    </div>
  );
};

const DeleteConfirmationModal = ({ row, label, onClose, onConfirm, loading }) => (
  <div className="fixed inset-0 z-[60] grid place-items-center bg-ink/80 p-5 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="delete-title">
    <div className="w-full max-w-md rounded-2xl border border-red-400/30 bg-charcoal p-6 shadow-2xl sm:p-8">
      <p className="eyebrow text-red-400">Konfirmasi penghapusan</p>
      <h2 id="delete-title" className="mt-3 font-outfit text-2xl font-semibold">Hapus {label}?</h2>
      <p className="mt-4 font-outfit text-sm leading-6 text-cream/60">
        Data <strong className="text-cream">{row.title || row.name || row.message}</strong> akan dihapus permanen dan tidak dapat dipulihkan.
      </p>
      <div className="mt-7 flex justify-end gap-3">
        <button type="button" onClick={onClose} disabled={loading} className="rounded-full border border-cream/20 px-5 py-3 font-outfit text-sm text-cream/70 hover:border-cream/50 hover:text-cream">Batal</button>
        <button type="button" onClick={onConfirm} disabled={loading} className="rounded-full bg-red-500 px-5 py-3 font-outfit text-sm font-semibold text-white disabled:opacity-50">{loading ? "Menghapus..." : "Ya, hapus"}</button>
      </div>
    </div>
  </div>
);

const AdminUsersPanel = ({ setStatus }) => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadInvitations = useCallback(async () => {
    setLoading(true);
    try {
      setInvitations(await fetchAdminInvitations());
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: null });
    } finally {
      setLoading(false);
    }
  }, [setStatus]);

  useEffect(() => {
    let active = true;
    fetchAdminInvitations()
      .then((data) => {
        if (active) setInvitations(data);
      })
      .catch((error) => {
        if (active) setStatus({ loading: false, error: error.message, success: null });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [setStatus]);

  const revoke = async (id) => {
    try {
      await revokeAdminInvitation(id);
      await loadInvitations();
      setStatus({ loading: false, error: null, success: "Verifikasi admin dibatalkan." });
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: null });
    }
  };

  const verify = async (id) => {
    try {
      await verifyAdminAccount(id);
      await loadInvitations();
      setStatus({ loading: false, error: null, success: "Admin berhasil diverifikasi." });
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: null });
    }
  };

  return (
    <section className="mt-8 max-w-3xl rounded-xl border border-cream/15 bg-charcoal p-6">
      <p className="eyebrow text-orange">Akses</p>
      <h2 className="mt-2 font-outfit text-2xl font-semibold">Verifikasi Admin</h2>
      <p className="mt-2 font-outfit text-sm leading-6 text-cream/50">Semua akun yang baru mendaftar otomatis muncul di sini. Periksa emailnya, lalu klik Verifikasi agar akun dapat masuk ke panel admin.</p>
      <div className="mt-8 overflow-x-auto rounded-lg border border-cream/10">
        {loading ? <p className="p-4 font-outfit text-sm text-cream/50">Memuat akun admin...</p> : (
          <table className="w-full min-w-[520px] text-left font-outfit text-sm">
            <thead className="bg-ink text-xs uppercase tracking-wider text-cream/45"><tr><th className="px-4 py-3">Email</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Aksi</th></tr></thead>
            <tbody>{invitations.length === 0 ? <tr><td colSpan="3" className="px-4 py-6 text-center text-cream/45">Belum ada akun admin yang mendaftar.</td></tr> : invitations.map((invitation) => <tr key={invitation.id} className="border-t border-cream/10"><td className="px-4 py-3">{invitation.email}</td><td className="px-4 py-3 text-xs text-cream/55">{invitation.approved ? "Terverifikasi" : "Menunggu verifikasi"}</td><td className="px-4 py-3 text-right">{invitation.approved ? <button onClick={() => revoke(invitation.id)} className="text-red-400 hover:underline">Batalkan</button> : <button onClick={() => verify(invitation.id)} className="font-semibold text-orange hover:underline">Verifikasi</button>}</td></tr>)}</tbody>
          </table>
        )}
      </div>
    </section>
  );
};

const AdminForm = ({ table, config, formState, onChange, onClose, onSubmit, status, setStatus, options, modal = false }) => (
  <form
    onSubmit={onSubmit}
    className={modal ? "max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-y-auto rounded-2xl border border-cream/15 bg-charcoal p-4 shadow-2xl sm:max-h-[calc(100vh-3rem)] sm:p-8" : "h-fit rounded-xl border border-cream/15 bg-charcoal p-4 sm:p-6"}
  >
    <div className="flex items-center justify-between">
      <h2 className="font-outfit text-xl font-semibold">{formState.id ? "Edit" : "Tambah"} {config.label}</h2>
      <button type="button" onClick={onClose} className="text-2xl text-cream/50 hover:text-orange" aria-label="Tutup form">×</button>
    </div>
    {config.fields.map((field) => (
      field.type === "hidden" ? null : (
      <label key={field.key} className="mt-5 block font-outfit text-xs text-cream/65">
        {field.label}
        {field.type === "checkbox" ? (
          table === "blog_posts" && field.key === "published" ? (
            <div className="mt-2 flex gap-2">
              <button type="button" onClick={() => onChange(field.key, false)} className={`rounded-lg border px-4 py-2 font-outfit text-xs font-semibold transition ${!formState.values[field.key] ? "border-orange bg-orange/15 text-orange" : "border-cream/20 text-cream/50 hover:border-orange/60 hover:text-orange"}`}>
                Draft
              </button>
              <button type="button" onClick={() => onChange(field.key, true)} className={`rounded-lg border px-4 py-2 font-outfit text-xs font-semibold transition ${formState.values[field.key] ? "border-green-400 bg-green-400/15 text-green-300" : "border-cream/20 text-cream/50 hover:border-green-400/60 hover:text-green-300"}`}>
                Publikasi
              </button>
            </div>
          ) : (
            <span className="mt-2 flex items-center gap-2"><input type="checkbox" checked={Boolean(formState.values[field.key])} onChange={(event) => onChange(field.key, event.target.checked)} /> Tampilkan</span>
          )
        ) : field.type === "textarea" ? (
          <textarea required={field.required} value={formState.values[field.key]} onChange={(event) => onChange(field.key, event.target.value)} className="admin-input min-h-24 resize-y" />
        ) : field.type === "richtext" ? (
          <RichTextEditor value={formState.values[field.key]} onChange={(value) => onChange(field.key, value)} />
        ) : field.type === "select" ? (
          <select required={field.required} value={formState.values[field.key]} onChange={(event) => onChange(field.key, event.target.value)} className="admin-input">
            {!field.required && <option value="">Pilih...</option>}
            {(field.dynamicRoles
              ? (options.selectedSekbid?.name?.toLowerCase() === "bph" ? bphRoles : divisionRoles)
              : (field.dynamicOptions ? options[field.dynamicOptions] : field.options)
            ).map((option) => (
              typeof option === "object"
                ? <option key={option.id} value={option.id}>{option.name}</option>
                : <option key={option}>{option}</option>
            ))}
          </select>
        ) : field.type === "image" ? (
          <>
            <input type="file" accept="image/*" className="admin-input file:mr-3 file:rounded-full file:border-0 file:bg-orange file:px-3 file:py-1 file:font-outfit file:text-xs file:font-semibold file:text-ink" onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              try {
                const imageUrl = table === "sponsors"
                  ? await uploadSponsorImage(file)
                  : table === "blog_posts"
                    ? await uploadBlogImage(file)
                    : await uploadLeaderImage(file);
                onChange("image_url", imageUrl);
              } catch (error) {
                setStatus({ loading: false, error: error.message, success: null });
              }
            }} />
            {formState.values[field.key] && <span className="mt-2 block truncate text-xs text-cream/40">File tersimpan</span>}
          </>
        ) : (
          <input required={field.required} type={field.type} value={formState.values[field.key]} onChange={(event) => onChange(field.key, event.target.value)} className="admin-input" />
        )}
      </label>
      )
    ))}
    <button disabled={status.loading} className="mt-7 w-full rounded-full bg-orange px-5 py-3 font-outfit text-sm font-semibold text-ink disabled:opacity-50">Simpan</button>
  </form>
);

const AdminDashboard = ({ session }) => {
  const navigate = useNavigate();
  const [table, setTable] = useState("dashboard");
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [creatingForm, setCreatingForm] = useState({ id: null, values: emptyValues(adminTables.programs) });
  const [bulkLeadersOpen, setBulkLeadersOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [sekbidOptions, setSekbidOptions] = useState([]);
  const [query, setQuery] = useState("");
  const [publishingId, setPublishingId] = useState(null);
  const [connection, setConnection] = useState("connected");
  const [notifications, setNotifications] = useState({ leaders: 0, programs: 0, aspirations: 0 });
  const [status, setStatus] = useState({ loading: true, error: null, success: null });
  const config = adminTables[table];
  const formOptions = { sekbids: sekbidOptions };

  useEffect(() => {
    fetchSekbidOptions()
      .then(setSekbidOptions)
      .catch((error) => setStatus((current) => ({ ...current, error: error.message })));
  }, []);

  useEffect(() => {
    Promise.all(["leaders", "programs", "aspirations"].map(fetchAdminRows))
      .then(([leaders, programs, aspirations]) => setNotifications({
        leaders: leaders.filter((row) => !row.published).length,
        programs: programs.filter((row) => !row.published).length,
        aspirations: aspirations.filter((row) => row.status === "baru").length,
      }))
      .catch(() => setConnection("error"));
  }, []);

  const loadRows = useCallback(async () => {
    if (["dashboard", "admin_users", "tutorial"].includes(table)) return;
    setStatus({ loading: true, error: null, success: null });
    setConnection("checking");
    try {
      setRows(await fetchAdminRows(table));
      setStatus({ loading: false, error: null, success: null });
      setConnection("connected");
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: null });
      setConnection("error");
    }
  }, [table]);

  useEffect(() => {
    if (["dashboard", "admin_users", "tutorial"].includes(table)) return undefined;
    let active = true;
    fetchAdminRows(table)
      .then((data) => {
        if (active) {
          setRows(data);
          setStatus({ loading: false, error: null, success: null });
          setConnection("connected");
        }
      })
      .catch((error) => {
        if (active) {
          setStatus({ loading: false, error: error.message, success: null });
          setConnection("error");
        }
      });
    return () => {
      active = false;
    };
  }, [table]);

  useEffect(() => {
    if (!creating) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setCreating(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [creating]);

  const filteredRows = useMemo(() => {
    const normalized = query.toLowerCase();
    return rows.filter((row) => Object.values(row).some((value) => String(value ?? "").toLowerCase().includes(normalized)));
  }, [rows, query]);

  const handleSave = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: null, success: null });
    const form = creating ? creatingForm : editing;
    const values = table === "blog_posts"
      ? { ...form.values, slug: slugify(form.values.title) }
      : form.values;
    if (table === "leaders" && rows.some((row) => row.nis && row.nis === values.nis && row.id !== form.id)) {
      setStatus({ loading: false, error: "NIS tersebut sudah digunakan oleh pengurus lain.", success: null });
      return;
    }
    if (table === "leaders" && values.whatsapp && !/^[+\d][\d\s-]{7,}$/.test(values.whatsapp)) {
      setStatus({ loading: false, error: "Nomor WhatsApp tidak valid.", success: null });
      return;
    }
    if (table === "blog_posts" && rows.some((row) => row.slug && row.slug === values.slug && row.id !== form.id)) {
      setStatus({ loading: false, error: "Slug Blog tersebut sudah digunakan.", success: null });
      return;
    }
    try {
      const savedValues = Object.fromEntries(
        config.fields.map((field) => [
          field.key,
          field.type === "number" ? Number(values[field.key]) : values[field.key],
        ]),
      );
      if (table === "blog_posts" && values.published) {
        savedValues.published_at = form.values.published_at || new Date().toISOString().slice(0, 10);
      }
      await saveAdminRow(table, form.id, savedValues);
      setEditing(null);
      if (creating) {
        setCreating(false);
        setCreatingForm({ id: null, values: emptyValues(config) });
      }
      if (table === "blog_posts") localStorage.removeItem("ossmapa-blog-draft");
      await loadRows();
      setStatus({ loading: false, error: null, success: "Data berhasil disimpan." });
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: null });
    }
  };

  const handleDelete = async (row) => {
    setStatus({ loading: true, error: null, success: null });
    try {
      await deleteAdminRow(table, row.id);
      setDeleting(null);
      await loadRows();
      setStatus({ loading: false, error: null, success: "Data berhasil dihapus." });
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: null });
    }
  };

  const togglePublished = async (row) => {
    const nextPublished = !row.published;
    setPublishingId(row.id);
    setRows((current) => current.map((item) => item.id === row.id ? { ...item, published: nextPublished } : item));
    try {
      await saveAdminRow(table, row.id, {
        published: nextPublished,
        ...(table === "blog_posts" && nextPublished ? { published_at: new Date().toISOString().slice(0, 10) } : {}),
      });
      setStatus({ loading: false, error: null, success: null });
    } catch (error) {
      setRows((current) => current.map((item) => item.id === row.id ? { ...item, published: row.published } : item));
      setStatus({ loading: false, error: error.message, success: null });
    } finally {
      setPublishingId(null);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  const selectTable = (nextTable) => {
    setTable(nextTable);
    setEditing(null);
    setCreating(false);
    setQuery("");
    setStatus({ loading: true, error: null, success: null });
  };

  const copyFormLink = async (path) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${path}`);
      setStatus({ loading: false, error: null, success: "Link form berhasil disalin." });
    } catch {
      setStatus({ loading: false, error: "Link tidak dapat disalin otomatis. Silakan salin URL dari alamat browser.", success: null });
    }
  };

  const updateForm = (setter, key, value) => {
    setter((current) => {
      const values = {
        ...current.values,
        [key]: value,
        ...(key === "sekbid_id" ? { role: "" } : {}),
        ...(table === "blog_posts" && key === "title" ? { slug: slugify(value) } : {}),
      };
      if (table === "blog_posts") localStorage.setItem("ossmapa-blog-draft", JSON.stringify(values));
      return { ...current, values };
    });
  };

  return (
    <main className="min-h-screen bg-ink px-3 py-5 text-cream sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-5 border-b border-cream/15 pb-6 sm:flex-row sm:items-end sm:pb-8">
          <div>
            <p className="eyebrow text-orange">OSSMAPA / Admin</p>
            <h1 className="mt-3 font-outfit text-3xl font-semibold sm:text-4xl">Kelola website.</h1>
            <p className="mt-2 font-outfit text-sm text-cream/50">{session.user.email}</p>
          </div>
          <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
            <span className={`flex items-center gap-2 font-outfit text-[11px] sm:text-xs ${connection === "error" ? "text-red-300" : connection === "checking" ? "text-orange" : "text-green-300"}`}>
              <span className="h-2 w-2 rounded-full bg-current" />
              {connection === "error" ? "Koneksi bermasalah" : connection === "checking" ? "Memeriksa koneksi..." : "Terhubung"}
            </span>
            <button onClick={() => selectTable("tutorial")} className="rounded-full bg-orange px-4 py-2 font-outfit text-sm font-semibold text-ink hover:bg-orange/90" title="Mulai tutorial Admin">
              Mulai tutorial
            </button>
            <button onClick={signOut} className="rounded-full border border-cream/20 px-5 py-2 font-outfit text-sm hover:border-orange hover:text-orange">Keluar</button>
          </div>
        </header>
        <nav className="hide-scrollbar -mx-3 mt-6 flex gap-2 overflow-x-auto px-3 pb-1 sm:-mx-6 sm:mt-8 sm:px-6 lg:-mx-10 lg:px-10">
          <button onClick={() => selectTable("dashboard")} className={`shrink-0 rounded-full border px-4 py-2 font-outfit text-sm ${table === "dashboard" ? "border-orange bg-orange text-ink" : "border-cream/20 text-cream/60 hover:border-orange"}`}>Dashboard</button>
          <button onClick={() => selectTable("admin_users")} className={`shrink-0 rounded-full border px-4 py-2 font-outfit text-sm ${table === "admin_users" ? "border-orange bg-orange text-ink" : "border-cream/20 text-cream/60 hover:border-orange"}`}>Admin</button>
          {Object.entries(adminTables).map(([key, item]) => (
            <button key={key} onClick={() => selectTable(key)} className={`shrink-0 rounded-full border px-4 py-2 font-outfit text-sm ${table === key ? "border-orange bg-orange text-ink" : "border-cream/20 text-cream/60 hover:border-orange"}`}>
              {item.label}{key === "leaders" && notifications.leaders > 0 ? ` (${notifications.leaders})` : ""}{key === "programs" && notifications.programs > 0 ? ` (${notifications.programs})` : ""}{key === "aspirations" && notifications.aspirations > 0 ? ` (${notifications.aspirations})` : ""}
            </button>
          ))}
        </nav>
        {table === "dashboard" ? (
          <section className="mt-8">
            <AdminDashboardOverview onOpenTable={selectTable} />
          </section>
        ) : table === "admin_users" ? (
          <AdminUsersPanel setStatus={setStatus} />
        ) : table === "tutorial" ? (
          <AdminTutorial />
        ) : (
          <section className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Cari ${config.label.toLowerCase()}...`} className="admin-input mt-0 w-full max-w-none sm:max-w-sm" />
              <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                {table === "leaders" && <><button onClick={() => copyFormLink("/pendataan/pengurus")} className="rounded-full border border-orange px-5 py-3 font-outfit text-sm font-semibold text-orange hover:bg-orange hover:text-ink">Salin link form</button><button onClick={() => setBulkLeadersOpen(true)} className="rounded-full border border-orange px-5 py-3 font-outfit text-sm font-semibold text-orange hover:bg-orange hover:text-ink">Pendataan cepat</button></>}
                {table === "programs" && <button onClick={() => copyFormLink("/pendataan/proker")} className="rounded-full border border-orange px-5 py-3 font-outfit text-sm font-semibold text-orange hover:bg-orange hover:text-ink">Salin link form</button>}
                {exportColumns[table] && <button onClick={() => downloadCsv(`${table}.csv`, filteredRows, exportColumns[table])} className="rounded-full border border-cream/20 px-5 py-3 font-outfit text-sm hover:border-orange hover:text-orange">Export CSV</button>}
                <button onClick={() => {
                  setEditing(null);
                  const savedDraft = table === "blog_posts" ? JSON.parse(localStorage.getItem("ossmapa-blog-draft") || "null") : null;
                  setCreatingForm({ id: null, values: savedDraft || emptyValues(config) });
                  setCreating(true);
                }} className="flex-1 rounded-full bg-orange px-4 py-3 font-outfit text-sm font-semibold text-ink sm:flex-none">+ Tambah {config.label}</button>
              </div>
            </div>
            {status.error && <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-red-950/50 p-4 text-sm text-red-300"><span>{status.error}</span><button onClick={loadRows} className="rounded-full border border-red-300/40 px-4 py-2 font-semibold hover:bg-red-300/10">Coba lagi</button></div>}
            {status.success && <p className="mt-5 rounded-lg bg-green-950/50 p-4 text-sm text-green-300">{status.success}</p>}
            {table === "blog_posts" && <p className="mt-5 rounded-lg border border-orange/25 bg-orange/10 p-4 font-outfit text-sm leading-6 text-cream/65">Artikel baru tersimpan sebagai <strong className="text-orange">Draft</strong>. Klik <strong className="text-orange">Publikasikan</strong> setelah artikel siap ditampilkan di website. Tanggal terbit akan diisi otomatis saat dipublikasikan.</p>}
            <div className="mt-5 overflow-x-auto rounded-xl border border-cream/15">
              {status.loading ? <p className="p-5 font-outfit text-sm text-cream/50 sm:p-6">Memuat data...</p> : (
                <table className="w-full min-w-[560px] text-left font-outfit text-xs sm:text-sm">
                  <thead className="bg-charcoal text-xs uppercase tracking-wider text-cream/45"><tr><th className="px-4 py-3">Data</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Aksi</th></tr></thead>
                  <tbody>{filteredRows.map((row) => (
                    <tr key={row.id} className="border-t border-cream/10">
                      <td className="max-w-md px-4 py-4"><p className="font-medium">{row.title || row.name || row.category || row.message}</p><p className="mt-1 truncate text-xs text-cream/45">{row.role || row.division || row.event_date || row.email || ""}</p></td>
                      <td className="px-4 py-4 text-xs text-cream/55">
                        {table === "blog_posts" ? (
                          <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold ${row.published ? "border-green-400/40 text-green-300" : "border-orange/50 text-orange"}`}>
                            {row.published ? "Sudah dipublikasi" : "Draft"}
                          </span>
                        ) : table === "leaders" || table === "programs" || table === "achievements" ? (
                          <span className="group relative inline-flex">
                            <button onClick={() => togglePublished(row)} disabled={publishingId === row.id} className={`rounded-full px-3 py-1 text-[10px] font-semibold disabled:cursor-wait disabled:opacity-70 ${row.published ? "border border-green-400/40 text-green-300 hover:bg-green-400/10" : "border border-orange/50 text-orange hover:bg-orange/10"}`}>
                              {row.published ? "Diverifikasi" : "Belum Diverifikasi"}
                            </button>
                            <span role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max -translate-x-1/2 rounded-lg bg-cream px-3 py-2 text-center font-outfit text-[11px] font-medium text-ink opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                              {row.published ? "Klik lagi untuk membatalkan verifikasi" : "Klik untuk memverifikasi"}
                            </span>
                          </span>
                        ) : row.status || (row.published ? "Tampil" : "Disembunyikan")}
                      </td>
                      <td className="px-4 py-4 text-right">
                        {table === "blog_posts" && (
                          <button
                            onClick={() => togglePublished(row)}
                            disabled={publishingId === row.id}
                            className={`mr-3 rounded-full px-3 py-1.5 text-[10px] font-semibold transition disabled:cursor-wait disabled:opacity-50 ${row.published ? "border border-cream/20 text-cream/60 hover:border-red-300 hover:text-red-300" : "bg-orange text-ink hover:bg-orange/90"}`}
                            title={row.published ? "Sembunyikan artikel dari website" : "Terbitkan artikel ke website"}
                          >
                            {publishingId === row.id ? "Memproses..." : row.published ? "Tarik publikasi" : "Publikasikan"}
                          </button>
                        )}
                        <button onClick={() => setEditing({ id: row.id, values: Object.fromEntries(config.fields.map((field) => [field.key, row[field.key] ?? (field.type === "checkbox" ? false : "")])) })} className="mr-3 text-orange hover:underline">Edit</button><button onClick={() => setDeleting(row)} className="text-red-400 hover:underline">Hapus</button>
                      </td>
                    </tr>
                  ))}</tbody>
                </table>
              )}
            </div>
          </div>
          {editing && (
            <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/80 p-5 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="edit-title">
              <AdminForm table={table} config={config} formState={editing} onChange={(key, value) => updateForm(setEditing, key, value)} onClose={() => setEditing(null)} onSubmit={handleSave} status={status} setStatus={setStatus} options={{ ...formOptions, selectedSekbid: sekbidOptions.find((sekbid) => String(sekbid.id) === String(editing.values.sekbid_id)) }} modal />
            </div>
          )}
          </section>
        )}
      </div>
      {creating && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/80 p-5 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="create-title">
          <div className="sr-only" id="create-title">Tambah {config.label}</div>
          <AdminForm
            table={table}
            config={config}
            formState={creatingForm}
            onChange={(key, value) => updateForm(setCreatingForm, key, value)}
            onClose={() => setCreating(false)}
            onSubmit={handleSave}
            status={status}
            setStatus={setStatus}
            options={{ ...formOptions, selectedSekbid: sekbidOptions.find((sekbid) => String(sekbid.id) === String(creatingForm.values.sekbid_id)) }}
            modal
          />
        </div>
      )}
      {bulkLeadersOpen && <BulkLeadersModal onClose={() => setBulkLeadersOpen(false)} onSaved={loadRows} setStatus={setStatus} sekbids={sekbidOptions} existingLeaders={rows} />}
      {deleting && <DeleteConfirmationModal row={deleting} label={config.label} onClose={() => setDeleting(null)} onConfirm={() => handleDelete(deleting)} loading={status.loading} />}
    </main>
  );
};

export default AdminDashboard;
