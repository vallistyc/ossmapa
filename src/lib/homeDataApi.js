import { supabase, isSupabaseConfigured } from "./supabase";
import { fallbackHomeData } from "./homeData";

const readTable = async (table, columns, orderColumn = "sort_order") => {
  const { data, error } = await supabase
    .from(table)
    .select(columns)
    .eq("published", true)
    .order(orderColumn, { ascending: true });

  if (error) {
    throw new Error(`Gagal memuat ${table}: ${error.message}`);
  }

  return data ?? [];
};

const readPrograms = async () => {
  const withStatus = await supabase
    .from("programs")
    .select("id,title,division,event_date,status,description,sekbids(name)")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (!withStatus.error) return withStatus.data ?? [];
  if (withStatus.error.code !== "42703") throw new Error(`Gagal memuat programs: ${withStatus.error.message}`);

  const legacy = await supabase
    .from("programs")
    .select("id,title,division,event_date,description,sekbids(name)")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (legacy.error) throw new Error(`Gagal memuat programs: ${legacy.error.message}`);
  return (legacy.data ?? []).map((program) => ({ ...program, status: "Belum dimulai" }));
};

export const fetchHomeData = async () => {
  if (!isSupabaseConfigured) {
    return { data: fallbackHomeData, error: null };
  }

  try {
    const [programs, leaders, articles, sponsors] = await Promise.all([
      readPrograms(),
      readTable("leaders", "id,name,role,period,image_url,instagram,class_name,motto"),
      readTable("blog_posts", "id,category,title,slug,excerpt,content_html,image_url,author_name,published_at", "published_at"),
      readTable("sponsors", "id,name,image_url"),
    ]);

    return {
      data: {
        ...fallbackHomeData,
        programs: programs.map((program) => ({
          ...program,
          division: program.sekbids?.name ?? program.division,
        })),
        leaders,
        articles,
        sponsors,
        divisions: [
          "Semua",
          ...new Set(programs.map((program) => program.division)),
        ],
      },
      error: null,
    };

  } catch (error) {
    return { data: fallbackHomeData, error };
  }
};

export const fetchArticleBySlug = async (slug) => {
  if (!isSupabaseConfigured) {
    const article = fallbackHomeData.articles.find((item) => item.slug === slug);
    return { article: article ?? null, error: null };
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select("id,category,title,slug,excerpt,content_html,image_url,author_name,published_at")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return { article: data ?? null, error };
};

export const fetchLeaderById = async (id) => {
  if (!isSupabaseConfigured) {
    const leader = fallbackHomeData.leaders.find((item) => String(item.id) === String(id));
    return { leader: leader ?? null, error: null };
  }

  const { data, error } = await supabase
    .from("leaders")
    .select("id,name,role,period,image_url,instagram,class_name,motto,sekbid_id")
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();
  if (!data) return { leader: null, error };
  const { data: sekbid } = await supabase
    .from("sekbids")
    .select("name")
    .eq("id", data.sekbid_id)
    .maybeSingle();
  return { leader: { ...data, sekbid: sekbid?.name }, error: null };
};

export const submitAspiration = async ({ name, message }) => {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase belum dikonfigurasi.");
  }

  const { error } = await supabase.from("aspirations").insert({
    name: name || null,
    message,
  });

  if (error) {
    throw new Error(`Aspirasi gagal dikirim: ${error.message}`);
  }
};

export const submitAchievement = async (values) => {
  if (!isSupabaseConfigured) throw new Error("Supabase belum dikonfigurasi.");
  const { proof_file: proofFile, ...achievement } = values;
  if (!proofFile) throw new Error("Bukti prestasi wajib diunggah.");
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (!allowedTypes.includes(proofFile.type)) throw new Error("Bukti prestasi harus berupa JPG, PNG, atau PDF.");
  if (proofFile.size > 10 * 1024 * 1024) throw new Error("Ukuran bukti prestasi maksimal 10 MB.");

  const extension = proofFile.name.split(".").pop()?.toLowerCase();
  const filePath = `${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage.from("achievement-submissions").upload(filePath, proofFile, {
    contentType: proofFile.type,
    upsert: false,
  });
  if (uploadError) throw new Error(`Bukti prestasi gagal diunggah: ${uploadError.message}`);

  const { data: proofData } = supabase.storage.from("achievement-submissions").getPublicUrl(filePath);
  const { error } = await supabase.from("achievements").insert({ ...achievement, proof_url: proofData.publicUrl, published: false });
  if (error) throw new Error(`Data prestasi gagal dikirim: ${error.message}`);
};

export const fetchAchievements = async () => {
  if (!isSupabaseConfigured) return { achievements: [], error: null };
  const { data, error } = await supabase
    .from("achievements")
    .select("id,name,nis,whatsapp,class_name,title,type,result,level,event_date,description,proof_url")
    .eq("published", true)
    .order("created_at", { ascending: false });
  return { achievements: data ?? [], error };
};

export const fetchProgramById = async (id) => {
  if (!isSupabaseConfigured) {
    const program = fallbackHomeData.programs.find((item) => String(item.id) === String(id));
    return { program: program ?? null, error: null };
  }

  const result = await supabase
    .from("programs")
    .select("id,title,division,event_date,status,description,sekbid_id,sekbids(name)")
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();
  if (result.error?.code === "42703") {
    const legacy = await supabase
      .from("programs")
      .select("id,title,division,event_date,description,sekbid_id,sekbids(name)")
      .eq("id", id)
      .eq("published", true)
      .maybeSingle();
    if (legacy.error) return { program: null, error: legacy.error };
    return {
      program: legacy.data ? { ...legacy.data, status: "Belum dimulai", division: legacy.data.sekbids?.name ?? legacy.data.division } : null,
      error: null,
    };
  }
  if (result.error) return { program: null, error: result.error };
  return {
    program: result.data ? { ...result.data, division: result.data.sekbids?.name ?? result.data.division } : null,
    error: null,
  };
};
