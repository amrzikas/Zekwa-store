import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Star, StarHalf } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../store/useStore';
import { formatCurrency, cn } from '../lib/utils';
import { toast } from 'react-hot-toast';

import { ReviewSummary } from './ReviewSummary';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const { addToCart, currency } = useStore();

  if (!product) return null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`Added ${product.name} to cart!`, {
      style: {
        background: '#0f172a',
        color: '#fff',
        fontSize: '12px',
        fontWeight: 'bold',
        borderRadius: '12px',
      },
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all text-slate-400 hover:text-slate-900"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Image Section */}
            <div className="w-full md:w-1/2 bg-slate-50 p-8 flex items-center justify-center relative overflow-hidden">
              <div className="absolute top-8 left-8 flex flex-col gap-2">
                 {product.featured && <span className="badge-new">New Arrival</span>}
                 {product.price < 200 && <span className="badge-sale">Flash Sale</span>}
              </div>
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-auto max-h-[400px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Info Section */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col gap-6 overflow-y-auto">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{product.category}</span>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 leading-none uppercase">
                  {product.name}
                </h2>
                <ReviewSummary 
                   productId={product.id} 
                   initialRating={product.rating} 
                   initialCount={product.numReviews} 
                   className="mt-2" 
                   starSize="h-4 w-4"
                   textSize="text-xs"
                 />
              </div>

              <div className="flex items-baseline gap-3">
                 <span className="text-4xl font-black text-slate-900">
                    {formatCurrency(product.price, currency)}
                 </span>
                 <span className="text-lg text-slate-400 line-through font-medium">
                    {formatCurrency(product.price * 1.2, currency)}
                 </span>
              </div>

              <p className="text-slate-500 text-sm leading-relaxed line-clamp-4">
                {product.description}
              </p>

              <div className="mt-4 flex flex-col gap-4">
                <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-2">
                   <span className="flex items-center gap-1.5"><Zap className="h-3 w-3 text-primary" /> In Stock</span>
                   <span className="flex items-center gap-1.5"><ShoppingCart className="h-3 w-3" /> Free Delivery</span>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-primary transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart — {formatCurrency(product.price, currency)}
                </button>
                
                <button 
                  onClick={onClose}
                  className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                >
                  View Full Details
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

import { Zap } from 'lucide-react';
