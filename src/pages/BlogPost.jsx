import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { fetchArticleBySlug } from "../lib/homeDataApi";

const BlogPost = () => {
  const { slug } = useParams();
  const [state, setState] = useState({ loading: true, article: null, error: null });

  useEffect(() => {
    let active = true;
    fetchArticleBySlug(slug).then((result) => {
      if (active) setState({ loading: false, ...result });
    });
    return () => {
      active = false;
    };
  }, [slug]);

  if (state.loading) {
    return <main className="grid min-h-screen place-items-center bg-ink text-cream">Memuat artikel...</main>;
  }

  if (state.error || !state.article) {
    return (
      <main className="grid min-h-screen place-items-center bg-ink px-6 text-center text-cream">
        <div><p className="font-outfit text-lg">Artikel tidak ditemukan.</p><Link to="/blog" className="mt-4 inline-block text-orange">Kembali ke Blog ↗</Link></div>
      </main>
    );
  }

  const { article } = state;
  return (
    <main className="min-h-screen bg-ink px-6 pb-24 pt-12 text-cream sm:px-10 lg:px-20">
      <article className="mx-auto max-w-4xl">
        <Link to="/blog" className="font-outfit text-sm text-orange hover:underline">← Kembali ke Blog</Link>
        <p className="eyebrow mt-16 text-orange">{article.category}</p>
        <h1 className="mt-4 font-outfit text-5xl font-semibold leading-tight tracking-tight sm:text-7xl">{article.title}</h1>
        <p className="mt-6 max-w-2xl font-outfit text-lg leading-8 text-cream/60">{article.excerpt}</p>
        <div className="mt-8 flex gap-4 font-outfit text-xs text-cream/45">
          <span>{article.author_name || "OSSMAPA"}</span>
          <span>·</span>
          <time dateTime={article.published_at}>{article.published_at}</time>
        </div>
        {article.image_url && <img src={article.image_url} alt="" className="mt-12 max-h-[34rem] w-full rounded-2xl object-cover" />}
        <div className="prose-blog mt-12" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content_html || "") }} />
      </article>
    </main>
  );
};

export default BlogPost;
