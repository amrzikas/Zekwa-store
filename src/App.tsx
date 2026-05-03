import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './views/Home';
import { Products } from './views/Products';
import { ProductDetail } from './views/ProductDetail';
import { Cart } from './views/Cart';
import { Login } from './views/Login';
import { Admin } from './views/Admin';
import { Profile } from './views/Profile';
import { Wishlist } from './views/Wishlist';
import { PageView } from './views/PageView';
import { useStore } from './store/useStore';
import { FirebaseProvider } from './components/FirebaseProvider';

export default function App() {
  const { user } = useStore();

  return (
    <Router>
      <FirebaseProvider>
        <div className="flex min-h-screen flex-col bg-slate-50">
          <Toaster position="bottom-right" />
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={user?.role === 'admin' ? <Admin /> : <Navigate to="/login" />} />
              <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
              <Route path="/page/:slug" element={<PageView />} />
              <Route path="/checkout" element={<div className="flex flex-col items-center justify-center py-20 gap-4"><h1 className="text-4xl font-black">SECURE CHECKOUT</h1><p className="text-slate-500">Wait... integrating with payment gateway...</p></div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </FirebaseProvider>
    </Router>
  );
}
