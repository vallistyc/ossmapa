import { divisions, programs, articles, pancapilar } from "../sect/home/homeData";

export const fallbackHomeData = {
  programs: programs.map(([title, division, event_date], index) => ({
    id: `fallback-program-${index}`,
    title,
    division,
    event_date,
    description: "Program kolaboratif untuk bertumbuh dan memberi dampak.",
  })),
  leaders: ["Ketua 1", "Ketua Umum", "Ketua 2"].map((role, index) => ({
    id: `fallback-leader-${index}`,
    name: `Nama ${role}`,
    role,
    period: "2026—27",
    image_url: null,
  })),
  articles: articles.map(([category, title, image_url], index) => ({
    id: `fallback-article-${index}`,
    category,
    title,
    slug: `artikel-${index + 1}`,
    excerpt: "Cerita dan kabar terbaru dari OSSMAPA.",
    content_html: `<p>${title}</p>`,
    image_url,
    author_name: "OSSMAPA",
    published_at: "2026-01-01",
  })),
  sponsors: ["ANELA", "FAVORICH", "EMINA", "BUYNANA"].map((name, index) => ({
    id: `fallback-sponsor-${index}`,
    name,
    image_url: null,
  })),
  divisions,
  pancapilar,
};
