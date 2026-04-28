import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Filter, ShoppingBag, Plus, Minus } from "lucide-react";
import { useCartStore, useNotificationStore } from "@/src/lib/store";
import { useProductStore } from "@/src/lib/productStore";
import { Category, Product } from "@/src/types";
import { formatCurrency, cn } from "@/src/lib/utils";
import { ProductModal } from "@/src/components/ProductModal";
import toast from "react-hot-toast";

const categories: Category[] = ["Coffee", "Tea", "Breads", "Savory", "Signature"];

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addItem } = useCartStore();
  const { addNotification } = useNotificationStore();
  const { products } = useProductStore();

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: Product) => {
    if (!product.isAvailable) {
      toast.error("This item is currently out of stock! 💜");
      return;
    }
    addItem(product);
    setLastAddedId(product.id);
    setTimeout(() => setLastAddedId(null), 2000);
    
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3");
    audio.play().catch(() => {}); // Catch if browser blocks autoplay
  };

  return (
    <div className="bg-bts-cream min-h-screen pt-12 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-display text-6xl md:text-8xl font-bold text-bts-black"
          >
            The <span className="text-bts-purple italic font-light">ARMY</span> Menu
          </motion.h1>
          <p className="text-bts-black/60 font-light text-lg">Curated specialty blends brewed with love in Seoul.</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bts-black/30" />
            <input 
              type="text" 
              placeholder="Search your favorite..." 
              className="w-full glass border-none rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-bts-purple transition-all text-bts-black placeholder:text-bts-black/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
            <button 
              onClick={() => setActiveCategory("All")}
              className={cn(
                "px-8 py-3 rounded-2xl text-sm font-bold transition-all glass uppercase tracking-widest",
                activeCategory === "All" ? "bg-bts-purple text-bts-black" : "text-bts-black hover:bg-bts-purple/10"
              )}
            >
              All
            </button>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-8 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all glass uppercase tracking-widest",
                  activeCategory === cat ? "bg-bts-purple text-bts-black" : "text-bts-black hover:bg-bts-purple/10"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((p) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={p.id}
                className="group relative glass rounded-[40px] p-5 card-hover"
              >
                <div 
                  onClick={() => setSelectedProduct(p)}
                  className={cn("relative h-64 rounded-[2rem] overflow-hidden mb-6 shadow-inner cursor-pointer", !p.isAvailable && "grayscale opacity-60")}
                >
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="bg-bts-black/80 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full w-fit">
                      {p.category}
                    </span>
                    {!p.isAvailable && (
                      <span className="bg-red-500/80 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full w-fit">
                        Out of Stock
                      </span>
                    )}
                  </div>
                  <AnimatePresence>
                    {lastAddedId === p.id && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.8 }}
                        className="absolute inset-0 flex items-center justify-center z-10"
                      >
                        <div className="bg-bts-purple text-bts-black px-6 py-2 rounded-full font-bold shadow-2xl flex items-center space-x-2 border-2 border-white">
                          <ShoppingBag className="w-4 h-4" />
                          <span>Added! 💜</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="px-2 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-xl text-bts-black">{p.name}</h3>
                    <span className="font-display font-medium text-bts-purple-dark text-lg">{formatCurrency(p.price)}</span>
                  </div>
                  <p className="text-bts-black/50 text-sm font-light leading-relaxed line-clamp-2">{p.description}</p>
                  
                  <div className="pt-2">
                    <button 
                      onClick={() => handleAddToCart(p)}
                      disabled={!p.isAvailable}
                      className={cn(
                        "w-full py-4 rounded-3xl font-bold flex items-center justify-center space-x-2 transition-all shadow-lg",
                        p.isAvailable 
                          ? "bg-bts-purple/20 text-bts-purple-dark border border-bts-purple/30 hover:bg-bts-purple hover:text-bts-black shadow-bts-purple/5" 
                          : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 shadow-none"
                      )}
                    >
                      {p.isAvailable ? <Plus className="w-5 h-5" /> : <Minus className="w-5 h-5" />}
                      <span>{p.isAvailable ? "Add to Bag" : "Out of Stock"}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-32 space-y-6">
            <div className="w-20 h-20 bg-bts-gray rounded-full flex items-center justify-center mx-auto">
              <Search className="w-8 h-8 text-bts-black/20" />
            </div>
            <p className="text-bts-black/40 font-light">No delicious items found matching your search.</p>
          </div>
        )}
      </div>

      <ProductModal 
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

const mockProducts: Product[] = []; // Replaced by useProductStore
