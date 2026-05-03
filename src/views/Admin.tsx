import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Box, 
  Tags, 
  Truck, 
  BarChart3, 
  Users, 
  Settings as SettingsIcon,
  Search,
  Plus,
  Filter,
  MoreVertical,
  Download,
  Eye,
  TrendingUp,
  CreditCard,
  Package,
  CheckCircle2,
  Clock,
  AlertCircle,
  Zap,
  Trash2,
  Edit,
  Save,
  X,
  Wallet,
  Smartphone,
  Check,
  Upload
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatCurrency, cn } from '../lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { adminService } from '../services/adminService';
import { toast } from 'react-hot-toast';

type TabType = 'orders' | 'products' | 'categories' | 'shipping' | 'accounting' | 'customers' | 'settings' | 'payments' | 'content';

export const Admin = () => {
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data states
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [shippingPlans, setShippingPlans] = useState<any[]>([]);
  const [paymentSettings, setPaymentSettings] = useState<any>(null);
  const [siteContent, setSiteContent] = useState<any>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [generalSettings, setGeneralSettings] = useState<any>(null);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    loadAllData();
  }, [user]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [cats, prods, ords, custs, ships, pay, content, pgs, gen] = await Promise.all([
        adminService.getCategories(),
        adminService.getProducts(),
        adminService.getOrders(),
        adminService.getCustomers(),
        adminService.getShippingPlans(),
        adminService.getPaymentSettings(),
        adminService.getSiteContent(),
        adminService.getPages(),
        adminService.getGeneralSettings()
      ]);
      setCategories(cats || []);
      setProducts(prods || []);
      setOrders(ords || []);
      setCustomers(custs || []);
      setShippingPlans(ships || []);
      setPaymentSettings(pay);
      setSiteContent(content);
      setPages(pgs || []);
      setGeneralSettings(gen);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
        <div className="bg-white p-12 rounded-[40px] shadow-sm border border-slate-100 text-center max-w-lg">
           <AlertCircle className="h-16 w-16 text-rose-500 mx-auto mb-6" />
           <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">Access Denied</h1>
           <p className="text-slate-500 font-medium mb-8">You do not have administrative privileges to access this area. Please contact the system administrator shifted to your level.</p>
           <button onClick={() => window.location.href = '/'} className="btn-primary px-8 py-3 uppercase text-xs font-black tracking-widest">Return to Store</button>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'products', label: 'Products', icon: Box },
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'content', label: 'Content', icon: LayoutDashboard },
    { id: 'accounting', label: 'Accounting', icon: BarChart3 },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ] as const;

  const renderContent = () => {
    if (loading) return <LoadingPlaceholder />;
    switch (activeTab) {
      case 'orders': return <OrdersView orders={orders} onRefresh={loadAllData} />;
      case 'products': return <ProductsView products={products} categories={categories} shippingPlans={shippingPlans} onRefresh={loadAllData} />;
      case 'categories': return <CategoriesView categories={categories} onRefresh={loadAllData} />;
      case 'shipping': return <ShippingView plans={shippingPlans} onRefresh={loadAllData} />;
      case 'payments': return <PaymentsView settings={paymentSettings} onRefresh={loadAllData} />;
      case 'content': return <CMSView content={siteContent} pages={pages} onRefresh={loadAllData} />;
      case 'accounting': return <AccountingView orders={orders} />;
      case 'customers': return <CustomersView customers={customers} onRefresh={loadAllData} />;
      case 'settings': return <SettingsView initialSettings={generalSettings} onRefresh={loadAllData} />;
      default: return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white z-[160] flex flex-col lg:hidden shadow-2xl"
            >
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center -rotate-12 shadow-lg">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">Zekwa</span>
                </div>
                <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 text-slate-400">
                   <AlertCircle className="h-5 w-5 rotate-45" />
                </button>
              </div>
              
              <nav className="flex-1 p-6 flex flex-col gap-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-black transition-all",
                      activeTab === item.id 
                        ? "bg-primary text-white shadow-xl shadow-primary/20" 
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="p-6 border-t border-slate-50">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Admin Controls v1.0.4</p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-slate-50">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center -rotate-12 shadow-lg">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">Zekwa Admin</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                activeTab === item.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-50">
          <div className="bg-slate-900 rounded-2xl p-4 text-white">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Current Plan</p>
            <p className="text-sm font-bold mb-3">Enterprise Suite</p>
            <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-all">
              Manage Billing
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
              {sidebarItems.find(i => i.id === activeTab)?.label}
            </h1>
            <p className="text-slate-400 text-sm">Manage your store's {activeTab} information.</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="relative hidden sm:block">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search dashboard..." 
                 className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all w-64"
               />
             </div>
             <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all">
               <Download className="h-5 w-5" />
             </button>
             <button 
               onClick={() => setIsMobileSidebarOpen(true)}
               className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all lg:hidden"
             >
               <LayoutDashboard className="h-5 w-5" />
             </button>
          </div>
        </header>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 min-h-[600px]">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const LoadingPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-[600px] gap-4">
    <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Syncing store data...</p>
  </div>
);

const OrdersView = ({ orders, onRefresh }: { orders: any[], onRefresh: () => void }) => {
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  const statusCounts = orders.reduce((acc: any, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, { all: orders.length, pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 });

  const stats = [
    { label: 'Total Orders', value: statusCounts.all, icon: ShoppingBag, color: 'text-primary', bg: 'bg-primary/10', key: 'all' },
    { label: 'Pending', value: statusCounts.pending, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50', key: 'pending' },
    { label: 'In Progress', value: statusCounts.processing + statusCounts.shipped, icon: Zap, color: 'text-blue-500', bg: 'bg-blue-50', key: 'processing' },
    { label: 'Delivered', value: statusCounts.delivered, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50', key: 'delivered' },
  ];

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await adminService.updateOrderStatus(id, status);
      toast.success(`Order status updated to ${status}`);
      onRefresh();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <button 
            key={i} 
            onClick={() => setFilter(stat.key)}
            className={cn(
              "p-6 rounded-2xl border transition-all text-left group hover:scale-[1.02]",
              filter === stat.key ? "bg-white border-primary shadow-xl shadow-primary/10" : "bg-slate-50 border-slate-100"
            )}
          >
            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-12", stat.bg)}>
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
          </button>
        ))}
      </div>

      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100">
              {['ID', 'Customer', 'Items', 'Total', 'Status', 'Actions'].map(h => (
                <th key={h} className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredOrders.map(order => (
              <tr key={order.id} className="group hover:bg-slate-50 transition-colors">
                <td className="py-4 font-mono text-xs font-black text-slate-400 truncate max-w-[80px]">#{order.id.slice(-6).toUpperCase()}</td>
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-black text-white">
                      {order.shippingAddress?.fullName?.slice(0, 2).toUpperCase() || '??'}
                    </div>
                    <div className="leading-tight">
                      <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{order.shippingAddress?.fullName || 'Anonymous'}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{order.shippingAddress?.email || 'No Email'}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-xs font-bold text-slate-500">
                  {order.items?.length || 0} items
                </td>
                <td className="py-4 text-sm font-black text-slate-900">{formatCurrency(order.total || 0, 'USD')}</td>
                <td className="py-4">
                  <select 
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest focus:outline-none transition-colors cursor-pointer",
                      order.status === 'delivered' ? "bg-emerald-50 text-emerald-600" :
                      order.status === 'cancelled' ? "bg-rose-50 text-rose-600" :
                      order.status === 'pending' ? "bg-orange-50 text-orange-600" :
                      "bg-blue-50 text-blue-600"
                    )}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="py-4">
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                   <div className="flex flex-col items-center gap-3 opacity-20">
                      <ShoppingBag size={48} />
                      <p className="text-sm font-black uppercase tracking-widest">No orders found</p>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[40px] w-full max-w-2xl relative overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                 <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Order Details</h2>
                    <p className="text-xs font-mono font-bold text-slate-400">#{selectedOrder.id.toUpperCase()}</p>
                 </div>
                 <button onClick={() => setSelectedOrder(null)} className="h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-white transition-all">
                    <X className="h-5 w-5 text-slate-400" />
                 </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
                 <div className="grid grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Customer Info</h4>
                        <div className="p-5 flex flex-col gap-3">
                           <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Name</p>
                              <p className="text-sm font-bold text-slate-900">{selectedOrder.shippingAddress?.fullName}</p>
                           </div>
                           <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Email</p>
                              <p className="text-sm font-bold text-slate-900">{selectedOrder.shippingAddress?.email}</p>
                           </div>
                           <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Phone</p>
                              <p className="text-sm font-bold text-slate-900">{selectedOrder.shippingAddress?.phone || 'N/A'}</p>
                           </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Shipping Address</h4>
                        <div className="p-5 bg-slate-50 rounded-2xl">
                           <p className="text-xs font-bold text-slate-600 leading-relaxed uppercase">
                              {selectedOrder.shippingAddress?.addressLine1}<br />
                              {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.country}
                           </p>
                        </div>
                    </div>
                 </div>

                 <div>
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Items Summary</h4>
                    <div className="flex flex-col gap-3">
                       {selectedOrder.items?.map((item: any, i: number) => (
                         <div key={i} className="flex items-center gap-4 p-4 border border-slate-50 rounded-2xl">
                            <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center p-2">
                               <Package className="h-5 w-5 text-slate-300" />
                            </div>
                            <div className="flex-1">
                               <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.name}</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-sm font-black text-slate-900">{formatCurrency(item.price * item.quantity, 'USD')}</p>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="mt-8 p-6 bg-slate-900 rounded-3xl text-white flex justify-between items-center">
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Total Bill</p>
                       <p className="text-2xl font-black">{formatCurrency(selectedOrder.total, 'USD')}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Payment Method</p>
                       <p className="text-sm font-bold uppercase">{selectedOrder.paymentMethod || 'Credit Card'}</p>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductsView = ({ products, categories, shippingPlans, onRefresh }: { products: any[], categories: any[], shippingPlans: any[], onRefresh: () => void }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase()) || 
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await adminService.deleteProduct(id);
      toast.success('Product deleted');
      onRefresh();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none transition-all"
          />
        </div>
        <button 
          onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all"
        >
          <Plus className="h-4 w-4" /> Add New Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(p => (
          <div key={p.id} className="bg-white p-4 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all flex flex-col group">
            <div className="aspect-square rounded-[24px] bg-slate-50 relative overflow-hidden mb-4 p-4 border border-slate-50">
               <img src={p.images?.[0] || 'https://placehold.co/400'} className="h-full w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" alt="" />
               <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingProduct(p); setIsModalOpen(true); }} className="h-8 w-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-white">
                     <Edit className="h-3 w-3 text-slate-900" />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="h-8 w-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-rose-50 hover:text-rose-500">
                     <Trash2 className="h-3 w-3" />
                  </button>
               </div>
            </div>
            <div className="flex-1 px-1">
               <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">{p.category}</p>
               <h4 className="text-sm font-black text-slate-900 uppercase tracking-tighter line-clamp-1 mb-2">{p.name}</h4>
               <div className="flex items-center justify-between">
                  <p className="text-lg font-black text-slate-900">{formatCurrency(p.price, 'USD')}</p>
                  <div className={cn(
                    "px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest",
                    p.stock > 10 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"
                  )}>
                    {p.stock} In Stock
                  </div>
               </div>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-20">
             <Box size={64} />
             <p className="text-sm font-black uppercase tracking-widest mt-4">No products matching your search</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <ProductForm 
            product={editingProduct} 
            categories={categories} 
            shippingPlans={shippingPlans}
            onClose={() => setIsModalOpen(false)} 
            onRefresh={onRefresh} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductForm = ({ product, categories, shippingPlans, onClose, onRefresh }: any) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    category: product?.category || categories[0]?.name || '',
    stock: product?.stock || 0,
    material: product?.material || '',
    shippingPlanId: product?.shippingPlanId || shippingPlans[0]?.id || '',
    images: product?.images || ['', '', '', '', ''],
    variants: product?.variants || [
      { type: 'Size', options: [] },
      { type: 'Color', options: [] }
    ],
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Filter out empty images
    const cleanedImages = formData.images.filter(img => img.trim() !== '');
    try {
      const dataToSave = { ...formData, images: cleanedImages };
      if (product) {
        await adminService.updateProduct(product.id, dataToSave);
        toast.success('Product updated');
      } else {
        await adminService.addProduct(dataToSave);
        toast.success('Product added');
      }
      onRefresh();
      onClose();
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const updateImage = (index: number, val: string) => {
    const newImages = [...formData.images];
    newImages[index] = val;
    setFormData({ ...formData, images: newImages });
  };

  const updateVariantOptions = (index: number, val: string) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], options: val.split(',').map(s => s.trim()).filter(s => s !== '') };
    setFormData({ ...formData, variants: newVariants });
  };

  const handleImageUpload = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 500) { // 500KB limit for base64 storage in firestore
      toast.error('Image too large (max 500KB). Use a URL for larger images.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      updateImage(index, result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        exit={{ scale: 0.9, opacity: 0 }} 
        className="bg-white rounded-[40px] w-full max-w-2xl relative p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-8 leading-none">{product ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Product Name</label>
              <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Category</label>
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none">
                {categories.map((c: any) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Description</label>
            <textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Price ($)</label>
              <input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Stock</label>
              <input type="number" required value={formData.stock} onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Shipping Plan</label>
            <select value={formData.shippingPlanId} onChange={(e) => setFormData({...formData, shippingPlanId: e.target.value})} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none">
              {shippingPlans.map((p: any) => <option key={p.id} value={p.id}>{p.name} (+{formatCurrency(p.price, 'USD')})</option>)}
              {shippingPlans.length === 0 && <option value="">No shipping plans created</option>}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Material</label>
            <input value={formData.material} onChange={(e) => setFormData({...formData, material: e.target.value})} placeholder="e.g. Cotton, Silk, leather" className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none" />
          </div>

          <div className="space-y-4">
             <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Variants (Comma separated)</label>
             {formData.variants.map((v, i) => (
               <div key={i} className="grid grid-cols-3 gap-4 items-center">
                  <span className="text-xs font-black text-slate-900 uppercase">{v.type}</span>
                  <input 
                    placeholder={`e.g. ${v.type === 'Color' ? 'Red, Blue, Green' : 'S, M, L, XL'}`}
                    value={v.options.join(', ')}
                    onChange={(e) => updateVariantOptions(i, e.target.value)}
                    className="col-span-2 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold"
                  />
               </div>
             ))}
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Images (up to 5 - URL or Upload)</label>
            <div className="grid grid-cols-1 gap-3">
               {formData.images.map((img, i) => (
                 <div key={i} className="flex gap-2 items-center">
                    <div className="flex-1 relative">
                       <input 
                         placeholder={`Image URL ${i+1}`}
                         value={img}
                         onChange={(e) => updateImage(i, e.target.value)}
                         className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-mono font-bold pr-10"
                       />
                       <label className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer p-1.5 hover:bg-slate-200 rounded-lg transition-colors">
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload(i)} />
                          <Upload className="h-3 w-3 text-slate-500" />
                       </label>
                    </div>
                    {img && <img src={img} className="h-10 w-10 object-cover rounded-lg border border-slate-100 bg-white" alt="" />}
                 </div>
               ))}
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button type="submit" disabled={submitting} className="flex-1 btn-primary py-4 uppercase text-xs font-black tracking-widest">{submitting ? '...' : 'Save Product'}</button>
            <button type="button" onClick={onClose} className="px-8 py-4 bg-slate-100 rounded-2xl text-xs font-black">Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const CategoriesView = ({ categories, onRefresh }: { categories: any[], onRefresh: () => void }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<any>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete category?')) return;
    try {
      await adminService.deleteCategory(id);
      toast.success('Category deleted');
      onRefresh();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <button onClick={() => { setEditingCat(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white rounded-[32px] p-8 border border-slate-100 relative group overflow-hidden shadow-sm hover:shadow-xl transition-all">
            <div className="relative z-10">
              <div className="h-20 w-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 overflow-hidden">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
                ) : (
                  <Package className="h-6 w-6 text-primary" />
                )}
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-1 leading-none">{cat.name}</h3>
              <div className="flex gap-4 mt-6">
                <button onClick={() => { setEditingCat(cat); setIsModalOpen(true); }} className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Edit</button>
                <button onClick={() => handleDelete(cat.id)} className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:underline">Delete</button>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity translate-x-4 translate-y-4"><Tags size={80} /></div>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {isModalOpen && (
          <CategoryForm 
            category={editingCat}
            onClose={() => setIsModalOpen(false)}
            onRefresh={onRefresh}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const CategoryForm = ({ category, onClose, onRefresh }: any) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    image: category?.image || ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (category) await adminService.updateCategory(category.id, formData);
      else await adminService.addCategory(formData);
      toast.success(category ? 'Category updated' : 'Category added');
      onRefresh();
      onClose();
    } catch (error) {
      toast.error('Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 500) {
      toast.error('Image too large (max 500KB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData({ ...formData, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[40px] w-full max-w-md relative p-10 shadow-2xl">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-8 leading-none">
          {category ? 'Edit Category' : 'Add Category'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Category Name</label>
            <input 
              name="name" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Fashion, Electronics" 
              className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary" 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Category Image</label>
            <div className="flex gap-3 items-center">
              <div className="flex-1 relative">
                <input 
                  placeholder="Image URL"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-mono font-bold pr-12 focus:outline-none focus:border-primary"
                />
                <label className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1.5 hover:bg-slate-200 rounded-lg transition-colors">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <Upload className="h-4 w-4 text-slate-500" />
                </label>
              </div>
              {formData.image && (
                <div className="h-14 w-14 rounded-2xl border border-slate-100 overflow-hidden bg-white">
                  <img src={formData.image} className="h-full w-full object-cover" alt="" />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 mt-2">
            <button type="submit" disabled={submitting} className="flex-1 btn-primary py-4 uppercase text-xs font-black tracking-widest">
              {submitting ? 'Saving...' : 'Save Category'}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-4 bg-slate-100 rounded-2xl text-xs font-black">
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const ShippingView = ({ plans, onRefresh }: { plans: any[], onRefresh: () => void }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      await adminService.deleteShippingPlan(id);
      onRefresh();
    } catch (e) { toast.error('Failed'); }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20">
          <Plus className="h-4 w-4" /> Add Shipping Plan
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          {plans.map(plan => (
            <div key={plan.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center"><Truck className="h-5 w-5 text-slate-400" /></div>
                 <div>
                   <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{plan.name}</p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{plan.deliveryTime}</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm font-black text-primary">{formatCurrency(plan.price, 'USD')}</p>
                <button onClick={() => handleDelete(plan.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[40px] w-full max-w-sm relative p-10 shadow-2xl">
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                try {
                  await adminService.addShippingPlan({
                    name: formData.get('name'),
                    price: Number(formData.get('price')),
                    deliveryTime: formData.get('deliveryTime')
                  });
                  onRefresh(); setIsModalOpen(false);
                } catch (error) { toast.error('Failed'); }
              }} className="flex flex-col gap-6">
                 <input name="name" required placeholder="Plan Name" className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                 <input name="price" type="number" required placeholder="Price" className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                 <input name="deliveryTime" required placeholder="Delivery Time (e.g. 3-5 days)" className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
                 <button type="submit" className="btn-primary py-4 uppercase text-xs font-black tracking-widest">Create Plan</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PaymentsView = ({ settings, onRefresh }: { settings: any, onRefresh: () => void }) => {
  const [data, setData] = useState(settings || {
    cashOnDelivery: true,
    wallets: [],
    instaPay: { address: '', mobile: '', enabled: false }
  });

  const handleSave = async () => {
    try {
      await adminService.updatePaymentSettings(data);
      toast.success('Payment settings updated');
      onRefresh();
    } catch (e) { toast.error('Failed to save'); }
  };

  const addWallet = () => {
    setData({ ...data, wallets: [...data.wallets, { name: '', number: '' }] });
  };

  const removeWallet = (index: number) => {
    const newWallets = [...data.wallets];
    newWallets.splice(index, 1);
    setData({ ...data, wallets: newWallets });
  };

  const updateWallet = (index: number, field: string, value: string) => {
    const newWallets = [...data.wallets];
    newWallets[index] = { ...newWallets[index], [field]: value };
    setData({ ...data, wallets: newWallets });
  };

  return (
    <div className="flex flex-col gap-12 max-w-4xl">
      <div className="flex flex-col gap-8">
        <div>
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-4">Payment Gateways</h3>
          <p className="text-slate-400 text-sm font-medium mb-8">Configure your store payment methods and transfer details.</p>
        </div>

        {/* Cash on Delivery */}
        <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="h-12 w-12 bg-emerald-100 rounded-2xl flex items-center justify-center"><CheckCircle2 className="h-6 w-6 text-emerald-600" /></div>
            <div>
              <p className="text-lg font-black text-slate-900 uppercase tracking-tighter">Cash on Delivery</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Enable COD at checkout</p>
            </div>
          </div>
          <button 
            onClick={() => setData({ ...data, cashOnDelivery: !data.cashOnDelivery })}
            className={cn("h-8 w-14 rounded-full relative transition-colors duration-300", data.cashOnDelivery ? "bg-primary" : "bg-slate-300")}
          >
            <div className={cn("absolute top-1 h-6 w-6 bg-white rounded-full transition-all duration-300 shadow-sm", data.cashOnDelivery ? "left-7" : "left-1")} />
          </button>
        </div>

        {/* Wallet Transfer */}
        <div className="p-8 bg-white border border-slate-100 rounded-[40px] shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-6">
                <div className="h-12 w-12 bg-blue-100 rounded-2xl flex items-center justify-center"><Wallet className="h-6 w-6 text-blue-600" /></div>
                <div>
                  <p className="text-lg font-black text-slate-900 uppercase tracking-tighter">Wallet Transfers</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Vodafone Cash, Orange Money, etc.</p>
                </div>
              </div>
              <button 
                onClick={addWallet}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
              >
                <Plus className="h-4 w-4" /> Add Wallet
              </button>
           </div>

           <div className="flex flex-col gap-4">
              {data.wallets.map((wallet: any, i: number) => (
                <div key={i} className="flex gap-4 items-center animate-in fade-in slide-in-from-top-2">
                   <input 
                    placeholder="Wallet Name (e.g. Vodafone)" 
                    value={wallet.name}
                    onChange={(e) => updateWallet(i, 'name', e.target.value)}
                    className="flex-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary" 
                   />
                   <input 
                    placeholder="Mobile Number" 
                    value={wallet.number}
                    onChange={(e) => updateWallet(i, 'number', e.target.value)}
                    className="flex-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-primary" 
                   />
                   <button onClick={() => removeWallet(i)} className="p-4 text-rose-500 hover:bg-rose-50 rounded-2xl transition-colors"><Trash2 className="h-5 w-5" /></button>
                </div>
              ))}
              {data.wallets.length === 0 && <p className="text-center py-6 text-slate-400 text-xs font-bold uppercase italic opacity-50">No wallets added</p>}
           </div>
        </div>

        {/* InstaPay */}
        <div className="p-8 bg-slate-900 rounded-[40px] text-white shadow-xl shadow-slate-900/20">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-6">
                <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center font-black text-rose-400">IP</div>
                <div>
                  <p className="text-lg font-black uppercase tracking-tighter">InstaPay Transfer</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Real-time bank transfers</p>
                </div>
              </div>
              <button 
                onClick={() => setData({ ...data, instaPay: { ...data.instaPay, enabled: !data.instaPay.enabled }})}
                className={cn("h-8 w-14 rounded-full relative transition-colors duration-300", data.instaPay.enabled ? "bg-rose-500" : "bg-white/10")}
              >
                <div className={cn("absolute top-1 h-6 w-6 bg-white rounded-full transition-all duration-300 shadow-sm", data.instaPay.enabled ? "left-7" : "left-1")} />
              </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Payment Address (InstaPay ID)</label>
                 <input 
                  value={data.instaPay.address}
                  onChange={(e) => setData({ ...data, instaPay: { ...data.instaPay, address: e.target.value }})}
                  placeholder="name@instapay" 
                  className="p-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold focus:outline-none focus:border-rose-500" 
                 />
              </div>
              <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1">Mobile Number</label>
                 <input 
                  value={data.instaPay.mobile}
                  onChange={(e) => setData({ ...data, instaPay: { ...data.instaPay, mobile: e.target.value }})}
                  placeholder="01xxxxxxxxx" 
                  className="p-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold focus:outline-none focus:border-rose-500" 
                 />
              </div>
           </div>
        </div>
      </div>

      <button onClick={handleSave} className="w-fit btn-primary px-16 py-5 flex items-center gap-3 uppercase text-sm font-black tracking-widest shadow-2xl shadow-primary/40 hover:scale-105 transition-all">
        <Save className="h-5 w-5" /> Save Configuration
      </button>
    </div>
  );
};

const AccountingView = ({ orders }: { orders: any[] }) => {
  const stats = orders.reduce((acc, curr) => {
    if (curr.status !== 'cancelled') {
      acc.revenue += curr.total || 0;
      acc.count += 1;
    }
    return acc;
  }, { revenue: 0, count: 0 });

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
           <TrendingUp className="h-6 w-6 mb-4 text-emerald-500" />
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
           <p className="text-3xl font-black text-slate-900 tracking-tighter">{formatCurrency(stats.revenue, 'USD')}</p>
        </div>
        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
           <ShoppingBag className="h-6 w-6 mb-4 text-primary" />
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Successful Orders</p>
           <p className="text-3xl font-black text-slate-900 tracking-tighter">{stats.count}</p>
        </div>
        <div className="p-8 bg-slate-900 rounded-3xl border border-slate-100 text-white">
           <BarChart3 className="h-6 w-6 mb-4 text-primary" />
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Average Order Value</p>
           <p className="text-3xl font-black">{formatCurrency(stats.count > 0 ? stats.revenue / stats.count : 0, 'USD')}</p>
        </div>
      </div>
    </div>
  );
};

const CustomersView = ({ customers, onRefresh }: { customers: any[], onRefresh: () => void }) => {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (selectedCustomer) {
      loadCustomerOrders();
    }
  }, [selectedCustomer]);

  const loadCustomerOrders = async () => {
    setLoadingOrders(true);
    try {
      const ords = await adminService.getCustomerOrders(selectedCustomer.id);
      setCustomerOrders(ords || []);
    } finally {
      setLoadingOrders(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {customers.map(customer => (
          <div key={customer.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center text-center group hover:bg-slate-900 hover:scale-[1.02] transition-all duration-500">
             <div className="h-20 w-20 bg-primary/20 rounded-full border-4 border-white shadow-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/40 transition-transform">
               {customer.photoURL ? <img src={customer.photoURL} alt="" className="h-full w-full object-cover rounded-full" /> : <Users className="h-10 w-10 text-primary" />}
             </div>
             <h4 className="text-md font-black text-slate-900 group-hover:text-white uppercase tracking-tight">{customer.displayName || 'Unnamed'}</h4>
             <p className="text-[10px] font-bold text-slate-400 group-hover:text-white/60 uppercase tracking-widest mb-6">{customer.email}</p>
             <button 
              onClick={() => setSelectedCustomer(customer)}
              className="mt-auto px-6 py-2 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg group-hover:bg-primary group-hover:text-white transition-all"
             >
                View Activity
             </button>
          </div>
        ))}
        {customers.length === 0 && <p className="col-span-full py-20 text-center text-slate-400 font-bold uppercase">No customers registered yet</p>}
      </div>

      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedCustomer(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[40px] w-full max-w-2xl relative shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex items-center gap-6">
                   <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                      <Users className="h-8 w-8 text-slate-400" />
                   </div>
                   <div>
                      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{selectedCustomer.displayName}</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedCustomer.email}</p>
                   </div>
                   <button onClick={() => setSelectedCustomer(null)} className="ml-auto p-2 text-slate-400 hover:bg-slate-50 rounded-full"><X /></button>
                </div>

                <div className="p-8 flex-1 overflow-y-auto">
                   <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6">Purchase History</h4>
                   {loadingOrders ? (
                     <div className="py-12 flex justify-center"><div className="h-8 w-8 border-2 border-primary border-t-transparent animate-spin rounded-full" /></div>
                   ) : (
                     <div className="flex flex-col gap-4">
                        {customerOrders.map(order => (
                          <div key={order.id} className="p-5 border border-slate-50 rounded-2xl flex items-center justify-between hover:border-slate-200 transition-colors bg-slate-50/30">
                             <div>
                                <p className="text-xs font-black text-slate-900 uppercase">Order #{order.id.slice(-6).toUpperCase()}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">{order.status}</p>
                             </div>
                             <div className="text-right">
                                <p className="text-sm font-black text-slate-900">{formatCurrency(order.total, 'USD')}</p>
                                <p className="text-[10px] text-slate-400 font-mono italic">{order.createdAt?.toDate?.().toLocaleDateString()}</p>
                             </div>
                          </div>
                        ))}
                        {customerOrders.length === 0 && <p className="text-center py-10 text-slate-400 font-bold uppercase text-xs italic">No orders for this customer</p>}
                     </div>
                   )}
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SettingsView = ({ initialSettings, onRefresh }: { initialSettings: any, onRefresh: () => void }) => {
  const [data, setData] = useState(initialSettings || {
    storeName: 'Zekwa Store',
    storeEmail: 'admin@zekwa.com',
    currency: 'USD',
    language: 'English'
  });

  const handleSave = async () => {
    try {
      await adminService.updateGeneralSettings(data);
      toast.success('General settings updated');
      onRefresh();
    } catch (e) { toast.error('Failed to update'); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="flex flex-col gap-8">
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">General Store Settings</h3>
          <div className="flex flex-col gap-4">
             <div className="flex flex-col gap-2">
               <label className="text-[10px] font-black uppercase text-slate-400">Store Name</label>
               <input 
                type="text" 
                value={data.storeName} 
                onChange={(e) => setData({ ...data, storeName: e.target.value })}
                className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:border-primary" 
               />
             </div>
             <div className="flex flex-col gap-2">
               <label className="text-[10px] font-black uppercase text-slate-400">Store Email</label>
               <input 
                type="email" 
                value={data.storeEmail} 
                onChange={(e) => setData({ ...data, storeEmail: e.target.value })}
                className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:border-primary" 
               />
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-black uppercase text-slate-400">Currency</label>
                 <select 
                  value={data.currency} 
                  onChange={(e) => setData({ ...data, currency: e.target.value })}
                  className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none"
                 >
                   <option value="USD">USD ($)</option>
                   <option value="EGP">EGP (LE)</option>
                   <option value="EUR">EUR (€)</option>
                   <option value="GBP">GBP (£)</option>
                 </select>
               </div>
               <div className="flex flex-col gap-2">
                 <label className="text-[10px] font-black uppercase text-slate-400">Language</label>
                 <select 
                  value={data.language} 
                  onChange={(e) => setData({ ...data, language: e.target.value })}
                  className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none"
                 >
                   <option>English</option>
                   <option>Arabic</option>
                 </select>
               </div>
             </div>
          </div>
        </div>
        <button onClick={handleSave} className="btn-primary w-fit px-12 py-4 text-xs font-black uppercase tracking-widest">
          Save Changes
        </button>
      </div>

      <div className="flex flex-col gap-8">
         <div className="p-8 bg-slate-900 rounded-[32px] text-white">
            <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Store Identity</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">Customize your public brand and how customers perceive your store in checkout and emails.</p>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mb-6">
               <div className="h-full bg-primary w-2/3" />
            </div>
            <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all">Update Branding</button>
         </div>
      </div>
    </div>
  );
};

const CMSView = ({ content, pages, onRefresh }: { content: any, pages: any[], onRefresh: () => void }) => {
  const [data, setData] = useState(content || {
    heroTitle: '',
    heroSubtitle: '',
    heroImage: '',
    banners: []
  });
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);

  const handleSaveContent = async () => {
    try {
      await adminService.updateSiteContent(data);
      toast.success('Site content updated');
      onRefresh();
    } catch (e) { toast.error('Failed to save'); }
  };

  const addBanner = () => {
    setData({ ...data, banners: [...(data.banners || []), { title: '', image: '', link: '' }] });
  };

  const updateBanner = (index: number, field: string, val: string) => {
    const newBanners = [...data.banners];
    newBanners[index] = { ...newBanners[index], [field]: val };
    setData({ ...data, banners: newBanners });
  };

  const removeBanner = (index: number) => {
    const newBanners = [...data.banners];
    newBanners.splice(index, 1);
    setData({ ...data, banners: newBanners });
  };

  const handleDeletePage = async (id: string) => {
    if (!window.confirm('Delete this page?')) return;
    try {
      await adminService.deletePage(id);
      toast.success('Page deleted');
      onRefresh();
    } catch (e) { toast.error('Failed'); }
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
           <div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2">Homepage CMS</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Edit your hero section and banners</p>
           </div>

           <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Hero Title</label>
                <input value={data.heroTitle} onChange={(e) => setData({...data, heroTitle: e.target.value})} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Hero Subtitle</label>
                <input value={data.heroSubtitle} onChange={(e) => setData({...data, heroSubtitle: e.target.value})} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Hero Image URL</label>
                <input value={data.heroImage} onChange={(e) => setData({...data, heroImage: e.target.value})} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-mono font-bold" />
              </div>
           </div>

           <div className="space-y-4">
              <div className="flex items-center justify-between">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Promo Banners</label>
                 <button onClick={addBanner} className="text-[10px] font-black uppercase text-primary">Add Banner</button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                 {data.banners?.map((banner: any, i: number) => (
                   <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4 relative group">
                      <button onClick={() => removeBanner(i)} className="absolute top-4 right-4 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="h-4 w-4" /></button>
                      <input placeholder="Banner Title" value={banner.title} onChange={(e) => updateBanner(i, 'title', e.target.value)} className="w-full bg-transparent border-b border-slate-200 py-2 text-sm font-bold focus:outline-none" />
                      <input placeholder="Image URL" value={banner.image} onChange={(e) => updateBanner(i, 'image', e.target.value)} className="w-full bg-transparent border-b border-slate-200 py-2 text-[10px] font-mono" />
                      <input placeholder="Link (e.g. /products)" value={banner.link} onChange={(e) => updateBanner(i, 'link', e.target.value)} className="w-full bg-transparent border-b border-slate-200 py-2 text-[10px] font-mono" />
                   </div>
                 ))}
              </div>
           </div>

           <button onClick={handleSaveContent} className="btn-primary px-12 py-4 uppercase text-xs font-black tracking-widest">Update Content</button>
        </div>

        <div className="space-y-8">
           <div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2">Dynamic Pages</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Manage Privacy Policy, About Us, etc.</p>
           </div>

           <button 
            onClick={() => { setEditingPage(null); setIsPageModalOpen(true); }}
            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-xs font-black text-slate-400 uppercase tracking-widest hover:border-primary hover:text-primary transition-all"
           >
              Create New Page
           </button>

           <div className="flex flex-col gap-3">
              {pages.map(page => (
                <div key={page.id} className="p-5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-primary transition-colors shadow-sm">
                   <div>
                      <p className="text-sm font-black text-slate-900 uppercase">{page.title}</p>
                      <p className="text-[10px] text-slate-400 font-mono">/{page.slug}</p>
                   </div>
                   <div className="flex items-center gap-2">
                      <button onClick={() => { setEditingPage(page); setIsPageModalOpen(true); }} className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => handleDeletePage(page.id)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      <AnimatePresence>
        {isPageModalOpen && (
          <PageForm 
            page={editingPage} 
            onClose={() => setIsPageModalOpen(false)} 
            onRefresh={onRefresh} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const PageForm = ({ page, onClose, onRefresh }: any) => {
  const [formData, setFormData] = useState({
    title: page?.title || '',
    slug: page?.slug || '',
    content: page?.content || '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (page) await adminService.updatePage(page.id, formData);
      else await adminService.addPage(formData);
      toast.success('Page saved');
      onRefresh();
      onClose();
    } catch (e) { toast.error('Failed'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[40px] w-full max-w-2xl relative p-10 shadow-2xl">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-8 leading-none">{page ? 'Edit Page' : 'Create Page'}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
           <div className="grid grid-cols-2 gap-4">
             <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-400 pl-1">Page Title</label>
                <input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
             </div>
             <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-400 pl-1">Slug (e.g. privacy-policy)</label>
                <input required value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold" />
             </div>
           </div>
           <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-slate-400 pl-1">Page Content (HTML/Markdown)</label>
              <textarea rows={10} required value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium font-mono" />
           </div>
           <div className="flex gap-4">
             <button type="submit" disabled={submitting} className="flex-1 btn-primary py-4 uppercase text-xs font-black tracking-widest text-white">{submitting ? '...' : 'Save Page'}</button>
             <button type="button" onClick={onClose} className="px-8 py-4 bg-slate-100 rounded-2xl text-xs font-black">Cancel</button>
           </div>
        </form>
      </motion.div>
    </div>
  );
};
