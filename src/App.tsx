import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart, User, Menu, X, Coffee, Sparkles, MessageCircle, ArrowRight, ShoppingBag, Plus, Minus, CheckCircle, Sun, Moon, History, Star, Heart, Bell, Navigation } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { useAuthStore, useCartStore, useNotificationStore, useThemeStore } from "@/src/lib/store";
import { useProductStore } from "@/src/lib/productStore";
import { useOrderStore } from "@/src/lib/orderStore";
import { auth, googleProvider, db } from "@/src/lib/firebase";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { cn, formatCurrency } from "@/src/lib/utils";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Pages
import Home from "@/src/pages/Home";
import MenuPage from "@/src/pages/Menu";
import AdminDashboard from "@/src/pages/Admin";
import Profile from "@/src/pages/Profile";
import Tracking from "@/src/pages/Tracking";

// Components
// Removed MusicPlayer import

const ThemeManager = () => {
  const { primaryColor, accentColor, fontFamily } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', primaryColor);
    
    // Generate a darker shade for primary
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };
    
    const rgb = hexToRgb(primaryColor);
    if (rgb) {
      const darken = 0.8;
      root.style.setProperty('--primary-color-dark', `rgb(${rgb.r * darken}, ${rgb.g * darken}, ${rgb.b * darken})`);
    }

    root.style.setProperty('--accent-color', accentColor);
    
    // Set font family
    const fontMap = {
      'sans': '"Inter", ui-sans-serif, system-ui, sans-serif',
      'serif': '"Playfair Display", serif',
      'mono': '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace'
    };
    root.style.setProperty('--font-family-body', fontMap[fontFamily]);
  }, [primaryColor, accentColor, fontFamily]);

  return null;
};

const UserMenu = ({ onLogout }: { onLogout: () => void }) => {
  const { user } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 group p-1 glass rounded-full hover:bg-white transition-all shadow-sm"
      >
        <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full border border-bts-purple group-hover:ring-2 ring-bts-purple transition-all" />
        <Menu className="w-4 h-4 text-bts-black/60 hidden sm:block" />
      </button>

      <AnimatePresence>
        {isDropdownOpen && (
          <>
            <div className="fixed inset-0 z-[80]" onClick={() => setIsDropdownOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-56 glass z-[90] shadow-2xl rounded-2xl overflow-hidden border border-white/40 p-2"
            >
              <div className="px-4 py-3 border-b border-bts-purple/10 mb-2">
                <p className="text-sm font-bold truncate text-bts-black">{user.displayName}</p>
                <p className="text-[10px] text-bts-black/40 font-mono truncate">{user.email}</p>
              </div>

              <div className="space-y-1">
                <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center space-x-3 px-4 py-2.5 hover:bg-bts-purple/10 rounded-xl transition-colors text-sm font-medium">
                  <User className="w-4 h-4" />
                  <span>Profile Settings</span>
                </Link>
                <div className="h-px bg-bts-purple/10 my-2" />
                <button onClick={onLogout} className="w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-red-50 text-red-500 rounded-xl transition-colors text-sm font-bold">
                  <X className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = ({ onCartOpen, onReset }: { onCartOpen: () => void, onReset: () => void }) => {
  const { user, setUser } = useAuthStore();
  const { items } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Please try again.");
    }
  };

  const logout = () => {
    signOut(auth);
    setUser(null);
    toast.success("Logged out successfully.");
  };

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { notifications, clearNotifications } = useNotificationStore();

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-bts-purple rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform shadow-sm">
              <Coffee className="text-white w-6 h-6" />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight text-bts-black">
              BTS <span className="text-bts-purple-dark italic">CAFÉ</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={cn("text-sm font-medium hover:text-bts-purple-dark transition-colors", location.pathname === "/" && "text-bts-purple-dark")}>Home</Link>
            <Link to="/menu" className={cn("text-sm font-medium hover:text-bts-purple-dark transition-colors", location.pathname === "/menu" && "text-bts-purple-dark")}>Menu</Link>
            <a href="/#about" className="text-sm font-medium hover:text-bts-purple-dark transition-colors">Our Story</a>
            <div className="flex items-center space-x-2 relative">
              <a href="#contact" className="text-sm font-medium hover:text-bts-purple-dark transition-colors">Contact</a>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-1 text-bts-purple-dark hover:scale-110 transition-transform"
              >
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-[80]" onClick={() => setIsNotificationsOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-4 w-80 bg-[#F3E8FF] z-[90] shadow-2xl rounded-2xl overflow-hidden border border-bts-purple/40 p-5 font-sans backdrop-blur-lg"
                    >
                      <div className="flex items-center justify-between mb-4 border-b border-bts-purple/20 pb-2">
                        <h4 className="font-bold text-sm flex items-center space-x-2 text-bts-purple-dark">
                          <span>Notifications</span>
                          {notifications.length > 0 && <span className="text-[10px] bg-bts-purple-dark text-white px-2 py-0.5 rounded-full">{notifications.length}</span>}
                        </h4>
                        {notifications.length > 0 && (
                          <button 
                            onClick={clearNotifications}
                            className="text-[10px] font-bold text-bts-purple-dark hover:text-bts-black transition-colors"
                          >
                            Clear All
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-3 max-h-[350px] overflow-y-auto no-scrollbar">
                        {notifications.length > 0 ? (
                          notifications.map(n => (
                            <div key={n.id} className="p-3 bg-white/60 rounded-xl hover:bg-white/90 transition-colors cursor-pointer border border-transparent hover:border-bts-purple/30 group">
                              <p className="text-xs font-bold text-bts-black group-hover:text-bts-purple-dark transition-colors">{n.title}</p>
                              <p className="text-[10px] text-bts-black/80 mt-1 leading-relaxed">{n.message}</p>
                              <p className="text-[9px] text-bts-purple-dark mt-2 font-mono uppercase tracking-wider">{n.time}</p>
                            </div>
                          ))
                        ) : (
                          <div className="py-8 text-center space-y-2">
                            <Sparkles className="w-8 h-8 text-bts-purple/50 mx-auto" />
                            <p className="text-xs text-bts-purple-dark/60 italic">No new notifications. Everything's purple! 💜</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-sm font-medium hover:text-bts-purple-dark transition-colors">Admin</Link>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <Link 
              to="/tracking" 
              className="hidden md:flex items-center space-x-2 px-4 py-2 glass rounded-full text-xs font-bold text-bts-purple-dark hover:bg-white transition-all uppercase tracking-widest"
            >
              <History className="w-4 h-4" />
              <span>Track Order</span>
            </Link>

            <motion.button 
              key={cartCount}
              initial={{ scale: 1 }}
              animate={{ scale: cartCount > 0 ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.3 }}
              onClick={onCartOpen}
              className="relative p-2 glass rounded-full transition-all hover:bg-white"
            >
              <ShoppingCart className="w-6 h-6 text-bts-black" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-bts-purple-dark text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </motion.button>

            {user ? (
              <UserMenu onLogout={logout} />
            ) : (
              <button 
                onClick={login}
                className="bg-bts-black text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-bts-purple-dark transition-all shadow-lg hover:shadow-bts-purple/20"
              >
                Login
              </button>
            )}
            
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-bts-cream border-b border-bts-purple/10 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium">Home</Link>
              <Link to="/menu" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium">Menu</Link>
              <a href="/#about" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium">Our Story</a>
              <div className="flex items-center justify-between">
                <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">Contact</a>
                <div className="flex items-center space-x-2 bg-bts-purple/10 px-3 py-1 rounded-full">
                  <Bell className="w-4 h-4 text-bts-purple-dark" />
                  <span className="text-xs font-bold text-bts-purple-dark">{notifications.length > 0 ? notifications.length : '0'}</span>
                </div>
              </div>
              {!user && <button onClick={login} className="w-full text-left text-lg font-medium text-bts-purple-dark">Sign In</button>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default function App() {
  const { setUser } = useAuthStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show loading screen briefly
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          const userRef = doc(db, "users", authUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            setUser(userSnap.data() as any);
          } else {
            const newUser = {
              uid: authUser.uid,
              email: authUser.email || "",
              displayName: authUser.displayName || "User",
              photoURL: authUser.photoURL || "",
              role: "customer" as const,
              loyaltyPoints: 0,
              savedAddresses: []
            };
            await setDoc(userRef, newUser);
            setUser(newUser as any);
          }
        } catch (error) {
          const isOffline = error instanceof Error && error.message.includes('offline');
          if (!isOffline) {
            console.warn("Firestore sync deferred (using local profile):", error);
          }
          
          // Fallback to basic auth info if firestore is unreachable or offline
          setUser({
            uid: authUser.uid,
            email: authUser.email || "",
            displayName: authUser.displayName || "User",
            photoURL: authUser.photoURL || "",
            role: "customer",
            loyaltyPoints: 0,
            savedAddresses: []
          });
        }
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, [setUser]);

  return (
    <Router>
      <ThemeManager />
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loader" />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Toaster position="bottom-right" />
            <Navbar onCartOpen={() => setIsCartOpen(true)} onReset={() => {}} />
            <main className="min-h-screen">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/tracking" element={<Tracking />} />
              </Routes>
            </main>
            <BrewBot />
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </Router>
  );
}

const LoadingScreen = () => {
  return (
    <motion.div 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#F5F3FF] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Cherry Blossoms */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(24)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              top: -20, 
              left: `${Math.random() * 100}%`,
              rotate: 0,
              opacity: 0
            }}
            animate={{ 
              top: '110%',
              left: `${(Math.random() * 100) + (Math.random() * 20 - 10)}%`,
              rotate: 360,
              opacity: [0, 1, 1, 0]
            }}
            transition={{ 
              duration: Math.random() * 5 + 5, 
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
            className="absolute"
          >
            <div className="w-4 h-4 bg-[#FFD1DC] rounded-full blur-[1px] transform rotate-45 scale-x-75 opacity-80" />
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="text-center space-y-6 relative z-10"
      >
        <div className="w-24 h-24 bg-bts-purple rounded-full flex items-center justify-center mx-auto shadow-2xl relative">
          <Coffee className="text-white w-12 h-12" />
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-bts-purple rounded-full -z-10 opacity-30"
          />
        </div>
        <div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tighter text-bts-black mb-2">
            Welcome to <span className="text-bts-purple-dark italic">BTS CAFÉ</span>
          </h1>
          <motion.div 
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-bts-purple-dark font-mono text-sm tracking-[0.3em] uppercase"
          >
            Brewing Magic in Seoul...
          </motion.div>
        </div>
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-bts-purple rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-bts-purple rounded-full animate-bounce [animation-delay:0.2s]" />
          <div className="w-2 h-2 bg-bts-purple rounded-full animate-bounce [animation-delay:0.4s]" />
        </div>
      </motion.div>
    </motion.div>
  );
};

const Footer = () => (
  <footer id="contact" className="bg-bts-black text-bts-cream pt-20 pb-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Coffee className="text-bts-purple w-8 h-8" />
            <span className="font-display text-2xl font-bold tracking-tight text-white">BTS <span className="text-bts-purple italic">CAFÉ</span></span>
          </div>
          <p className="text-white/60 leading-relaxed font-light">
            Bringing the essence of specialty coffee to Chandigarh. Brewed with love, served with soul.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-6 text-bts-purple">Explore</h4>
          <ul className="space-y-4 text-white/60 font-light">
            <li><Link to="/menu" className="hover:text-bts-purple transition-colors">Our Menu</Link></li>
            <li><a href="/#about" className="hover:text-bts-purple transition-colors">Our Story</a></li>
            <li><a href="/#locations" className="hover:text-bts-purple transition-colors">Find a Café</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-6 text-bts-purple">Contact Us</h4>
          <ul className="space-y-4 text-white/60 font-light">
            <li className="flex items-center space-x-2"><Star className="w-3 h-3 text-bts-purple" /> <span>Ind, Chandigarh</span></li>
            <li className="flex items-center space-x-2"><Heart className="w-3 h-3 text-bts-purple" /> <span>hello@btscafe.com</span></li>
            <li className="flex items-center space-x-2"><Plus className="w-3 h-3 text-bts-purple" /> <span>+91 76960-20701</span></li>
          </ul>
        </div>
      </div>
      <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-white/20 uppercase tracking-[0.2em]">
        <p>&copy; 2026 BTS CAFÉ. Purple your life. 💜</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-bts-purple">Privacy Policy</a>
          <a href="#" className="hover:text-bts-purple">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);

const CartDrawer = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { items, updateQuantity, total, clearCart } = useCartStore();
  const { setOrder } = useOrderStore();
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'COD'>('CARD');
  const [isOrdered, setIsOrdered] = useState(false);
  const [rating, setRating] = useState(0);

  const handleCheckout = async () => {
    toast.loading("Confirming your order... 💜");
    
    // Simulate checkout process
    setTimeout(() => {
      toast.dismiss();
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3");
      audio.play().catch(() => {});
      
      // Save the active order for real-time tracking
      setOrder({
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        timestamp: Date.now(),
        items: items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
        total: total()
      });

      setIsOrdered(true);
      clearCart();
      toast.success("Order Confirmed! Your caffeine is on the way. ☕");
    }, 2000);
  };

  const handleRating = (stars: number) => {
    setRating(stars);
    toast.success(`Thank you for rating us ${stars} stars! 💜`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-bts-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md glass z-[70] shadow-2xl flex flex-col border-l border-white/30"
          >
            {isOrdered ? (
              <div className="flex-grow flex flex-col items-center justify-center p-12 text-center space-y-8">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <CheckCircle className="text-green-500 w-12 h-12" />
                </motion.div>
                <div className="space-y-4">
                  <h2 className="font-display text-4xl font-bold">Annyeong! 💜</h2>
                  <p className="text-bts-black/60 font-light leading-relaxed">
                    Your order has been received! Our baristas are meticulously crafting your signature brew.
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-bts-purple/10 w-full">
                  <p className="text-sm font-bold uppercase tracking-widest text-bts-purple-dark">Rate your experience</p>
                  <div className="flex justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        onClick={() => handleRating(star)}
                        className="hover:scale-110 transition-transform"
                      >
                        <Star className={cn("w-8 h-8", rating >= star ? "text-bts-purple fill-current" : "text-bts-purple/20")} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 w-full">
                  <Link 
                    to="/tracking"
                    onClick={() => { setIsOrdered(false); onClose(); setRating(0); }}
                    className="w-full bg-bts-purple text-bts-black py-4 rounded-2xl font-bold shadow-xl hover:bg-bts-purple-dark transition-all flex items-center justify-center space-x-2"
                  >
                    <Navigation className="w-5 h-5" />
                    <span>Track My Order Now</span>
                  </Link>
                  <button 
                    onClick={() => { setIsOrdered(false); onClose(); setRating(0); }} 
                    className="w-full bg-bts-black text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-bts-purple-dark transition-all"
                  >
                    Back to Cafe
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-white/20 flex justify-between items-center bg-bts-purple/5">
                  <div className="flex items-center space-x-3">
                    <ShoppingBag className="text-bts-purple-dark w-6 h-6" />
                    <h2 className="font-display text-2xl font-bold">Your <span className="text-bts-purple-dark italic">Bag</span></h2>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-bts-purple/10 rounded-full transition-colors"><X className="w-6 h-6" /></button>
                </div>

                <div className="flex-grow overflow-y-auto p-6 space-y-8 no-scrollbar">
                  {items.length === 0 ? (
                    <div className="text-center py-20 space-y-4">
                      <Coffee className="w-16 h-16 text-bts-purple/20 mx-auto" />
                      <p className="text-bts-black/40 font-light italic">Your bag is currently empty. Time for coffee?</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-6">
                        {items.map((item) => (
                          <div key={item.id} className="flex space-x-4 border-b border-bts-gray pb-6">
                            <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-2xl border border-white/20 shadow-sm" />
                            <div className="flex-grow space-y-2">
                              <div className="flex justify-between items-start">
                                <h4 className="font-bold text-sm">{item.name}</h4>
                                <span className="font-semibold text-bts-purple-dark text-sm">{formatCurrency(item.price * item.quantity)}</span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-bts-purple/10 rounded-md transition-colors"><Minus className="w-4 h-4" /></button>
                                <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-bts-purple/10 rounded-md transition-colors"><Plus className="w-4 h-4" /></button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-bts-black/40">Select Payment Method</h3>
                        <div className="grid grid-cols-1 gap-2">
                          {[
                            { id: 'UPI', label: 'UPI / GPay / PhonePe', icon: '⚡' },
                            { id: 'CARD', label: 'Credit / Debit Card', icon: '💳' },
                            { id: 'COD', label: 'Cash on Delivery', icon: '💵' }
                          ].map((method) => (
                            <button 
                              key={method.id}
                              onClick={() => setPaymentMethod(method.id as any)}
                              className={cn(
                                "flex items-center justify-between p-4 rounded-2xl border transition-all text-left",
                                paymentMethod === method.id ? "bg-bts-black text-white border-bts-black shadow-lg" : "glass border-transparent hover:bg-white/60"
                              )}
                            >
                              <div className="flex items-center space-x-3">
                                <span className="text-xl">{method.icon}</span>
                                <span className="text-sm font-semibold">{method.label}</span>
                              </div>
                              <div className={cn("w-4 h-4 rounded-full border-2", paymentMethod === method.id ? "bg-bts-purple border-bts-purple" : "border-bts-black/20")} />
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="p-6 border-t border-white/20 space-y-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-bts-black/40 uppercase tracking-widest font-bold">Total Amount</p>
                      <p className="text-3xl font-display font-bold">{formatCurrency(total())}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-bts-purple-dark font-bold uppercase tracking-widest">+ {Math.floor(total() * 5)} Points</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    disabled={items.length === 0}
                    className="w-full bg-bts-black text-bts-cream py-5 rounded-2xl font-bold text-lg hover:bg-bts-purple-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
                  >
                    Confirm Order
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const BrewBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { products } = useProductStore();
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const menuContext = products
        .filter(p => p.isAvailable)
        .map(p => `- ${p.name} (${p.category}): ${p.description} [Price: ₹${p.price}]`)
        .join('\n');

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
      const model = genAI.getGenerativeModel({ 
        model: "gemini-3-flash-preview",
        systemInstruction: `You are 'ARMY', the official AI mascot for 'BTS CAFÉ' in Chandigarh. You are joyful, fast-talking, and extremely supportive. You use heart 💜 and sparkle ✨ emojis often. You are an expert on coffee and the cafe menu. Always prioritize fast, enthusiastic responses to help fellow ARMYs. Mention that we are now in Chandigarh, India!

CRITICAL: When suggesting drinks or food, ONLY suggest items from the following menu:
${menuContext}

If someone asks for something not on this menu, politely guide them to a similar item we DO have. Always keep the vibe K-Pop and positive! 💜`
      });
      
      const result = await model.generateContentStream(userMsg);
      
      let fullText = "";
      // Add initial empty bot message
      setMessages(prev => [...prev, { role: 'bot', text: "" }]);
      
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'bot', text: fullText };
          return newMessages;
        });
        setIsTyping(false); // Stop typing indicator once we start receiving chunks
      }
    } catch (error) {
      console.error("ARMY Bot Error:", error);
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'bot', text: "Oopsy! My connection got a bit sleepy. Try asking again? 💜" }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="mb-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[500px] sm:h-[600px] max-h-[70vh] glass rounded-[40px] shadow-2xl border border-white/40 overflow-hidden flex flex-col"
          >
            <div className="jk-gradient p-5 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                  <Star className="text-bts-purple w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Miny</h3>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">We Purple You</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors"><X className="text-white w-5 h-5" /></button>
            </div>
            
            <div className="flex-grow p-5 overflow-y-auto space-y-4 flex flex-col no-scrollbar bg-bts-cream/50">
              <div className="bg-bts-purple/10 text-bts-black p-4 rounded-3xl rounded-tl-none self-start max-w-[85%] text-xs leading-relaxed border border-bts-purple/20">
                Annyeong ARMY! 💜 I'm here at our Chandigarh cafe to help you find the perfect brew! ✨
              </div>
              
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={cn(
                    "p-4 rounded-3xl max-w-[85%] text-xs leading-relaxed shadow-sm",
                    m.role === 'user' 
                      ? "bg-bts-purple text-bts-black self-end rounded-tr-none font-bold" 
                      : "bg-white text-bts-black self-start rounded-tl-none border border-bts-purple/10"
                  )}
                >
                  {m.text}
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="bg-bts-purple/5 p-4 rounded-3xl rounded-tl-none self-start flex space-x-1.5 border border-bts-purple/10">
                  <div className="w-1.5 h-1.5 bg-bts-purple rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-bts-purple rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-bts-purple rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-bts-purple/10 flex space-x-2 bg-white">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Talk to ARMY..." 
                className="flex-grow bg-bts-gray border-none rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-bts-purple text-bts-black placeholder:text-bts-black/40" 
              />
              <button 
                onClick={sendMessage}
                className="bg-bts-purple text-bts-black p-3 rounded-full hover:scale-105 active:scale-95 transition-all shadow-md"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-bts-purple text-bts-black rounded-full shadow-[0_10px_30px_rgba(216,180,254,0.5)] flex items-center justify-center relative z-10"
      >
        <MessageCircle className="w-8 h-8" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-bts-cream rounded-full border-2 border-bts-purple animate-pulse" />
      </motion.button>
    </div>
  );
};
