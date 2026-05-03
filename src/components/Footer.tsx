import React from 'react';
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, Zap, Youtube, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8 px-4 overflow-hidden">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
        {/* Brand Section */}
        <div className="lg:col-span-2 space-y-8">
           <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center -rotate-12 shadow-lg">
              <Zap className="h-6 w-6 text-white fill-current" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">Zekwa</span>
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
            We have expertise in building scalable, high performance e-commerce application. We are Ready to help you grow your business.
          </p>
          
          <div className="flex flex-col gap-4">
             <div className="flex gap-2">
               <input 
                 type="email" 
                 placeholder="Enter Your Email"
                 className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm flex-1 outline-none focus:border-primary transition-colors"
               />
               <button className="bg-primary text-white px-6 py-3 rounded-lg font-bold text-sm hover:brightness-95 transition-all">
                 Subscribe
               </button>
             </div>
          </div>

          <div className="flex gap-4">
            {[Facebook, Twitter, Instagram, Youtube, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all text-slate-400 hover:text-white">
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Links Sections */}
        <div>
          <h4 className="text-md font-bold mb-6 text-white uppercase tracking-tight">Information</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            {[
              { name: 'About Us', slug: 'about-us' },
              { name: 'Delivery Information', slug: 'delivery' },
              { name: 'Privacy Policy', slug: 'privacy' },
              { name: 'Terms & Conditions', slug: 'terms' },
              { name: 'Return Policy', slug: 'returns' }
            ].map(link => (
              <li key={link.slug}><Link to={`/page/${link.slug}`} className="hover:text-primary transition-colors">{link.name}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-md font-bold mb-6 text-white uppercase tracking-tight">Quick Links</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li><Link to="/profile" className="hover:text-primary transition-colors">Your Account</Link></li>
            <li><Link to="/cart" className="hover:text-primary transition-colors">Shopping Cart</Link></li>
            {['Returns & Exchanges', 'Return Center', 'Purchase History', 'Latest News Blog'].map(link => (
              <li key={link}><a href="#" className="hover:text-primary transition-colors">{link}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-md font-bold mb-6 text-white uppercase tracking-tight">My Accounts</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            {['My account', 'Shopping Cart', 'Wishlist', 'Order History', 'International Orders', 'Your Orders'].map(link => (
              <li key={link}><a href="#" className="hover:text-primary transition-colors">{link}</a></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-7xl pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-xs text-slate-500">© 2024 Zekwa. All rights reserved. Designed by Themetags</p>
        <div className="flex items-center gap-6">
           <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-3 opacity-30 grayscale brightness-200" alt="Visa" />
           <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-5 opacity-30 grayscale brightness-200" alt="Mastercard" />
           <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" className="h-4 opacity-30 grayscale brightness-200" alt="Paypal" />
        </div>
      </div>
    </footer>
  );
};
