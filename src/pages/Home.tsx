import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Star, Heart, Clock, ShieldCheck, Sparkles, Coffee } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useNotificationStore, useCartStore } from "@/src/lib/store";
import { useProductStore } from "@/src/lib/productStore";
import { formatCurrency, cn } from "@/src/lib/utils";
import { Product } from "@/src/types";
import { ProductModal } from "@/src/components/ProductModal";

export default function Home() {
  const { addNotification } = useNotificationStore();
  const { addItem } = useCartStore();
  const { products } = useProductStore();
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  
  const featured = products.filter(p => p.category === "Signature").slice(0, 4);

  const handleAddToCart = (product: Product) => {
    if (!product.isAvailable) {
      toast.error("This item is currently out of stock! 💜");
      return;
    }
    addItem(product);
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3");
    audio.play().catch(() => {});
  };

  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden bg-bts-cream">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-bts-cream via-bts-cream/60 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=2000" 
            alt="Artisan Coffee" 
            className="w-full h-full object-cover opacity-70 scale-105"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl glass p-10 rounded-[50px] space-y-8"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-bts-purple/10 text-bts-purple text-xs font-bold rounded-full mb-4 uppercase tracking-[0.2em] border border-bts-purple/30">
              <Sparkles className="w-4 h-4 text-bts-purple" />
              <span>Est. 2026 • Soul of Seoul</span>
            </div>
            
            <h1 className="text-bts-black font-display text-7xl md:text-9xl font-bold leading-[0.9] tracking-tighter">
              Korean <br />
              <span className="text-bts-purple-dark italic font-light">Melody.</span>
            </h1>
            
            <p className="text-bts-black/70 text-lg md:text-xl font-light leading-relaxed max-w-lg">
              Experience the harmony of specialty Korean blends. A soft escape for your everyday rhythm, now in Chandigarh.
            </p>

            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pt-8">
              <Link 
                to="/menu" 
                className="group bg-bts-purple-dark text-white px-12 py-5 rounded-full text-lg font-bold hover:bg-bts-black transition-all shadow-xl shadow-bts-purple/20 flex items-center"
              >
                Order Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Decorative Rotating Seal */}
        <div className="absolute bottom-10 right-10 hidden lg:block z-20">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="w-48 h-48 border border-bts-purple/20 rounded-full flex items-center justify-center p-6 bg-bts-cream/30 backdrop-blur-md shadow-inner"
          >
            <div className="w-full h-full border border-bts-purple/10 rounded-full flex items-center justify-center relative">
               <span className="absolute inset-0 flex items-center justify-center">
                 <Coffee className="w-6 h-6 text-bts-purple-dark/40" />
               </span>
               <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
                 <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
                 <text className="text-[7.5px] uppercase tracking-[0.3em] font-bold fill-bts-purple-dark/60">
                   <textPath xlinkHref="#circlePath">
                     Premium Quality • Organic Beans • Soul Roasted •
                   </textPath>
                 </text>
               </svg>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quality Experience Section with Cherry Blossoms */}
      <section className="relative py-40 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1528114039593-4366cc08227d?auto=format&fit=crop&q=80&w=2000" 
            alt="Seoul Cherry Blossoms" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bts-cream via-white/40 to-bts-cream z-10" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="bg-bts-cream/80 backdrop-blur-xl border border-white/60 p-16 rounded-[60px] shadow-2xl space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-6">
              <h2 className="font-display text-6xl font-bold">Pure <span className="text-bts-purple-dark italic">Essence</span></h2>
              <p className="text-bts-black/60 font-light text-lg">From the cherry blossom paths of Seoul to your cup in Chandigarh, we bring a harmony of excellence.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Premium Quality", icon: <Star className="w-8 h-8" />, desc: "Only the top 1% of specialty beans make it into our signature purple roasts." },
                { title: "Organic Beans", icon: <ShieldCheck className="w-8 h-8" />, desc: "Sustainable, earth-friendly farming practices from micro-lots across Korea." },
                { title: "Soul Roasted", icon: <Clock className="w-8 h-8" />, desc: "Slow-roasted at high altitudes to capture the melodic soul of every bean." }
              ].map((item, i) => (
                <div key={i} className="bg-white/50 p-10 rounded-[40px] border border-bts-purple/10 text-center space-y-6 card-hover">
                  <div className="w-16 h-16 bg-bts-purple/10 rounded-2xl flex items-center justify-center mx-auto text-bts-purple-dark">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                  <p className="text-bts-black/50 font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cafe History Section */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=1000" 
                alt="Cafe Origins" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-bts-purple rounded-[40px] -z-0 opacity-20 blur-3xl animate-pulse" />
          </motion.div>
          
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="font-display text-5xl font-bold leading-tight">The <span className="text-bts-purple-dark italic">BTS CAFÉ</span> Legacy</h2>
              <p className="text-bts-black/60 text-lg font-light leading-relaxed">
                Founded in the heart of Seoul in 2026, BTS CAFÉ was born from a simple vision: to create a sanctuary where the vibrant energy of youth meets the timeless tradition of master-brewed coffee.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-bts-purple/10 rounded-2xl flex items-center justify-center shrink-0">
                  <Star className="text-bts-purple-dark w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Artisanal Roots</h4>
                  <p className="text-bts-black/50 text-sm font-light">We started with just three micro-roasters in a hidden alley of Hannam-dong, perfecting the "Purple Roast" that defines our signature flavor today.</p>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-bts-purple/10 rounded-2xl flex items-center justify-center shrink-0">
                  <Heart className="text-bts-purple-dark w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Community First</h4>
                  <p className="text-bts-black/50 text-sm font-light">More than just a café, we are a hub for dreamers. Our "Born To Shine" initiative supports local artists by transforming our walls into living galleries.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu Preview */}
      <section className="bg-bts-gray py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-end space-y-6 md:space-y-0">
            <div className="space-y-4">
              <h2 className="font-display text-5xl font-bold tracking-tight">Today's <span className="text-bts-purple-dark italic">Signature</span></h2>
              <p className="text-bts-black/60 font-light max-w-md">Our most loved creations, inspired by the vibrant energy of Korean pop culture.</p>
            </div>
            <Link to="/menu" className="text-bts-purple-dark font-bold hover:underline flex items-center uppercase tracking-widest text-xs">
              View Entire Menu <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map((p, i) => (
              <ProductCard 
                key={p.id} 
                item={p} 
                index={i} 
                onAddToCart={() => handleAddToCart(p)} 
                onImageClick={() => setSelectedProduct(p)}
              />
            ))}
          </div>
        </div>

        <ProductModal 
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      </section>

      {/* Social Proof */}
      <section className="max-w-3xl mx-auto px-4 text-center space-y-12">
        <div className="flex justify-center space-x-1">
          {[1,2,3,4,5].map(i => <Star key={i} className="text-bts-purple w-6 h-6 fill-current" />)}
        </div>
        <p className="text-2xl font-display font-medium italic leading-relaxed text-bts-black/80">
          "The best coffee experience I've had outside of Myeong-dong. The purple aesthetic and attention to detail make every cup special."
        </p>
        <div className="flex items-center justify-center space-x-4">
          <div className="w-12 h-12 bg-bts-purple rounded-full" />
          <div className="text-left">
            <p className="font-bold">Jeon Jung-kook</p>
            <p className="text-xs text-bts-black/40 uppercase tracking-widest">Verified Customer</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="locations" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 border-t border-bts-purple/10">
        <div id="contact" className="glass rounded-[40px] p-8 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-8">
            <h2 className="font-display text-5xl font-bold italic">Say <span className="text-bts-purple-dark">Annyeong</span>.</h2>
            <p className="text-bts-black/60 text-lg font-light leading-relaxed">
              Have questions about our blends or interested in hosting an ARMY event? Drop us a message!
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-bts-purple/10 rounded-xl flex items-center justify-center">
                  <Star className="text-bts-purple-dark w-5 h-5" />
                </div>
                <span className="text-sm font-medium">Ind, Chandigarh</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-bts-purple/10 rounded-xl flex items-center justify-center">
                  <Heart className="text-bts-purple-dark w-5 h-5" />
                </div>
                <span className="text-sm font-medium">hello@btscafe.com • +91 76960-20701</span>
              </div>
            </div>
          </div>
          
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            addNotification("New Message Sent", "Your message to BTS CAFÉ is on its way! 💜");
            toast.success("Message sent! ARMY always listens! 💜");
            const form = e.target as HTMLFormElement;
            form.reset();
          }}>
            <div className="grid grid-cols-2 gap-4">
              <input required type="text" placeholder="Name" className="w-full glass border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-bts-purple text-sm" />
              <input required type="email" placeholder="Email" className="w-full glass border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-bts-purple text-sm" />
            </div>
            <input required type="text" placeholder="Subject" className="w-full glass border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-bts-purple text-sm" />
            <textarea required placeholder="Message" rows={4} className="w-full glass border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-bts-purple text-sm resize-none"></textarea>
            <button type="submit" className="w-full bg-bts-black text-white py-5 rounded-2xl font-bold hover:bg-bts-purple transition-all shadow-xl">
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

const HighlightCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="p-8 glass rounded-3xl card-hover">
    <div className="w-16 h-16 bg-bts-purple/10 rounded-2xl flex items-center justify-center mb-8">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    <p className="text-bts-black/60 font-light leading-relaxed">{description}</p>
  </div>
);

const ProductCard: React.FC<{ item: Product; index: number; onAddToCart: () => void; onImageClick: () => void }> = ({ item, index, onAddToCart, onImageClick }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="group relative glass rounded-[32px] p-5 card-hover"
  >
    <div 
      onClick={onImageClick}
      className={cn("h-64 overflow-hidden relative rounded-2xl cursor-pointer", !item.isAvailable && "grayscale opacity-60")}
    >
      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute top-4 right-4 bg-bts-cream/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
        {item.category}
      </div>
      {!item.isAvailable && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-red-500/80 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-widest px-4 py-2 rounded-full">Out of Stock</span>
        </div>
      )}
    </div>
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-lg">{item.name}</h4>
        <span className="text-bts-purple-dark font-display font-bold">{formatCurrency(item.price)}</span>
      </div>
      <p className="text-bts-black/50 text-sm font-light line-clamp-2">{item.description}</p>
      <button 
        disabled={!item.isAvailable}
        onClick={() => {
          onAddToCart();
        }}
        className={cn(
          "w-full py-3 rounded-xl text-sm font-semibold transition-colors",
          item.isAvailable 
            ? "bg-bts-black text-bts-cream hover:bg-bts-purple-dark" 
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        )}
      >
        {item.isAvailable ? "Add to Cart" : "Out of Stock"}
      </button>
    </div>
  </motion.div>
);

const featuredProducts: any[] = []; // Replaced by useProductStore
