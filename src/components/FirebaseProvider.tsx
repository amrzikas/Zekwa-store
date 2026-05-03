import React, { useEffect, useState, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useStore } from '../store/useStore';
import { User } from '../types';

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, setUser, cart, setCart, clearCart, setCurrency, wishlist, setWishlist, clearWishlist } = useStore();
  const [loading, setLoading] = useState(true);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db!, 'settings', 'general'));
        if (docSnap.exists()) {
          setCurrency(docSnap.data().currency as any);
        }
      } catch (e) { console.error('Error loading settings:', e); }
    };
    loadSettings();
  }, [setCurrency]);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db!, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          let userData: any;
          
          if (!userDocSnap.exists()) {
            const role = firebaseUser.email === 'AmrZikas20@gmail.com' ? 'admin' : 'customer';
            
            userData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              role: role,
              cart: [],
              wishlist: [],
              createdAt: serverTimestamp(),
            };
            await setDoc(userDocRef, userData);
          } else {
            userData = userDocSnap.data();
            if (userData.cart) {
              setCart(userData.cart);
            }
            if (userData.wishlist) {
              setWishlist(userData.wishlist);
            }
          }

          setUser({
            uid: userData.uid,
            email: userData.email,
            displayName: userData.displayName,
            role: userData.role,
            photoURL: userData.photoURL
          } as User);
        } catch (error) {
          console.error('Error syncing user data:', error);
        }
      } else {
        setUser(null);
        clearCart();
        clearWishlist();
      }
      setLoading(false);
      isInitialLoad.current = false;
    });

    return () => unsubscribe();
  }, [setUser, setCart, clearCart, setWishlist, clearWishlist]);

  // Sync cart and wishlist to Firestore whenever they change, but skip the first load
  useEffect(() => {
    if (!loading && user && !isInitialLoad.current) {
      const syncStore = async () => {
        try {
          const userDocRef = doc(db!, 'users', user.uid);
          await updateDoc(userDocRef, { cart, wishlist });
        } catch (error) {
          console.error('Error syncing store to Firestore:', error);
        }
      };
      
      const timeout = setTimeout(syncStore, 1000); // Debounce sync
      return () => clearTimeout(timeout);
    }
  }, [cart, wishlist, user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};
