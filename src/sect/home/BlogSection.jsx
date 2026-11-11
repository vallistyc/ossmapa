import { Link } from "react-router-dom";

const BlogSection = ({ articles }) => (
  <section id="blog" className="px-6 py-28 sm:px-10 lg:px-20">
    <div className="mx-auto max-w-7xl">
      <div>
        <p className="eyebrow text-orange">04 / Blog OSIS</p>
        <h2 className="section-title mt-3">
          Cerita terbaru
          <br />
          <span className="font-jersey-10 text-orange">dari kami.</span>
        </h2>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {articles.map((article) => (
          <article key={article.id} className="group">
            <div className="aspect-[1.35] overflow-hidden rounded-xl bg-charcoal">
              <img
                src={article.image_url}
                alt=""
                className="h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
              />
            </div>
            <div className="mt-5 font-outfit text-[10px] uppercase tracking-widest text-orange">
              {article.category}
            </div>
            <Link to={`/blog/${article.slug || article.id}`} className="mt-3 block font-outfit text-xl leading-snug transition group-hover:text-orange">
              {article.title}
            </Link>
            {article.excerpt && <p className="mt-2 line-clamp-2 font-outfit text-sm leading-6 text-cream/50">{article.excerpt}</p>}
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default BlogSection;
