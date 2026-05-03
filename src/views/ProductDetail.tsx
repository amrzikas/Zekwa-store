import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ShoppingCart, Star, ArrowLeft, Heart, Share2, Shield, Truck, RefreshCw, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency, cn } from '../lib/utils';
import { toast } from 'react-hot-toast';
import { ReviewForm } from '../components/ReviewForm';
import { ReviewList } from '../components/ReviewList';
import { reviewService } from '../services/reviewService';
import { adminService } from '../services/adminService';
import { Review } from '../types';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, currency, wishlist, toggleWishlist, user } = useStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [reviews, setReviews] = useState<Review[]>([]);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isInWishlist = product ? wishlist.includes(product.id) : false;

  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        setLoading(true);
        try {
          const p = await adminService.getProduct(id);
          setProduct(p);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      }
    };
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (id) {
      const unsubscribe = reviewService.getReviews(id, (fetchedReviews) => {
        setReviews(fetchedReviews);
      });
      return () => unsubscribe();
    }
  }, [id]);

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : product?.rating || 0;

  const totalReviews = reviews.length > 0 ? reviews.length : product?.numReviews || 0;

  const handleToggleWishlist = () => {
    if (!user) {
      toast.error('Please sign in to save items to your wishlist');
      return;
    }
    toggleWishlist(product.id);
    toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist', {
      icon: isInWishlist ? '💔' : '❤️',
      style: { borderRadius: '12px', background: '#1e293b', color: '#fff' },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <button onClick={() => navigate('/products')} className="text-slate-900 underline font-bold">Back to products</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Check if all variants are selected
    if (product.variants && product.variants.length > Object.keys(selectedVariants).length) {
      toast.error('Please select all options');
      return;
    }
    addToCart(product, selectedVariants);
    toast.success(`${product.name} added to cart`, {
      icon: '🛒',
      style: { borderRadius: '12px', background: '#1e293b', color: '#fff' },
    });
  };

  const handleVariantSelect = (type: string, option: string) => {
    setSelectedVariants(prev => ({ ...prev, [type]: option }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-16">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> BACK
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20">
        {/* Images */}
        <div className="flex flex-col gap-3 md:gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-[4/5] md:aspect-square lg:aspect-[4/5] overflow-hidden rounded-2xl md:rounded-3xl bg-slate-100 border border-slate-100"
          >
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </motion.div>
          <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={cn(
                  "h-16 w-16 md:h-24 md:w-20 flex-shrink-0 overflow-hidden rounded-lg md:rounded-xl border-2 transition-all",
                  selectedImage === idx ? "border-slate-900" : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <img src={img} alt={`${product.name} ${idx}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6 md:gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">{product.category}</span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 leading-none uppercase">{product.name}</h1>
            <div className="flex items-center gap-4 mt-1 md:mt-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={cn("h-3 w-3 md:h-4 md:w-4", i < Math.floor(Number(avgRating)) ? "fill-primary text-primary" : "text-slate-200")} />
                ))}
                <span className="ml-2 text-xs md:text-sm font-bold text-slate-900">{avgRating}</span>
                <span className="text-xs md:text-sm text-slate-400">({totalReviews} reviews)</span>
              </div>
            </div>
          </div>

          <p className="text-sm md:text-lg text-slate-600 leading-relaxed">{product.description}</p>

          {product.material && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Material:</span>
              <span className="text-xs font-bold text-slate-900">{product.material}</span>
            </div>
          )}

          {/* Variants */}
          {product.variants && (
            <div className="flex flex-col gap-5 md:gap-6">
              {product.variants.map((v) => (
                <div key={v.type} className="flex flex-col gap-2 md:gap-3">
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">{v.type}</span>
                  <div className="flex flex-wrap gap-2">
                    {v.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleVariantSelect(v.type, opt)}
                        className={cn(
                          "px-3 md:px-4 py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold transition-all border",
                          selectedVariants[v.type] === opt
                            ? "bg-slate-900 border-slate-900 text-white shadow-lg"
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
                        )}
                      >
                        {opt.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between border-y border-slate-100 py-5 md:py-6">
            <span className="text-3xl md:text-4xl font-black text-slate-900">{formatCurrency(product.price, currency)}</span>
            <div className="flex gap-2">
              <button 
                onClick={handleToggleWishlist}
                className={cn(
                  "rounded-full border p-2 md:p-3 transition-all transform active:scale-90",
                  isInWishlist ? "bg-rose-500 border-rose-500 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                )}
              >
                <Heart className={cn("h-4 w-4 md:h-5 md:w-5", isInWishlist && "fill-current")} />
              </button>
              <button className="rounded-full border border-slate-200 p-2 md:p-3 hover:bg-slate-50 transition-colors">
                <Share2 className="h-4 w-4 md:h-5 md:w-5 text-slate-600" />
              </button>
            </div>
          </div>

          <div className="flex gap-3 md:gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 md:gap-3 rounded-full bg-slate-900 py-3 md:py-4 text-xs md:text-sm font-black tracking-widest text-white transition-all hover:bg-slate-800 disabled:bg-slate-300 shadow-xl shadow-slate-900/20"
            >
              <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
              {product.stock > 0 ? 'ADD TO BAG' : 'OUT OF STOCK'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0">
                <Truck className="h-4 w-4 md:h-5 md:w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-tight">Fast Shipping</p>
                <p className="text-[9px] md:text-[10px] text-slate-500">2-4 business days</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0">
                <Shield className="h-4 w-4 md:h-5 md:w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-tight">Safe Secure</p>
                <p className="text-[9px] md:text-[10px] text-slate-500">Encrypted checkout</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0">
                <RefreshCw className="h-4 w-4 md:h-5 md:w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-tight">30 Day Returns</p>
                <p className="text-[9px] md:text-[10px] text-slate-500">Hassle free policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-20 md:mt-32">
        <div className="flex flex-col gap-1 mb-12">
           <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Customer Feedback</h2>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Real experiences from our community</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
          <div className="lg:col-span-1 flex flex-col gap-8">
             {/* Rating Summary Card */}
             <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                   <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Aggregate Score</p>
                   <div className="flex items-baseline gap-2">
                      <h3 className="text-6xl font-black">{avgRating}</h3>
                      <span className="text-xl text-white/40 font-bold">/ 5.0</span>
                   </div>
                   <div className="flex items-center gap-1 mt-2 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={cn("h-4 w-4", i < Math.floor(Number(avgRating)) ? "fill-primary text-primary" : "text-white/10")} />
                      ))}
                   </div>
                   <p className="text-sm text-slate-400 leading-relaxed">
                     Based on {totalReviews} verified reviews from customers globally.
                   </p>
                </div>
                <MessageCircle className="absolute -right-6 -bottom-6 h-32 w-32 text-white/5" />
             </div>

             <ReviewForm productId={product.id} />
          </div>

          <div className="lg:col-span-2">
             <ReviewList productId={product.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper for cn in this file if needed, though imported from lib/utils
