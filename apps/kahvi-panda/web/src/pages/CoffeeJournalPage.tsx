import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ApiClient } from '../services/api';
import { ArrowLeft, Clock, Calendar, Coffee, Sparkles } from 'lucide-react';

export const CoffeeJournalPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        if (slug) {
          const blog = await ApiClient.getBlogBySlug(slug);
          setSelectedBlog(blog);
        } else {
          const list = await ApiClient.getBlogs();
          setBlogs(list);
          setSelectedBlog(null);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (selectedBlog) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-20 space-y-8">
        <Link
          to="/coffee-journal"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#30231C] hover:text-[#4B3428]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Journal</span>
        </Link>

        <div className="space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#BC785C]">
            {selectedBlog.category} • {selectedBlog.readTime}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#30231C] leading-tight">
            {selectedBlog.title}
          </h1>
          <p className="text-sm font-medium text-[#4B3428]/80">
            By {selectedBlog.author} • Published in Kolkata
          </p>
        </div>

        <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-lg border border-[#30231C]/10 bg-[#E9DCC9]/20">
          <img
            src={selectedBlog.coverImage}
            alt={selectedBlog.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="prose max-w-none text-[#4B3428] text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4 pt-4 border-t border-[#30231C]/10">
          {selectedBlog.content}
        </div>

        <div className="p-8 rounded-3xl bg-[#FAF7F2] border border-[#30231C]/10 text-center space-y-3 mt-12">
          <h3 className="font-serif text-xl text-[#30231C]">Ready to Brew This at Home?</h3>
          <p className="text-xs text-[#4B3428]/80 max-w-md mx-auto">
            Explore our fresh single-origins and blends roasted precisely for this extraction style.
          </p>
          <Link
            to="/shop"
            className="inline-block px-6 py-2.5 rounded-full bg-[#30231C] text-[#F8F5EE] text-xs font-bold uppercase tracking-wider hover:bg-[#4B3428]"
          >
            Explore Coffees
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[11px] uppercase tracking-widest font-extrabold text-[#9CA88E]">
          Brewing Education & Culture
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#30231C]">The Coffee Journal</h1>
        <p className="text-sm text-[#4B3428]/80">
          Recipes, grind size calibrations, water chemistry, and stories from our Kolkata roastery.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((b) => (
          <article
            key={b.id}
            className="bg-white rounded-3xl overflow-hidden border border-[#30231C]/10 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between"
          >
            <div className="aspect-[16/10] overflow-hidden bg-[#E9DCC9]/30">
              <img src={b.coverImage} alt={b.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#9CA88E]">
                  {b.category} • {b.readTime}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#30231C] mt-2">
                  <Link to={`/coffee-journal/${b.slug}`} className="hover:underline">
                    {b.title}
                  </Link>
                </h3>
                <p className="text-xs text-[#4B3428]/80 mt-2 line-clamp-2 leading-relaxed">
                  {b.excerpt}
                </p>
              </div>
              <Link
                to={`/coffee-journal/${b.slug}`}
                className="mt-4 text-xs font-bold text-[#30231C] hover:text-[#BC785C] inline-flex items-center gap-1"
              >
                <span>Read Full Article</span>
                <span>→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
