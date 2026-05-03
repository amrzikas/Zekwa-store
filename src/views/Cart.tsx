import React from 'react';
import { useStore } from '../store/useStore';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, currency } = useStore();
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 150 ? 0 : 15;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 flex flex-col items-center justify-center text-center gap-6">
        <div className="h-24 w-24 rounded-full bg-slate-50 flex items-center justify-center">
          <ShoppingBag className="h-12 w-12 text-slate-300" />
        </div>
        <h1 className="text-3xl font-black tracking-tighter text-slate-900">YOUR BAG IS EMPTY</h1>
        <p className="text-slate-500 max-w-md">Looks like you haven't added anything to your bag yet. Start exploring our collection.</p>
        <Link
          to="/products"
          className="rounded-full bg-slate-900 px-8 py-4 text-sm font-black tracking-widest text-white transition-all hover:bg-slate-800"
        >
          GO SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 mb-8 md:mb-10 text-center md:text-left">SHOPPING BAG</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 flex flex-col gap-4 md:gap-6">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-row items-center gap-3 md:gap-4 rounded-2xl md:rounded-3xl bg-white p-3 md:p-4 border border-slate-100 shadow-sm"
              >
                <div className="h-20 w-20 md:h-24 md:w-24 flex-shrink-0 overflow-hidden rounded-xl md:rounded-2xl bg-slate-100 uppercase">
                  <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col gap-0.5 md:gap-1 min-w-0">
                   <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.category}</span>
                   <h3 className="text-xs md:text-lg font-black text-slate-900 truncate uppercase tracking-tight">{item.name}</h3>
                   {item.selectedVariants && (
                     <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[8px] md:text-[10px] text-slate-500 font-bold uppercase">
                       {Object.entries(item.selectedVariants).map(([type, opt]) => (
                         <span key={type} className="whitespace-nowrap">{type}: {opt}</span>
                       ))}
                     </div>
                   )}
                   <p className="text-xs md:text-sm font-black text-primary mt-0.5 md:mt-1">{formatCurrency(item.price, currency)}</p>
                </div>
                <div className="flex flex-col items-end gap-2 md:gap-3">
                   <div className="flex items-center border border-slate-100 rounded-full bg-slate-50 overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.selectedVariants)}
                        className="p-1 md:p-1.5 px-2 md:px-3 hover:bg-slate-200 transition-colors"
                      >
                        <Minus className="h-2.5 w-2.5 md:h-3 md:w-3" />
                      </button>
                      <span className="px-2 text-[10px] md:text-xs font-black min-w-[20px] text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedVariants)}
                        className="p-1 md:p-1.5 px-2 md:px-3 hover:bg-slate-200 transition-colors"
                      >
                        <Plus className="h-2.5 w-2.5 md:h-3 md:w-3" />
                      </button>
                   </div>
                   <button
                     onClick={() => removeFromCart(item.id, item.selectedVariants)}
                     className="text-red-400 hover:text-red-600 p-1 transition-colors"
                   >
                     <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                   </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="relative">
          <div className="sticky top-28 rounded-2xl md:rounded-[32px] bg-slate-900 p-6 md:p-8 text-white shadow-2xl">
            <h2 className="text-lg md:text-xl font-black uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Order Summary</h2>
            <div className="flex flex-col gap-4 text-xs md:text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-bold text-white">{formatCurrency(subtotal, currency)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span className="font-bold text-emerald-400">{shipping === 0 ? 'FREE' : formatCurrency(shipping, currency)}</span>
              </div>
              <div className="h-px bg-white/10 my-2" />
              <div className="flex justify-between text-xl md:text-2xl font-black">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(total, currency)}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-xs md:text-sm font-black tracking-widest text-white transition-all hover:brightness-95 shadow-lg shadow-primary/20"
            >
              CHECKOUT NOW
              <ArrowRight className="h-4 w-4" />
            </button>
            <p className="mt-6 text-center text-[9px] md:text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed">
               Secure payment with SSL encryption.<br/>Zekwa Buyer Protection included.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
