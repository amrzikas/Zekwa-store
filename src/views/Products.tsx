import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, Filter, Search, X, ChevronDown, ArrowLeft } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { adminService } from '../services/adminService';
import { useNavigate } from 'react-router-dom';

export const Products = () => {
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useStore();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating'>('rating');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prods, cats] = await Promise.all([
          adminService.getProducts(),
          adminService.getCategories()
        ]);
        setProducts(prods || []);
        setCategories(cats || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-24 flex flex-col gap-10 md:gap-16">
      <div className="flex flex-col gap-8 md:gap-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-100 pb-8 md:pb-12">
          <div>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2 block">Archive 2026</span>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-black uppercase leading-none">
              Store.
            </h1>
            <div className="flex items-center gap-4 mt-4">
              <button 
                onClick={() => navigate(-1)}
                className="h-8 w-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <p className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] leading-none">Showing {filteredProducts.length} Results</p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="group whitespace-nowrap flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-full border border-black hover:bg-black hover:text-white transition-all text-[9px] md:text-[10px] font-black tracking-widest uppercase"
            >
              Filter
              <span className={cn("inline-block w-1.5 h-1.5 rounded-full bg-black group-hover:bg-white transition-colors", selectedCategory && "bg-black")} />
            </button>

            <div className="relative group flex-shrink-0">
               <select
                 value={sortBy}
                 onChange={(e) => setSortBy(e.target.value as any)}
                 className="appearance-none flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-full border border-black bg-white hover:bg-black hover:text-white transition-all text-[9px] md:text-[10px] font-black tracking-widest focus:outline-none pr-10 md:pr-12 cursor-pointer uppercase"
               >
                 <option value="rating">Sort By</option>
                 <option value="price-asc">Price L-H</option>
                 <option value="price-desc">Price H-L</option>
               </select>
               <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none group-hover:text-white" />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="py-6 md:py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 border-b border-slate-100">
                <div className="flex flex-col gap-4 md:gap-6">
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Category Filter</span>
                  <div className="flex flex-wrap md:flex-col gap-3 md:gap-4 items-start">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={cn(
                        "text-[10px] md:text-xs font-black uppercase tracking-widest transition-all",
                        !selectedCategory ? "text-primary underline underline-offset-8" : "text-slate-400 hover:text-black"
                      )}
                    >
                      All
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={cn(
                          "text-[10px] md:text-xs font-black uppercase tracking-widest transition-all",
                          selectedCategory === cat.name ? "text-primary underline underline-offset-8" : "text-slate-400 hover:text-black"
                        )}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col gap-4 md:gap-6">
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Search Refinement</span>
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="KEYWORD"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent border-b border-slate-200 py-2 text-[10px] font-black tracking-widest uppercase outline-none focus:border-black transition-all"
                    />
                    <Search className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-20">
        {filteredProducts.map((product) => (
           <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <Search className="h-12 w-12 text-slate-200" />
          <h2 className="text-xl font-bold">No products found</h2>
          <p className="text-slate-500">Try adjusting your search or filters.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
            className="text-slate-900 underline font-bold"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};
