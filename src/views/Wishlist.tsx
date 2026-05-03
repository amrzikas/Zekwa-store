import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useStore } from '../store/useStore';
import { ProductCard } from '../components/ProductCard';
import { adminService } from '../services/adminService';
import { useNavigate } from 'react-router-dom';

export const Wishlist = () => {
  const { wishlist, user } = useStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadWishlistProducts = async () => {
      if (wishlist.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Since we don't have a batch get by IDs in adminService yet, we'll fetch all and filter
        // In a real app, you'd want a more targeted query.
        const allProducts = await adminService.getProducts();
        const wishlistProducts = allProducts.filter((p: any) => wishlist.includes(p.id));
        setProducts(wishlistProducts);
      } catch (error) {
        console.error('Error loading wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWishlistProducts();
  }, [wishlist]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="h-20 w-20 bg-rose-50 rounded-full flex items-center justify-center">
          <Heart className="h-10 w-10 text-rose-500" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">Your Wishlist</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Please sign in to view your saved items.</p>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="btn-primary px-8 py-4 uppercase text-xs font-black tracking-widest"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
      <div className="flex items-center gap-4 mb-12">
        <button 
          onClick={() => navigate(-1)}
          className="h-10 w-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-900 hover:bg-slate-50 transition-all shadow-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-1">My Wishlist</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            {wishlist.length} Items Saved
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="aspect-[3/4] bg-slate-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-[40px] p-20 flex flex-col items-center justify-center text-center gap-6 shadow-sm">
          <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center">
            <Heart className="h-12 w-12 text-slate-200" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">No items saved yet</h2>
            <p className="text-slate-400 font-medium max-w-sm mx-auto">
              Start adding your favorite products to your wishlist so you can find them easily later.
            </p>
          </div>
          <button 
            onClick={() => navigate('/products')}
            className="btn-primary px-10 py-4 uppercase text-xs font-black tracking-widest flex items-center gap-3"
          >
            <ShoppingBag className="h-4 w-4" />
            Explore Products
          </button>
        </div>
      )}
    </div>
  );
};
