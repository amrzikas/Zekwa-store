import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem, User } from '../types';

interface StoreState {
  user: User | null;
  setUser: (user: User | null) => void;
  cart: CartItem[];
  addToCart: (product: Product, selectedVariants?: Record<string, string>) => void;
  removeFromCart: (productId: string, selectedVariants?: Record<string, string>) => void;
  updateQuantity: (productId: string, quantity: number, selectedVariants?: Record<string, string>) => void;
  clearCart: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  currency: 'USD' | 'EUR' | 'GBP' | 'EGP';
  setCurrency: (currency: 'USD' | 'EUR' | 'GBP' | 'EGP') => void;
  setCart: (cart: CartItem[]) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  setWishlist: (wishlist: string[]) => void;
  clearWishlist: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      cart: [],
      setCart: (cart) => set({ cart }),
      wishlist: [],
      toggleWishlist: (productId) => set((state) => ({
        wishlist: state.wishlist.includes(productId)
          ? state.wishlist.filter(id => id !== productId)
          : [...state.wishlist, productId]
      })),
      setWishlist: (wishlist) => set({ wishlist }),
      clearWishlist: () => set({ wishlist: [] }),
      addToCart: (product, selectedVariants) =>
        set((state) => {
          const areVariantsEqual = (v1?: Record<string, string>, v2?: Record<string, string>) => {
            if (!v1 && !v2) return true;
            if (!v1 || !v2) return false;
            const keys1 = Object.keys(v1);
            const keys2 = Object.keys(v2);
            if (keys1.length !== keys2.length) return false;
            return keys1.every(key => v1[key] === v2[key]);
          };

          const existingItem = state.cart.find(
            (item) => item.id === product.id && areVariantsEqual(item.selectedVariants, selectedVariants)
          );

          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id && areVariantsEqual(item.selectedVariants, selectedVariants)
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, quantity: 1, selectedVariants }] };
        }),
      removeFromCart: (productId, selectedVariants) =>
        set((state) => {
          const areVariantsEqual = (v1?: Record<string, string>, v2?: Record<string, string>) => {
            if (!v1 && !v2) return true;
            if (!v1 || !v2) return false;
            return JSON.stringify(v1) === JSON.stringify(v2);
          };
          return {
            cart: state.cart.filter(
              (item) => !(item.id === productId && areVariantsEqual(item.selectedVariants, selectedVariants))
            ),
          };
        }),
      updateQuantity: (productId, quantity, selectedVariants) =>
        set((state) => {
          const areVariantsEqual = (v1?: Record<string, string>, v2?: Record<string, string>) => {
            if (!v1 && !v2) return true;
            if (!v1 || !v2) return false;
            return JSON.stringify(v1) === JSON.stringify(v2);
          };
          return {
            cart: state.cart.map((item) =>
              item.id === productId && areVariantsEqual(item.selectedVariants, selectedVariants)
                ? { ...item, quantity }
                : item
            ),
          };
        }),
      clearCart: () => set({ cart: [] }),
      searchQuery: '',
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      selectedCategory: null,
      setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
      currency: 'USD',
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'zekwa-store-storage',
      partialize: (state) => ({ cart: state.cart, user: state.user, currency: state.currency }),
    }
  )
);
