import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export const PageView = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadPage();
    }
  }, [slug]);

  const loadPage = async () => {
    setLoading(true);
    try {
      const p = await adminService.getPage(slug!);
      setPage(p);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Page Not Found</h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">The page you are looking for does not exist.</p>
        <button onClick={() => navigate('/')} className="text-primary font-bold underline mt-4">BACK TO HOME</button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-6 py-12 md:py-24"
    >
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> BACK
      </button>
      <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter mb-8 md:mb-12 leading-none">{page.title}</h1>
      <div 
        className="prose prose-slate lg:prose-lg max-w-none font-medium text-slate-600 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </motion.div>
  );
};
