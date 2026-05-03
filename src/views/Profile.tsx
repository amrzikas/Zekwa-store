import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Package, 
  MapPin, 
  CreditCard, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Heart, 
  Bell, 
  ShieldCheck,
  Edit2,
  Camera,
  ExternalLink,
  ShoppingBag,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Zap,
  Plus,
  Eye
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatCurrency, cn } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';

type SubTab = 'overview' | 'orders' | 'wishlist' | 'addresses' | 'security';

export const Profile = () => {
  const { user, setUser, currency } = useStore();
  const [activeTab, setActiveTab] = useState<SubTab>('overview');
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'security', label: 'Security', icon: ShieldCheck },
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ProfileOverview user={user} />;
      case 'orders':
        return <OrderHistory currency={currency} />;
      case 'wishlist':
        return <WishlistView />;
      case 'addresses':
        return <AddressesView />;
      case 'security':
        return <SecurityView />;
      default:
        return <ProfileOverview user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-8 pb-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-900">My Profile</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden sticky top-24">
              <div className="p-8 text-center border-b border-slate-50">
                <div className="relative inline-block group mb-4">
                  <div className="h-24 w-24 rounded-full bg-slate-100 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName} className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-10 w-10 text-slate-300" />
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 transition-transform">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{user.displayName}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{user.role} member</p>
              </div>

              <nav className="p-4 flex flex-col gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-black transition-all group",
                      activeTab === tab.id 
                        ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <tab.icon className={cn("h-5 w-5", activeTab === tab.id ? "text-primary" : "text-slate-400 group-hover:text-slate-900")} />
                      <span className="uppercase tracking-widest text-[11px]">{tab.label}</span>
                    </div>
                    <ChevronRight className={cn("h-4 w-4", activeTab === tab.id ? "text-white/40" : "text-slate-200")} />
                  </button>
                ))}
                
                <div className="h-px bg-slate-50 my-4" />
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-black text-rose-500 hover:bg-rose-50 transition-all uppercase tracking-widest text-[11px]"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[32px] border border-slate-100 shadow-sm min-h-[600px] p-6 md:p-10"
            >
              <div className="mb-10 flex justify-between items-end">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">
                    {tabs.find(t => t.id === activeTab)?.label}
                  </h2>
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Manage your {activeTab} information</p>
                </div>
                {activeTab === 'overview' && (
                  <button className="flex items-center gap-2 px-6 py-3 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                    <Edit2 className="h-3.5 w-3.5" /> Edit Profile
                  </button>
                )}
              </div>

              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileOverview = ({ user }: { user: any }) => (
  <div className="flex flex-col gap-10">
    {/* Stats Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {[
        { label: 'Total Spent', value: '$2,480.00', icon: CreditCard, color: 'text-primary', bg: 'bg-primary/10' },
        { label: 'Active Orders', value: '02', icon: ShoppingBag, color: 'text-orange-500', bg: 'bg-orange-50' },
        { label: 'Points earned', value: '1,240', icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-50' },
      ].map((stat, i) => (
        <div key={i} className="p-8 bg-slate-50 rounded-[28px] border border-slate-100 relative overflow-hidden group">
          <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mb-6 relative z-10", stat.bg)}>
            <stat.icon className={cn("h-6 w-6", stat.color)} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">{stat.label}</p>
          <p className="text-3xl font-black text-slate-900 relative z-10">{stat.value}</p>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
            <stat.icon size={120} />
          </div>
        </div>
      ))}
    </div>

    {/* Personal Info */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="flex flex-col gap-6">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4 flex items-center gap-2">
          <User className="h-4 w-4 text-primary" /> Personal Information
        </h3>
        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</span>
            <p className="text-sm font-bold text-slate-900 bg-slate-50 p-4 rounded-2xl border border-slate-100">{user.displayName}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</span>
            <p className="text-sm font-bold text-slate-900 bg-slate-50 p-4 rounded-2xl border border-slate-100">{user.email}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</span>
            <p className="text-sm font-bold text-slate-900 bg-slate-50 p-4 rounded-2xl border border-slate-100">+1 (555) 000-0000</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4 flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" /> Notifications
        </h3>
        <div className="flex flex-col gap-4">
          {[
            { id: 'orders', label: 'Order Status Updates', desc: 'Get notified when your order is shipped or delivered' },
            { id: 'promos', label: 'Promotional Emails', desc: 'Receive exclusive deals and weekly newsletters' },
            { id: 'account', label: 'Account Security', desc: 'Alerts for logins from new devices' },
          ].map(item => (
            <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="leading-tight">
                <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{item.label}</p>
                <p className="text-[10px] text-slate-400 font-medium">{item.desc}</p>
              </div>
              <button className="h-6 w-10 bg-emerald-500 rounded-full relative">
                <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const OrderHistory = ({ currency }: { currency: string }) => (
  <div className="flex flex-col gap-6">
    <div className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl text-white">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
          <Clock className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-tight">On the way</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">Track your current shipment</p>
        </div>
      </div>
      <button className="px-4 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg">Track Order</button>
    </div>

    <div className="flex flex-col gap-4 mt-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="p-6 bg-white border border-slate-100 rounded-[28px] hover:shadow-premium transition-all group">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-50 pb-6">
            <div className="flex items-center gap-4">
               <div className="h-16 w-16 bg-slate-100 rounded-2xl overflow-hidden p-2">
                 <img src={`https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200`} alt="" className="h-full w-full object-contain group-hover:scale-110 transition-transform" />
               </div>
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order #ZKW-982{i}</p>
                 <h4 className="text-sm font-black text-slate-900 uppercase">Premium Athletic Sneakers</h4>
                 <p className="text-xs font-bold text-slate-500">Ordered on May {i+1}, 2026</p>
               </div>
            </div>
            <div className="text-right flex flex-col items-end">
               <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-1 select-none">Delivered</span>
               <p className="text-lg font-black text-slate-900">{formatCurrency(199.99, currency as any)}</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-4">
               <button className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5 hover:gap-2 transition-all">
                 <Eye className="h-3.5 w-3.5" /> Order Details
               </button>
               <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 hover:text-slate-900">
                 <CheckCircle2 className="h-3.5 w-3.5" /> Repeat Order
               </button>
             </div>
             <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 hover:text-primary">
               Invoice <ExternalLink className="h-3 w-3" />
             </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const WishlistView = () => (
  <div className="flex flex-col items-center justify-center p-20 text-center">
    <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
      <Heart className="h-10 w-10 text-slate-200" />
    </div>
    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2">Your wishlist is empty</h3>
    <p className="text-slate-400 text-sm max-w-xs mb-8">Save items you love and they will show up here for later purchase.</p>
    <Link to="/products" className="btn-primary px-10 py-3 text-xs font-black uppercase tracking-widest">Start Shopping</Link>
  </div>
);

const AddressesView = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="p-8 bg-slate-900 rounded-[32px] text-white relative overflow-hidden group">
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg">Default</span>
        </div>
        <h4 className="text-lg font-black uppercase tracking-tight mb-2">Home (Primary)</h4>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          123 Business Avenue, Suite 456<br />
          Enterprise District, NY 10001<br />
          United States
        </p>
        <div className="flex gap-4">
          <button className="text-[10px] font-black uppercase tracking-widest text-white hover:text-primary transition-colors">Edit</button>
          <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-rose-500 transition-colors">Remove</button>
        </div>
      </div>
      <div className="absolute right-[-20%] bottom-[-20%] opacity-5 group-hover:scale-110 transition-transform">
        <MapPin size={240} />
      </div>
    </div>

    <button className="border-2 border-dashed border-slate-200 rounded-[32px] p-8 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-primary hover:text-primary transition-all">
      <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center">
        <Plus className="h-6 w-6" />
      </div>
      <span className="text-xs font-black uppercase tracking-widest">Add New Address</span>
    </button>
  </div>
);

const SecurityView = () => (
  <div className="flex flex-col gap-10">
    <div className="flex flex-col gap-6">
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">Security Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <span className="text-[10px] font-black text-emerald-500 uppercase">Highly Secure</span>
            </div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1">Two-Factor Authentication</h4>
            <p className="text-[11px] text-slate-400 font-medium mb-6">Add an extra layer of security to your account by requiring more than just a password.</p>
            <button className="text-[10px] font-black text-primary uppercase tracking-widest">Configure 2FA</button>
         </div>

         <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <LogOut className="h-8 w-8 text-slate-300" />
            </div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1">Active Sessions</h4>
            <p className="text-[11px] text-slate-400 font-medium mb-6">You are currently logged in on 2 devices. Manage your active sessions and logout remotely.</p>
            <button className="text-[10px] font-black text-slate-900 uppercase tracking-widest">View Sessions</button>
         </div>
      </div>
    </div>

    <div className="flex flex-col gap-6">
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">Danger Zone</h3>
      <div className="p-8 bg-rose-50 border border-rose-100 rounded-[32px] flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
           <h4 className="text-lg font-black text-rose-900 uppercase tracking-tighter mb-1">Delete Account</h4>
           <p className="text-xs text-rose-700/60 font-medium max-w-sm">Once you delete your account, there is no going back. Please be certain.</p>
        </div>
        <button className="px-8 py-3 bg-rose-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition-all">
          Permanently Delete
        </button>
      </div>
    </div>
  </div>
);
