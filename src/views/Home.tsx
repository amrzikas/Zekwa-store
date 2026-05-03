import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, Shield, Truck, Clock, ChevronLeft, ChevronRight, TrendingUp, Star, PhoneCall, Headphones, Gift } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { formatCurrency } from '../lib/utils';
import { useStore } from '../store/useStore';
import { adminService } from '../services/adminService';

export const Home = () => {
  const { currency, setSelectedCategory } = useStore();
  const [activeSlide, setActiveSlide] = useState(0);
  const [siteContent, setSiteContent] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [content, prods, cats] = await Promise.all([
          adminService.getSiteContent(),
          adminService.getProducts(),
          adminService.getCategories()
        ]);
        setSiteContent(content);
        setProducts(prods || []);
        setCategories(cats || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    loadData();
  }, []);
  
  const defaultBanners = [
    {
      title: "Best Furniture Collection",
      subtitle: "Dining, living & desk areas serve their purposes in total harmony of style.",
      image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1600&q=80",
      tag: "Fresh Arrival",
    },
    {
      title: "Stylish Looks For Any Season",
      subtitle: "Discover meticulously crafted essentials for your high-performance lifestyle.",
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80",
      tag: "Special Offer",
    }
  ];

  const banners = siteContent?.banners?.length > 0 
    ? siteContent.banners 
    : [
        { 
          title: siteContent?.heroTitle || defaultBanners[0].title, 
          subtitle: siteContent?.heroSubtitle || defaultBanners[0].subtitle, 
          image: siteContent?.heroImage || defaultBanners[0].image,
          tag: "Featured"
        },
        ...defaultBanners.slice(1)
      ];

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide(p => (p + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 md:gap-12 pb-20 pt-2 md:pt-4">
      {/* Hero & Top Promos Grid */}
      <section className="mx-auto max-w-7xl px-4 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 min-h-[400px] md:min-h-[500px]">
        {/* Main Carousel */}
        <div className="lg:col-span-8 relative rounded-2xl md:rounded-3xl overflow-hidden shadow-premium group bg-slate-100 aspect-[4/5] md:aspect-auto">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeSlide}
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="h-full w-full relative"
             >
                <img src={banners[activeSlide].image} className="h-full w-full object-cover grayscale-[0.2] group-hover:scale-105 transition-transform duration-[3s]" alt="" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex flex-col justify-center px-8 md:px-20 text-white">
                  <motion.span initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest w-fit mb-3 md:mb-4">{banners[activeSlide].tag}</motion.span>
                  <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-3xl md:text-6xl font-black tracking-tighter leading-none mb-4 md:mb-6 text-balance uppercase">{banners[activeSlide].title}</motion.h1>
                  <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-xs md:text-lg text-white/80 max-w-xs md:max-w-md mb-6 md:mb-8 line-clamp-2 md:line-clamp-none">{banners[activeSlide].subtitle}</motion.p>
                  <motion.button 
                    initial={{ scale: 0.8, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    transition={{ delay: 0.3 }} 
                    onClick={() => navigate(banners[activeSlide].link || '/products')}
                    className="btn-primary w-fit px-6 md:px-10 py-3 md:py-4 uppercase tracking-widest text-[10px] md:text-[11px]"
                  >
                    Shop Now
                  </motion.button>
                </div>
             </motion.div>
           </AnimatePresence>
           <div className="absolute bottom-6 md:bottom-10 left-8 md:left-12 flex gap-2 md:gap-3">
              {banners.map((_, i) => (
                <button key={i} onClick={() => setActiveSlide(i)} className={`h-1 md:h-1.5 rounded-full transition-all ${activeSlide === i ? 'w-6 md:w-8 bg-white' : 'w-1.5 md:w-2 bg-white/40'}`} />
              ))}
           </div>
        </div>

        {/* Side Banners */}
        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 md:gap-5">
           <div className="flex-1 bg-[#EEF2FF] rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col justify-center relative overflow-hidden group min-h-[180px]">
              <div className="relative z-10">
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary mb-1 md:mb-2 block">Supper Sale 50%</span>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight mb-3 md:mb-4">Stylish Men's<br/>Fashion</h3>
                <button className="bg-slate-900 text-white px-4 md:px-5 py-2 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-all">Shop Now</button>
              </div>
              <img src="https://images.unsplash.com/photo-1488161628813-04466f872be2?w=500&q=80" className="absolute right-0 top-0 h-full w-2/5 md:w-1/2 object-contain group-hover:scale-110 transition-transform duration-700" alt="" />
           </div>
           
           <div className="flex-1 bg-[#FFF7ED] rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col justify-center relative overflow-hidden group min-h-[180px]">
              <div className="relative z-10">
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-secondary mb-1 md:mb-2 block">Mid Summer</span>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight mb-3 md:mb-4 text-primary">Flash Sale<br/>30% OFF</h3>
                <button className="bg-primary text-white px-4 md:px-5 py-2 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-widest hover:brightness-95 transition-all">Claim Now</button>
              </div>
              <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80" className="absolute right-0 top-0 h-full w-2/5 md:w-1/2 object-contain group-hover:scale-110 transition-transform duration-700" alt="" />
           </div>
        </div>
      </section>

      {/* Weekly Deals Section */}
      <section className="mx-auto max-w-7xl px-4 w-full">
        <div className="bg-slate-900 rounded-[32px] md:rounded-[40px] p-6 md:p-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-6">
            <div className="text-white">
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter mb-2">Weekly Best Deals</h2>
              <p className="text-slate-400 text-xs md:text-sm">Experience the premium selection with massive discounts.</p>
            </div>
            <div className="flex items-center gap-4">
               <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest hidden sm:block">Ends In:</span>
               <div className="flex gap-2">
                 {[12, 45, 9, 32].map((time, i) => (
                   <div key={i} className="bg-primary text-white h-10 w-10 md:h-12 md:w-12 rounded-xl flex items-center justify-center font-black text-base md:text-xl shadow-lg shadow-primary/20">{time < 10 ? `0${time}` : time}</div>
                 ))}
               </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Circles */}
      <section className="mx-auto max-w-7xl px-4 w-full">
        <div className="text-center mb-8 md:mb-12">
           <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-2">Categories</h2>
           <p className="text-slate-400 text-xs md:text-sm">Find what you're looking for in style.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {categories.map((cat, i) => (
            <div 
              key={cat.id} 
              onClick={() => { setSelectedCategory(cat.name); navigate('/products'); }}
              className="group flex flex-col items-center gap-3 md:gap-4 cursor-pointer"
            >
              <div className="h-20 w-20 md:h-28 md:w-28 rounded-full border-2 border-slate-100 p-1 group-hover:border-primary transition-all duration-500 overflow-hidden shadow-sm">
                <img src={cat.image || `https://images.unsplash.com/photo-${1500000000000 + i * 100000}?w=200&q=80`} className="h-full w-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500" alt="" />
              </div>
              <div className="text-center">
                <p className="font-bold text-xs md:text-sm text-slate-900 uppercase">{cat.name}</p>
                <p className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">View All</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Promotional Banners Bento */}
      <section className="mx-auto max-w-7xl px-4 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {[
          { title: "FITNESS FOR SMART SPECIAL OFFER", img: "https://images.unsplash.com/photo-1510017803434-a899398421b3?w=600&q=80", color: "bg-emerald-50", badge: "Gadget Collection" },
          { title: "MODERN MEN'S FASHION", img: "https://images.unsplash.com/photo-1516257984877-a03a219c99d5?w=600&q=80", color: "bg-orange-50", badge: "Modern Fashion" },
          { title: "HOUSEHOLD BEST OFFERS", img: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&q=80", color: "bg-blue-50", badge: "Home Appliances" }
        ].map((promo, i) => (
          <div key={i} className={`${promo.color} rounded-2xl md:rounded-[40px] p-8 md:p-10 flex flex-col gap-3 md:gap-4 relative overflow-hidden group min-h-[280px] md:min-h-[320px]`}>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">{promo.badge}</span>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight max-w-[150px]">{promo.title}</h3>
            <button className="btn-primary w-fit py-2 px-4 md:px-6 mt-2 md:mt-4 text-[9px] md:text-[10px] tracking-widest uppercase">Explore</button>
            <img src={promo.img} className="absolute right-0 bottom-0 h-3/4 md:h-4/5 w-1/2 object-contain group-hover:scale-105 transition-transform duration-500" alt="" />
          </div>
        ))}
      </section>

      {/* Popular Products List */}
      <section className="mx-auto max-w-7xl px-4 w-full flex flex-col gap-8 md:gap-12">
        <div className="text-center">
           <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-2">Popular Products</h2>
           <p className="text-slate-400 text-xs md:text-sm">Most wanted collections chosen by our community.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
           {products.slice(0, 10).map(product => (
             <ProductCard key={product.id} product={product} />
           ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="mx-auto max-w-7xl px-4 w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 py-8 md:py-10 border-y border-slate-100">
        <div className="flex items-center gap-4 md:gap-6 p-4 md:p-6">
           <div className="h-12 w-12 md:h-16 md:w-16 rounded-2xl md:rounded-3xl bg-secondary/10 flex items-center justify-center -rotate-6">
             <Shield className="h-6 w-6 md:h-8 md:w-8 text-secondary" />
           </div>
           <div>
             <h4 className="font-black text-base md:text-lg uppercase tracking-tight">Money Back</h4>
             <p className="text-slate-400 text-xs md:text-sm">30 days guarantee.</p>
           </div>
        </div>
        <div className="flex items-center gap-4 md:gap-6 p-4 md:p-6 md:border-x border-slate-100">
           <div className="h-12 w-12 md:h-16 md:w-16 rounded-2xl md:rounded-3xl bg-primary/10 flex items-center justify-center rotate-6">
             <PhoneCall className="h-6 w-6 md:h-8 md:w-8 text-primary" />
           </div>
           <div>
             <h4 className="font-black text-base md:text-lg uppercase tracking-tight">Premium Support</h4>
             <p className="text-slate-400 text-xs md:text-sm">24/7 technical support.</p>
           </div>
        </div>
        <div className="flex items-center gap-4 md:gap-6 p-4 md:p-6">
           <div className="h-12 w-12 md:h-16 md:w-16 rounded-2xl md:rounded-3xl bg-accent/10 flex items-center justify-center -rotate-6">
             <Truck className="h-6 w-6 md:h-8 md:w-8 text-accent" />
           </div>
           <div>
             <h4 className="font-black text-base md:text-lg uppercase tracking-tight">Free Shipping</h4>
             <p className="text-slate-400 text-xs md:text-sm">Over $150 worldwide.</p>
           </div>
        </div>
      </section>
    </div>
  );
};

