import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { ShoppingBag, Mail, Lock, ArrowRight, Smartphone, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return toast.error('Firebase not configured');
    setLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success('Account created successfully!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Login successful!');
      }
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth) return toast.error('Firebase not configured');
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Signed in with Google');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 bg-slate-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[40px] p-10 shadow-2xl shadow-slate-200 border border-slate-100"
      >
        <div className="text-center mb-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg mb-6">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="mt-2 text-[10px] text-slate-400 uppercase tracking-widest font-black leading-none">
            {isSignUp ? 'Join the premium community' : 'Access your exclusive collection'}
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleAuth}>
          <div className="space-y-4">
            {isSignUp && (
              <div className="relative">
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="block w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 pl-12 pr-4 text-sm font-bold focus:border-slate-900 focus:bg-white focus:outline-none transition-all"
                  placeholder="Full Name"
                />
                <Users className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
              </div>
            )}
            
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 pl-12 pr-4 text-sm font-bold focus:border-slate-900 focus:bg-white focus:outline-none transition-all"
                placeholder="Email Address"
              />
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
            </div>

            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 pl-12 pr-4 text-sm font-bold focus:border-slate-900 focus:bg-white focus:outline-none transition-all"
                placeholder="Password"
              />
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-3 rounded-full bg-slate-900 py-4 text-xs font-black tracking-widest text-white transition-all hover:bg-slate-800 disabled:opacity-50 shadow-xl shadow-slate-900/10"
          >
            {loading ? 'PROCESSING...' : (isSignUp ? 'REGISTER NOW' : 'SIGN IN')}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        <div className="mt-8 flex flex-col gap-4">
           <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">
                 <span className="bg-white px-4">Social Login</span>
              </div>
           </div>

          <button
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-4 rounded-full border border-slate-100 bg-white py-4 text-[10px] font-black tracking-widest text-slate-900 transition-all hover:bg-slate-50"
          >
            <Smartphone className="h-4 w-4 text-rose-500" />
            GO WITH GOOGLE
          </button>

          <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-4">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="ml-2 text-slate-900 underline font-black"
            >
              {isSignUp ? 'Log In' : 'Sign Up Free'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
