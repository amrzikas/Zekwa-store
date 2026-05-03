import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, LogOut, ChevronDown, Heart, Headphones, Zap, MapPin, Gift, ChevronRight } from 'lucide-react';
import { auth } from '../lib/firebase';
import { useStore } from '../store/useStore';
import { adminService } from '../services/adminService';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const { cart, user, setUser, searchQuery, setSearchQuery, currency, wishlist, setSelectedCategory } = useStore();
  const navigate = useNavigate();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const loadCats = async () => {
      try {
        const cats = await adminService.getCategories();
        setCategories(cats || []);
      } catch (e) { console.error(e); }
    };
    loadCats();
  }, []);

  const handleLogout = async () => {
    if (auth) {
      try {
        await auth.signOut();
        navigate('/');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    } else {
      setUser(null);
      navigate('/');
    }
    setIsProfileOpen(false);
  };

  return (
    <header className="w-full sticky top-0 z-[100]">
      {/* Top Bar - Hidden on Mobile */}
      <div className="bg-slate-900 text-white py-2 px-4 shadow-sm hidden md:block">
        <div className="mx-auto max-w-7xl flex justify-between items-center text-[11px] font-medium tracking-wide">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-primary" /> Track Order</span>
            <span className="flex items-center gap-1.5 border-l border-slate-700 pl-4 text-slate-400">Introducing Big Display Horizon Pro Smartwatch @ ₹999 🔥 Grab Now! ➜</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-primary cursor-pointer transition-colors">Find Store</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Help Center</span>
            <div className="flex items-center gap-2 border-l border-slate-700 pl-4">
              <span className="uppercase text-slate-400 font-bold">{currency}</span>
              <ChevronDown className="h-3 w-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white border-b border-slate-100 py-3 md:py-4 relative z-50">
        <div className="mx-auto max-w-7xl px-4 flex items-center justify-between gap-4 md:gap-8">
          {/* Menu Toggle (Mobile) */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-primary transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="h-8 w-8 md:h-10 md:w-10 bg-primary rounded-lg md:rounded-xl flex items-center justify-center -rotate-12 shadow-lg">
              <Zap className="h-5 w-5 md:h-6 md:w-6 text-white fill-current" />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-900">Zekwa</span>
          </Link>

          {/* Search Bar - Hidden on mobile, shown as icon or compact? */}
          <div className="hidden lg:flex flex-1 max-w-2xl relative group">
            <form onSubmit={(e) => { e.preventDefault(); navigate('/products'); }} className="flex h-12 w-full">
              <input
                type="text"
                placeholder="Search for products, brands and more"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-l-xl px-5 py-2 text-sm focus:border-primary focus:outline-none transition-all"
              />
              <button className="bg-primary text-white px-8 rounded-r-xl font-bold hover:brightness-95 transition-all text-sm">
                SEARCH
              </button>
            </form>
          </div>

          {/* Icons/User */}
          <div className="flex items-center gap-3 md:gap-6">
            <button className="lg:hidden p-2 text-slate-600 hover:text-primary transition-colors">
              <Search className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-3 md:gap-5">
              <Link to="/wishlist" className="relative group text-slate-600 hover:text-primary transition-colors hidden sm:block">
                <Heart className="h-6 w-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              
              <Link to="/cart" className="relative group text-slate-600 hover:text-primary transition-colors">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            <div className="h-8 md:h-10 w-px bg-slate-100 hidden sm:block" />

            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 md:gap-3 text-left group"
              >
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center group-hover:border-primary/20 transition-all overflow-hidden">
                  {user?.photoURL ? <img src={user.photoURL} alt="" /> : <User className="h-5 w-5 text-slate-400" />}
                </div>
                <div className="hidden sm:block leading-tight">
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">
                    {user ? 'Welcome' : 'Hello'}
                  </p>
                  <p className="text-xs font-black text-slate-900 flex items-center gap-1 uppercase">
                    {user ? (user.displayName?.split(' ')[0] || 'Member') : 'Sign In'}
                    <ChevronDown className="h-3 w-3" />
                  </p>
                </div>
              </button>
              
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-premium p-2 overflow-hidden"
                  >
                    {!user ? (
                      <Link to="/login" className="block w-full btn-primary text-xs py-3 mb-2" onClick={() => setIsProfileOpen(false)}>LOGIN / REGISTER</Link>
                    ) : (
                      <>
                        <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors" onClick={() => setIsProfileOpen(false)}>
                          <User className="h-4 w-4" /> My Profile
                        </Link>
                        {user.role === 'admin' && (
                          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors" onClick={() => setIsProfileOpen(false)}>
                            <Zap className="h-4 w-4" /> Admin Dashboard
                          </Link>
                        )}
                        <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav Links Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
            <motion.div className="absolute left-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-2xl p-6 flex flex-col gap-8">
               <div className="flex items-center justify-between">
                 <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center -rotate-12 shadow-lg">
                      <Zap className="h-5 w-5 text-white fill-current" />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-slate-900">Zekwa</span>
                 </Link>
                 <button onClick={() => setIsMenuOpen(false)}>
                   <X className="h-6 w-6 text-slate-400" />
                 </button>
               </div>

               <div className="flex flex-col gap-2">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Navigation</p>
                 {['Home', 'Shop', 'New Arrivals', 'Super Deals', 'Flash Sale'].map((item) => (
                    <Link 
                      key={item} 
                      to="/products" 
                      onClick={() => setIsMenuOpen(false)}
                      className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center justify-between py-2 border-b border-slate-50"
                    >
                      {item}
                      <ChevronRight className="h-4 w-4 text-slate-300" />
                    </Link>
                 ))}
               </div>

               <div className="flex flex-col gap-4">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categories</p>
                 <div className="grid grid-cols-2 gap-3">
                   {categories.slice(0, 4).map(cat => (
                     <button 
                       key={cat.id} 
                       onClick={() => { setSelectedCategory(cat.name); navigate('/products'); setIsMenuOpen(false); }}
                       className="p-4 rounded-2xl bg-slate-50 text-xs font-bold text-slate-600 hover:bg-primary/10 hover:text-primary transition-colors text-left uppercase tracking-wider"
                     >
                       {cat.name}
                     </button>
                   ))}
                 </div>
               </div>

               <div className="mt-auto pt-8 border-t border-slate-100">
                 <div className="flex items-center gap-4 text-slate-400">
                    <div className="flex-1 flex flex-col gap-1">
                      <p className="text-[10px] font-black uppercase">Need Help?</p>
                      <p className="text-sm font-bold text-slate-900">1800 123 4567</p>
                    </div>
                    <Headphones className="h-8 w-8 text-primary" />
                 </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sub Navbar - Hidden on Mobile */}
      <div className="bg-white border-b border-slate-100 shadow-sm hidden lg:block">
        <div className="mx-auto max-w-7xl px-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative">
              <button 
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="bg-primary/10 text-primary px-6 py-4 flex items-center gap-3 font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all border-x border-slate-50"
              >
                <Menu className="h-4 w-4" />
                Browse Categories
                <ChevronDown className={cn("h-3 w-3 transition-transform", isCategoryOpen && "rotate-180")} />
              </button>
              
              <AnimatePresence>
                {isCategoryOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 top-full w-64 bg-white border border-slate-100 shadow-xl overflow-hidden py-2"
                  >
                    {categories.map(cat => (
                      <button 
                        key={cat.id} 
                        onClick={() => { setSelectedCategory(cat.name); navigate('/products'); setIsCategoryOpen(false); }}
                        className="w-full text-left px-6 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors flex items-center justify-between group"
                      >
                        {cat.name.toUpperCase()}
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-8 ml-8">
              {['Home', 'Shop', 'New Arrivals', 'Super Deals', 'Flash Sale'].map((item) => (
                <Link key={item} to="/products" className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors flex items-center gap-1.5">
                  {item}
                  {(item === 'Super Deals' || item === 'Flash Sale') && <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-4 text-primary font-black text-[11px] uppercase tracking-widest">
            <Zap className="h-4 w-4 animate-bounce" />
            Clearance Sale Up to 70% Off
          </div>
        </div>
      </div>
    </header>
  );
};

import { cn } from '../lib/utils';
