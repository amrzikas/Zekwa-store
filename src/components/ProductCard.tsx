import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, Eye } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { formatCurrency, cn } from '../lib/utils';
import { toast } from 'react-hot-toast';
import { QuickViewModal } from './QuickViewModal';
import { ReviewSummary } from './ReviewSummary';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, currency, wishlist, toggleWishlist, user } = useStore();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const isInWishlist = wishlist.includes(product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please sign in to save items to your wishlist', {
        style: { borderRadius: '12px', background: '#1e293b', color: '#fff' },
      });
      return;
    }
    toggleWishlist(product.id);
    toast.success(
      isInWishlist ? 'Removed from wishlist' : 'Added to wishlist',
      {
        icon: isInWishlist ? '💔' : '❤️',
        style: { borderRadius: '12px', background: '#1e293b', color: '#fff' },
      }
    );
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart`, {
      icon: '🛒',
      style: {
        borderRadius: '12px',
        background: '#1e293b',
        color: '#fff',
      },
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-premium transition-all duration-300 border border-slate-50"
      >
        <Link to={`/product/${product.id}`} className="block">
          <div className="relative aspect-square w-full overflow-hidden bg-slate-50 p-1 md:p-2">
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-contain p-2 md:p-4 group-hover:scale-105 transition-transform duration-700"
            />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 md:top-4 md:left-4 flex flex-col gap-1 md:gap-2">
              {product.featured && <span className="badge-new text-[8px] md:text-sm px-2 py-0.5">New</span>}
              {product.price < 200 && <span className="badge-sale text-[8px] md:text-sm px-2 py-0.5">Save 20%</span>}
            </div>

            {/* Quick Actions - Always visible or simplified on mobile */}
            <div className="absolute top-2 right-2 md:top-4 md:right-4 flex flex-col gap-1 md:gap-2 md:translate-x-12 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100 transition-all duration-300">
              <button 
                onClick={handleToggleWishlist}
                className={cn(
                  "h-7 w-7 md:h-9 md:w-9 rounded-full shadow-md flex items-center justify-center transition-all duration-300 transform active:scale-90",
                  isInWishlist 
                    ? "bg-rose-500 text-white" 
                    : "bg-white/80 backdrop-blur-sm text-slate-500 hover:text-primary"
                )}
              >
                <Heart className={cn("h-4 w-4 md:h-5 md:w-5", isInWishlist && "fill-current")} />
              </button>
              <button 
                onClick={handleQuickView}
                className="h-7 w-7 md:h-9 md:w-9 bg-white/80 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center text-slate-500 hover:text-primary transition-colors"
              >
                <Eye className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            </div>
          </div>

          <div className="p-3 md:p-5">
             <ReviewSummary 
               productId={product.id} 
               initialRating={product.rating} 
               initialCount={product.numReviews} 
               className="mb-1 md:mb-2" 
               starSize="h-2.5 w-2.5 md:h-3 md:w-3"
               textSize="text-[8px] md:text-[10px]"
             />

             <h3 className="line-clamp-1 text-xs md:text-sm font-bold text-slate-900 group-hover:text-primary transition-colors mb-1 uppercase tracking-tight">
               {product.name}
             </h3>
             
             <div className="flex items-baseline gap-1 md:gap-2 mb-3 md:mb-4">
                <span className="text-sm md:text-lg font-black text-slate-900">
                  {formatCurrency(product.price, currency)}
                </span>
                <span className="text-[9px] md:text-xs text-slate-400 line-through font-medium">
                  {formatCurrency(product.price * 1.2, currency)}
                </span>
             </div>

             <button
               onClick={handleAddToCart}
               className="w-full bg-slate-900 text-white py-2 md:py-3 rounded-xl text-[9px] md:text-[11px] font-black uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-1.5 md:gap-2"
             >
               <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
               <span className="hidden xs:inline">Add to Cart</span>
               <span className="xs:hidden">Add</span>
             </button>
          </div>
        </Link>
      </motion.div>

      <QuickViewModal 
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
};
