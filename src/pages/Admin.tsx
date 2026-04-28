import React, { useState, useEffect } from "react";
import { Coffee, Users, ShoppingBag, BarChart3, Package, CheckCircle, Clock, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { formatCurrency, cn } from "@/src/lib/utils";
import { motion } from "motion/react";
import { useProductStore } from "@/src/lib/productStore";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const { products, toggleAvailability } = useProductStore();

  return (
    <div className="bg-bts-gray min-h-screen pt-8 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold">Admin <span className="text-bts-purple-dark italic">Dashboard</span></h1>
            <p className="text-bts-black/50 text-sm">Welcome back, manager. Here's your overview.</p>
          </div>
          <div className="flex glass rounded-2xl p-1 shadow-sm border border-white/20">
            <button 
              onClick={() => setActiveTab("orders")}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === "orders" ? 'bg-bts-black text-white shadow-lg' : 'hover:bg-white/40'}`}
            >
              <Package className="w-4 h-4" />
              <span>Orders</span>
            </button>
            <button 
              onClick={() => setActiveTab("products")}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === "products" ? 'bg-bts-black text-white shadow-lg' : 'hover:bg-white/40'}`}
            >
              <Coffee className="w-4 h-4" />
              <span>Menu</span>
            </button>
            <button 
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === "analytics" ? 'bg-bts-black text-white shadow-lg' : 'hover:bg-white/40'}`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Daily Sales" value={formatCurrency(1240.50)} subtitle="+12% from yesterday" icon={<BarChart3 className="text-bts-purple-dark" />} />
          <StatCard title="Total Orders" value="48" subtitle="5 pending verification" icon={<ShoppingBag className="text-bts-purple-dark" />} />
          <StatCard title="Active Customers" value="842" subtitle="+24 this week" icon={<Users className="text-bts-purple-dark" />} />
          <StatCard title="Popular Item" value="Purple Dream" subtitle="12 sold today" icon={<StarIcon className="text-bts-purple-dark" />} />
        </div>

        {/* Content Area */}
        <div className="glass rounded-[32px] p-8 shadow-xl border border-white/30 min-h-[400px]">
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Recent Orders</h2>
                <button className="text-bts-purple-dark text-sm font-bold uppercase tracking-widest hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-bts-gray text-bts-black/40 text-xs font-bold uppercase tracking-wider">
                      <th className="pb-4 pt-2">ID</th>
                      <th className="pb-4 pt-2">Customer</th>
                      <th className="pb-4 pt-2">Items</th>
                      <th className="pb-4 pt-2">Total</th>
                      <th className="pb-4 pt-2">Status</th>
                      <th className="pb-4 pt-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-bts-gray">
                    {mockOrders.map((o) => (
                      <tr key={o.id} className="text-sm">
                        <td className="py-4 font-mono text-gray-400">#{o.id}</td>
                        <td className="py-4 font-medium">{o.customer}</td>
                        <td className="py-4 text-bts-black/60">{o.items} items</td>
                        <td className="py-4 font-bold">{formatCurrency(o.total)}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            o.status === 'ready' ? 'bg-green-100 text-green-600' : 
                            o.status === 'preparing' ? 'bg-blue-100 text-blue-600' : 
                            'bg-amber-100 text-amber-600'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="py-4">
                          <button className="bg-bts-gray px-4 py-2 rounded-xl text-xs font-bold hover:bg-bts-black hover:text-white transition-all">Update</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Manage Menu Products</h2>
                <div className="flex gap-2">
                  <button className="bg-bts-black text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
                    <Plus className="w-4 h-4" />
                    <span>Add New</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {products.map((p) => (
                  <div key={p.id} className="glass p-4 rounded-3xl border border-white/40 flex items-center justify-between group">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-inner">
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{p.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-bts-black/40 uppercase font-bold tracking-widest">{p.category}</span>
                          <span className="text-[10px] text-bts-purple-dark font-bold">{formatCurrency(p.price)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="flex flex-col items-end">
                        <span className={cn(
                          "text-[10px] font-bold uppercase tracking-widest mb-1",
                          p.isAvailable ? "text-green-500" : "text-red-400"
                        )}>
                          {p.isAvailable ? "Available" : "Unavailable"}
                        </span>
                        <div 
                          onClick={() => toggleAvailability(p.id)}
                          className={cn(
                            "w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300",
                            p.isAvailable ? "bg-bts-purple" : "bg-gray-300"
                          )}
                        >
                          <motion.div 
                            animate={{ x: p.isAvailable ? 24 : 0 }}
                            className="w-4 h-4 bg-white rounded-full shadow-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-bts-black transition-colors rounded-lg hover:bg-white/50">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "analytics" && (
             <div className="p-8 bg-bts-purple/5 rounded-2xl border border-bts-purple/10 flex items-center justify-center">
                <BarChart3 className="w-12 h-12 text-bts-purple-dark mr-4" />
                <p className="text-bts-purple-dark font-medium italic">Advanced sales projections and loyalty reports are currently loading...</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, subtitle, icon }: any) => (
  <div className="glass p-6 rounded-3xl shadow-sm border border-white/30 space-y-2 card-hover">
    <div className="flex justify-between items-start">
      <div className="w-10 h-10 bg-bts-purple/10 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest bg-green-50 px-2 py-1 rounded-lg">Live</span>
    </div>
    <div className="pt-2">
      <p className="text-bts-black/40 text-xs font-semibold uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-display font-bold">{value}</p>
      <p className="text-[10px] text-bts-black/30 pt-1">{subtitle}</p>
    </div>
  </div>
);

const StarIcon = ({ className }: any) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);

const mockOrders = [
  { id: "A2B4", customer: "Kim Se-ok", items: 3, total: 24.50, status: "preparing" },
  { id: "C9D1", customer: "Park Min-young", items: 1, total: 6.50, status: "ready" },
  { id: "F5G8", customer: "Lee Su-ho", items: 5, total: 42.00, status: "pending" },
  { id: "H3J2", customer: "Choi Ha-neul", items: 2, total: 15.75, status: "preparing" },
];
