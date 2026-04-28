import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, CartItem, Product, Address } from "@/src/types";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  addAddress: (address: Address) => void;
  removeAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      addAddress: (address) => set((state) => {
        if (!state.user) return state;
        const currentAddresses = state.user.savedAddresses || [];
        // If this is the first address or set as default, make others non-default
        const newAddresses = address.isDefault 
          ? [...currentAddresses.map(a => ({ ...a, isDefault: false })), address]
          : [...currentAddresses, address];
        
        if (newAddresses.length === 1) newAddresses[0].isDefault = true;

        return {
          user: {
            ...state.user,
            savedAddresses: newAddresses
          }
        };
      }),
      removeAddress: (addressId) => set((state) => {
        if (!state.user) return state;
        const newAddresses = (state.user.savedAddresses || []).filter(a => a.id !== addressId);
        // If we removed the default, set the first one as default
        if (newAddresses.length > 0 && !newAddresses.some(a => a.isDefault)) {
          newAddresses[0].isDefault = true;
        }
        return {
          user: {
            ...state.user,
            savedAddresses: newAddresses
          }
        };
      }),
      setDefaultAddress: (addressId) => set((state) => {
        if (!state.user) return state;
        return {
          user: {
            ...state.user,
            savedAddresses: (state.user.savedAddresses || []).map(a => ({
              ...a,
              isDefault: a.id === addressId
            }))
          }
        };
      }),
    }),
    { name: "bts-cafe-auth" }
  )
);

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === product.id);
        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...currentItems, { ...product, quantity: 1 }] });
        }
      },
      removeItem: (productId) =>
        set({ items: get().items.filter((item) => item.id !== productId) }),
      updateQuantity: (productId, quantity) =>
        set({
          items: get().items.map((item) =>
            item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
          ).filter(item => item.quantity > 0),
        }),
      clearCart: () => set({ items: [] }),
      total: () =>
        get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    }),
    { name: "bts-cafe-cart" }
  )
);

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (title: string, message: string) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      addNotification: (title, message) => set((state) => ({
        notifications: [
          { 
            id: Date.now(), 
            title, 
            message, 
            time: "Just now" 
          }, 
          ...state.notifications
        ].slice(0, 5) // Keep last 5
      })),
      clearNotifications: () => set({ notifications: [] }),
    }),
    { name: "bts-cafe-notifications" }
  )
);

export type ThemeFont = 'sans' | 'serif' | 'mono';

interface ThemeState {
  primaryColor: string;
  accentColor: string;
  fontFamily: ThemeFont;
  setPrimaryColor: (color: string) => void;
  setAccentColor: (color: string) => void;
  setFontFamily: (font: ThemeFont) => void;
  resetTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      primaryColor: "#6d28d9", // Default bts-purple
      accentColor: "#fbbf24", // Default gold
      fontFamily: 'sans',
      setPrimaryColor: (primaryColor) => set({ primaryColor }),
      setAccentColor: (accentColor) => set({ accentColor }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
      resetTheme: () => set({
        primaryColor: "#6d28d9",
        accentColor: "#fbbf24",
        fontFamily: 'sans'
      }),
    }),
    { name: "bts-cafe-theme" }
  )
);

