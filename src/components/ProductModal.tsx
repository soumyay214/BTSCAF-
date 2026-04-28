import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, Star, Clock, Info, Heart, Share2, Sparkles } from "lucide-react";
import { Product } from "@/src/types";
import { formatCurrency, cn } from "@/src/lib/utils";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-bts-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[101] p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-bts-cream w-full max-w-4xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden pointer-events-auto flex flex-col md:flex-row relative"
            >
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 z-20 bg-white/20 backdrop-blur-md p-2 rounded-full text-bts-black hover:bg-white hover:scale-110 transition-all shadow-lg"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Image Section */}
              <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className={cn(
                    "w-full h-full object-cover",
                    !product.isAvailable && "grayscale opacity-80"
                  )}
                />
                
                {/* Floating Tags */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  <span className="bg-bts-black text-white text-[10px] uppercase font-bold tracking-widest px-4 py-2 rounded-full shadow-lg">
                    {product.category}
                  </span>
                  {!product.isAvailable && (
                    <span className="bg-red-500 text-white text-[10px] uppercase font-bold tracking-widest px-4 py-2 rounded-full shadow-lg">
                      Sold Out
                    </span>
                  )}
                </div>

                {/* Photo Credit/Overlay */}
                <div className="absolute bottom-6 left-6 text-white/60 text-[8px] uppercase tracking-tighter">
                  BTS CAFE SPECIAL EDITION • SEASONAL 2024
                </div>
              </div>

              {/* Content Section */}
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between space-y-8 bg-white/40">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-bts-purple-dark text-[10px] font-bold uppercase tracking-widest">
                      <Sparkles className="w-3 h-3" />
                      <span>ARMY Selection</span>
                    </div>
                    <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">{product.name}</h2>
                    <p className="text-3xl font-display font-bold text-bts-purple-dark pt-2">{formatCurrency(product.price)}</p>
                  </div>

                  <p className="text-bts-black/60 text-lg font-light leading-relaxed">
                    {product.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="flex items-center gap-3 text-bts-black/50">
                      <div className="p-2 bg-bts-purple/10 rounded-xl text-bts-purple-dark">
                        <Clock className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider">5-8 Mins</span>
                    </div>
                    <div className="flex items-center gap-3 text-bts-black/50">
                      <div className="p-2 bg-bts-purple/10 rounded-xl text-bts-purple-dark">
                        <Info className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider">Best Seller</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-bts-purple/10">
                  <div className="flex gap-4">
                    <button 
                      onClick={() => onAddToCart(product)}
                      disabled={!product.isAvailable}
                      className={cn(
                        "flex-grow py-5 rounded-3xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl group",
                        product.isAvailable 
                          ? "bg-bts-black text-white hover:bg-bts-purple-dark hover:scale-[1.02]" 
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      )}
                    >
                      <ShoppingBag className={cn("w-5 h-5", product.isAvailable && "group-hover:rotate-12 transition-transform")} />
                      <span>{product.isAvailable ? "Add to Order Bag" : "Currently Unavailable"}</span>
                    </button>
                    
                    <button className="p-5 border border-bts-purple/20 rounded-3xl text-bts-black hover:bg-bts-purple hover:text-white transition-all shadow-sm">
                      <Heart className="w-6 h-6" />
                    </button>
                    <button className="p-5 border border-bts-purple/20 rounded-3xl text-bts-black hover:bg-bts-purple hover:text-white transition-all shadow-sm">
                      <Share2 className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <p className="text-center text-[10px] text-bts-black/30 font-bold uppercase tracking-[0.3em]">
                    Love Yourself, Cafe Yourself 💜
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
