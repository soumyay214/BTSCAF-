import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Coffee, MapPin, Clock, Bell, BellOff, Navigation, CheckCircle, Package, Truck, Home, Star, Sparkles, ShoppingBag } from "lucide-react";
import { cn, formatCurrency } from "@/src/lib/utils";
import { useNotificationStore } from "@/src/lib/store";
import { useOrderStore, OrderStatus } from "@/src/lib/orderStore";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

type TrackingStep = "confirmed" | "preparing" | "out-for-delivery" | "delivered";

export default function Tracking() {
  const [courierRating, setCourierRating] = useState(0);
  const { activeOrder, clearOrder } = useOrderStore();
  const [step, setStep] = useState<TrackingStep>("confirmed");
  const [eta, setEta] = useState(15);
  const [isNotified, setIsNotified] = useState(false);
  const [hasNotified, setHasNotified] = useState(false);
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (!activeOrder) return;

    const calculateStatus = () => {
      const now = Date.now();
      const diffInMinutes = Math.floor((now - activeOrder.timestamp) / 60000);

      let currentStep: TrackingStep = "confirmed";
      let currentEta = 15;

      if (diffInMinutes >= 15) {
        currentStep = "delivered";
        currentEta = 0;
      } else if (diffInMinutes >= 5) {
        currentStep = "out-for-delivery";
        currentEta = 15 - diffInMinutes;
      } else if (diffInMinutes >= 1) {
        currentStep = "preparing";
        currentEta = 15 - diffInMinutes;
      } else {
        currentStep = "confirmed";
        currentEta = 15;
      }

      setStep(currentStep);
      setEta(currentEta);

      // Notify if just delivered and tracking page is open
      if (currentStep === "delivered" && isNotified && !hasNotified) {
        setHasNotified(true);
        addNotification("Order Delivered! 💜", "Your BTS Cafe treasures have arrived at your door!");
        toast.success("Delivery confirmed! Enjoy your coffee! ☕", { duration: 5000 });
      }
    };

    calculateStatus();
    const interval = setInterval(calculateStatus, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [activeOrder, isNotified, addNotification]);

  if (!activeOrder) {
    return (
      <div className="bg-bts-cream min-h-screen pt-12 pb-32 flex flex-col items-center justify-center p-6 text-center space-y-8">
        <div className="w-24 h-24 bg-bts-purple/10 rounded-full flex items-center justify-center">
          <ShoppingBag className="w-12 h-12 text-bts-purple" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-4xl font-bold">No Active Order</h1>
          <p className="text-bts-black/50 font-light max-w-sm">Looks like you haven't placed an order yet. Head over to our menu and treat yourself! 💜</p>
        </div>
        <Link to="/menu" className="bg-bts-black text-white px-8 py-4 rounded-3xl font-bold hover:scale-105 transition-transform">
          Browse Menu
        </Link>
      </div>
    );
  }

  const steps = [
    { id: "confirmed", label: "Confirmed", icon: CheckCircle },
    { id: "preparing", label: "Preparing", icon: Coffee },
    { id: "out-for-delivery", label: "On the Way", icon: Truck },
    { id: "delivered", label: "Delivered", icon: Home },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);

  return (
    <div className="bg-bts-cream min-h-screen pt-12 pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="font-display text-5xl font-bold">Track Your <span className="text-bts-purple-dark italic">Magic</span></h1>
            <p className="text-bts-black/50 font-light">Order ID: <span className="font-mono font-bold text-bts-black">#{activeOrder.id}</span></p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-bts-black/40">Estimated Arrival</p>
            <div className="flex items-center justify-center md:justify-end space-x-2">
              <Clock className="w-5 h-5 text-bts-purple" />
              <span className="text-3xl font-display font-bold text-bts-purple-dark">
                {step === "delivered" ? "Now" : `${eta} mins`}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Tracking View */}
          <div className="lg:col-span-2 space-y-8">
            <section className="glass rounded-[40px] p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Navigation className="w-48 h-48 text-bts-purple" />
              </div>

              <div className="relative z-10 space-y-12">
                {/* Status Header */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-bts-purple-dark text-center md:text-left">Current Status</p>
                  <h2 className="text-3xl md:text-4xl font-bold text-center md:text-left">
                    {step === "confirmed" && "Order Confirmed"}
                    {step === "preparing" && "Brewing Your Happiness"}
                    {step === "out-for-delivery" && "Out for Delivery"}
                    {step === "delivered" && "Delivered Successfully"}
                  </h2>
                </div>

                {/* Tracking Progress Bar */}
                <div className="relative pt-8 px-4">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-bts-purple/10 -translate-y-1/2 rounded-full" />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                    className="absolute top-1/2 left-0 h-1 bg-bts-purple -translate-y-1/2 rounded-full z-10"
                    transition={{ duration: 1.5, ease: "circOut" }}
                  />
                  
                  <div className="relative flex justify-between">
                    {steps.map((s, idx) => {
                      const Icon = s.icon;
                      const isActive = idx <= currentStepIndex;
                      const isCurrent = idx === currentStepIndex;

                      return (
                        <div key={s.id} className="flex flex-col items-center space-y-4">
                          <motion.div 
                            initial={false}
                            animate={{ 
                              scale: isCurrent ? 1.2 : 1,
                              backgroundColor: isActive ? "#F7B5FF" : "rgba(255, 255, 255, 0.8)",
                              color: isActive ? "#000" : "rgba(0, 0, 0, 0.2)"
                            }}
                            className={cn(
                              "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg z-20 transition-colors",
                              isActive && "ring-4 ring-white"
                            )}
                          >
                            <Icon className={cn("w-5 h-5 md:w-6 md:h-6", isCurrent && "animate-pulse")} />
                          </motion.div>
                          <span className={cn(
                            "text-[8px] md:text-[10px] font-bold uppercase tracking-widest transition-colors",
                            isActive ? "text-bts-black" : "text-bts-black/20"
                          )}>
                            {s.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Map Visual (Artistic) */}
                <div className="h-48 glass rounded-[32px] relative overflow-hidden border border-white/20 bg-bts-purple/5">
                   <div className="absolute inset-0 opacity-10">
                      <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #6d28d9 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                   </div>
                   
                   {/* Animated Route Line */}
                   <svg className="absolute inset-0 w-full h-full pointer-events-none p-12">
                      <motion.path 
                        d="M 50,100 C 150,150 250,50 350,100 C 450,150 550,50 650,100"
                        fill="none"
                        stroke="rgba(109, 40, 217, 0.1)"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <motion.path 
                        d="M 50,100 C 150,150 250,50 350,100 C 450,150 550,50 650,100"
                        fill="none"
                        stroke="#F7B5FF"
                        strokeWidth="4"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: currentStepIndex / (steps.length - 1) }}
                        transition={{ duration: 2 }}
                      />
                   </svg>

                   <div className="absolute inset-0 flex items-center justify-between px-12">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                        <Coffee className="w-5 h-5 text-bts-purple" />
                      </div>
                      
                      {step === "out-for-delivery" && (
                        <motion.div 
                          animate={{ 
                            x: [0, 20, 0],
                            y: [0, -10, 0]
                          }}
                          transition={{ duration: 4, repeat: Infinity }}
                          className="w-10 h-10 bg-bts-purple text-bts-black rounded-full flex items-center justify-center shadow-xl"
                        >
                          <Truck className="w-5 h-5" />
                        </motion.div>
                      )}

                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                        <Home className="w-5 h-5 text-bts-purple-dark" />
                      </div>
                   </div>

                   <p className="absolute bottom-4 left-0 w-full text-center text-[10px] uppercase font-bold tracking-[0.2em] text-bts-black/30">
                     Live Route Map Tracking
                   </p>
                </div>
              </div>
            </section>

            {/* Courier Info */}
            <section className="glass rounded-[40px] p-8 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/40">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 rounded-full border-4 border-white shadow-xl overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200" alt="Courier" className="w-full h-full object-cover" />
                  {step === "delivered" && (
                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-bts-black/40">Your Delivery Partner</p>
                   <h3 className="text-xl font-bold">Ji-hun Kim</h3>
                   {step !== "delivered" ? (
                     <div className="flex items-center space-x-1 text-bts-purple-dark">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs font-bold font-mono">4.9 / 5.0</span>
                     </div>
                   ) : (
                     <div className="flex flex-col gap-2">
                       <p className="text-[10px] font-bold text-bts-purple-dark uppercase tracking-tighter">Rate his service:</p>
                       <div className="flex gap-1">
                         {[1, 2, 3, 4, 5].map((s) => (
                           <button 
                             key={s} 
                             onClick={() => setCourierRating(s)}
                             className="transition-transform active:scale-90"
                           >
                             <Star className={cn("w-5 h-5", s <= courierRating ? "text-yellow-400 fill-current" : "text-gray-300")} />
                           </button>
                         ))}
                       </div>
                     </div>
                   )}
                </div>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                {step === "delivered" ? (
                  <button 
                    onClick={() => {
                      if (courierRating === 0) {
                        toast.error("Please rate your delivery partner 💜");
                        return;
                      }
                      toast.success("Thank you for your feedback! Order completed. 💜");
                      clearOrder();
                    }}
                    className="flex-grow md:flex-grow-0 bg-bts-purple text-bts-black px-10 py-4 rounded-3xl font-bold hover:shadow-xl transition-all hover:scale-105"
                  >
                    Complete & Finish
                  </button>
                ) : (
                  <button className="flex-grow md:flex-grow-0 bg-bts-black text-white px-8 py-4 rounded-3xl font-bold hover:shadow-xl transition-all">
                    Contact Courier
                  </button>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
             <section className="glass rounded-[40px] p-6 space-y-4">
                <button 
                  onClick={() => {
                    setIsNotified(!isNotified);
                    if (!isNotified) toast.success("We'll notify you when it arrives! 💜");
                  }}
                  className={cn(
                    "w-full p-4 rounded-3xl border transition-all flex items-center justify-between group",
                    isNotified ? "bg-bts-purple/10 border-bts-purple shadow-inner" : "bg-white/40 border-transparent hover:border-bts-purple/20"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <div className={cn("p-2 rounded-xl transition-colors", isNotified ? "bg-bts-purple text-bts-black" : "bg-bts-gray text-bts-black/40")}>
                      {isNotified ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                    </div>
                    <div className="text-left">
                       <p className={cn("text-xs font-bold", isNotified ? "text-bts-black" : "text-bts-black/60")}>
                         Arrival Notification
                       </p>
                       <p className="text-[9px] font-light text-bts-black/40">Ping when delivered</p>
                    </div>
                  </div>
                  <div className={cn(
                    "w-10 h-5 rounded-full p-1 transition-colors relative",
                    isNotified ? "bg-bts-purple" : "bg-bts-black/10"
                  )}>
                    <motion.div 
                      animate={{ x: isNotified ? 20 : 0 }}
                      className="w-3 h-3 bg-white rounded-full shadow-sm" 
                    />
                  </div>
                </button>

                <div className="p-6 bg-bts-black text-white rounded-[32px] space-y-4">
                   <h3 className="text-sm font-bold flex items-center space-x-2">
                      <Package className="w-4 h-4 text-bts-purple" />
                      <span>Order Summary</span>
                   </h3>
                   <div className="space-y-3">
                      {activeOrder.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-xs text-white/60">
                          <span className="truncate max-w-[120px]">{item.name}</span>
                          <span>x{item.quantity}</span>
                        </div>
                      ))}
                      <div className="pt-3 border-t border-white/10 flex justify-between">
                         <span className="text-xs font-bold">Total Paid</span>
                         <span className="font-display font-bold text-bts-purple">{formatCurrency(activeOrder.total)}</span>
                      </div>
                   </div>
                </div>

                <div className="text-center">
                   <p className="text-[10px] text-bts-black/40 font-light italic">Need help? <a href="#" className="underline hover:text-bts-purple">Chat with support</a></p>
                </div>
             </section>

             <motion.div 
               animate={{ 
                 y: [0, -10, 0],
                 rotate: [0, 2, 0]
               }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="glass rounded-[40px] p-8 bg-bts-purple text-bts-black text-center space-y-4 shadow-2xl relative overflow-hidden"
             >
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/20 rounded-full blur-3xl" />
                <Sparkles className="w-12 h-12 mx-auto" />
                <p className="font-bold text-sm leading-relaxed">
                  "Life is like a cup of coffee. It's all in how you make it, but the ingredients are the most important part."
                </p>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-40">— RM 💜</p>
             </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
