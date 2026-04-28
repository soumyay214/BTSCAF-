import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/src/types";

interface ProductState {
  products: Product[];
  toggleAvailability: (productId: string) => void;
  setProducts: (products: Product[]) => void;
}

export const initialProducts: Product[] = [
  {
    id: "1",
    name: "Golden Euphoria Latte",
    price: 380,
    category: "Signature",
    description: "Creamy vanilla bean espresso topped with house-made lavender honey and edible gold flakes.",
    imageUrl: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  },
  {
    id: "2",
    name: "Midnight Magic Matcha",
    price: 350,
    category: "Tea",
    description: "Ceremonial grade charcoal matcha whisked into velvety smooth coconut-infused milk.",
    imageUrl: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  },
  {
    id: "3",
    name: "Classic Creamy Pasta",
    price: 450,
    category: "Savory",
    description: "Rich and creamy white sauce pasta with mushrooms and herbs.",
    imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  },
  {
    id: "4",
    name: "Seoul Morning Hot Coffee",
    price: 280,
    category: "Coffee",
    description: "Our signature dark roast, balanced and smooth, perfect for starting your day.",
    imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  },
  {
    id: "5",
    name: "BTS Signature Frappe",
    price: 420,
    category: "Signature",
    description: "A rich velvet chocolate base with purple whipped cream and gold dust.",
    imageUrl: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  },
  {
    id: "6",
    name: "Iced Hibiscus Tea",
    price: 280,
    category: "Tea",
    description: "Refreshing ruby-red hibiscus tea with hints of dried berries.",
    imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  },
  {
    id: "7",
    name: "Korean Spicy Ramen Bowl",
    price: 380,
    category: "Savory",
    description: "Authentic spicy Korean ramen topped with a soft-boiled egg and scallions.",
    imageUrl: "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  },
  {
    id: "9",
    name: "Honey Butter Bread",
    price: 350,
    category: "Breads",
    description: "Thick-cut milk bread toasted with local honey, salted butter and whipped cream.",
    imageUrl: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  },
  {
    id: "10",
    name: "Garlic Salted Bread",
    price: 280,
    category: "Breads",
    description: "Korean-style soft garlic bread with cream cheese filling and sea salt.",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  },
  {
    id: "11",
    name: "BBQ Chicken Sandwich",
    price: 350,
    category: "Savory",
    description: "Grilled chicken tossed in smoky BBQ sauce with melted cheese and fresh greens.",
    imageUrl: "https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  },
  {
    id: "12",
    name: "Cheese Burst Garlic Bread",
    price: 280,
    category: "Savory",
    description: "Artisan bread loaded with aromatic garlic butter and an explosion of molten cheese.",
    imageUrl: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  },
  {
    id: "13",
    name: "ARMY Energy Americano",
    price: 220,
    category: "Coffee",
    description: "A bold and clean classic, made with our specialty espresso and hot water to keep you energized.",
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  },
  {
    id: "14",
    name: "Classic Cappuccino",
    price: 320,
    category: "Coffee",
    description: "Rich espresso topped with equal parts steamed milk and thick velvet foam.",
    imageUrl: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  },
  {
    id: "17",
    name: "Purple Velvet Cappuccino",
    price: 380,
    category: "Coffee",
    description: "Velvety cappuccino infused with a hint of purple ube and topped with cocoa.",
    imageUrl: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  },
  {
    id: "18",
    name: "Dynamite Mocha",
    price: 450,
    category: "Coffee",
    description: "Rich chocolate mocha with an explosive kick of cinnamon and spice.",
    imageUrl: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  },
  {
    id: "19",
    name: "Butter Caramel Latte",
    price: 430,
    category: "Coffee",
    description: "Smooth as butter! A decadent caramel latte with a hint of salted butter.",
    imageUrl: "https://images.unsplash.com/photo-1599398054066-846f28917f38?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  },
  {
    id: "24",
    name: " Special Cold Coffee",
    price: 450,
    category: "Signature",
    description: "A refreshing blend of bold cold brew with a secret sweet cream topping, as loved by JK.",
    imageUrl: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  },
  {
    id: "25",
    name: "Purple Magic Drink 💜",
    price: 490,
    category: "Signature",
    description: "A magical color-changing butterfly pea flower tea with lemon and honey. Truly purple!",
    imageUrl: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  },
  {
    id: "26",
    name: "Golden Espresso Shot",
    price: 250,
    category: "Signature",
    description: "Our premium espresso with edible gold flakes. Shine like a star with every sip.",
    imageUrl: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  },
  {
    id: "28",
    name: "Seoul Night Dessert Platter",
    price: 1500,
    category: "Signature",
    description: "A luxurious selection of macarons, mini strawberry mousse, and ube tiramisu slices.",
    imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  },
  {
    id: "29",
    name: "Veggie Delight Wrap",
    price: 320,
    category: "Savory",
    description: "Fresh garden vegetables with tangy hummus wrapped in a soft tortilla.",
    imageUrl: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  },
  {
    id: "30",
    name: "Grilled Chicken Panini",
    price: 380,
    category: "Savory",
    description: "Pressed panini with succulent grilled chicken, pesto, and mozzarella.",
    imageUrl: "https://images.unsplash.com/photo-1520174691701-bc555a3404ca?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  },
  {
    id: "31",
    name: "Seoul Street Tteokbokki",
    price: 420,
    category: "Savory",
    description: "Famous Korean chewy rice cakes in a sweet and spicy gochujang sauce.",
    imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  },
  {
    id: "33",
    name: "Spicy Korean Fried Chicken",
    price: 550,
    category: "Savory",
    description: "Double-fried crispy chicken wings glazed in a spicy and sweet honey glaze.",
    imageUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  },
  {
    id: "34",
    name: "Loaded Nacho Platter",
    price: 480,
    category: "Savory",
    description: "Crispy tortilla chips topped with cheese sauce, jalapeños, olives, and sour cream.",
    imageUrl: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  },
  {
    id: "35",
    name: "Butter Croissant Deluxe",
    price: 250,
    category: "Breads",
    description: "Extra flaky and buttery artisan croissant, served warm.",
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  },
  {
    id: "36",
    name: "Chocolate Lava Muffin",
    price: 280,
    category: "Breads",
    description: "Rich chocolate muffin with a molten gooey center.",
    imageUrl: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  },
  {
    id: "37",
    name: "Purple Velvet Cupcake 💜",
    price: 320,
    category: "Breads",
    description: "Soft purple velvet sponge with a smooth cream cheese frosting crown.",
    imageUrl: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  },
  {
    id: "39",
    name: "Strawberry Dream Tart",
    price: 450,
    category: "Breads",
    description: "Shortcrust pastry with vanilla custard and fresh glazed strawberries.",
    imageUrl: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  },
  {
    id: "40",
    name: "Korean Cream Bun",
    price: 280,
    category: "Breads",
    description: "Sweet milk bread filled with light, whipped vanilla cream.",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  },
  {
    id: "41",
    name: "Blueberry Cheesecake Slice",
    price: 480,
    category: "Breads",
    description: "Creamy New York style cheesecake with a thick blueberry swirl.",
    imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  },
  {
    id: "42",
    name: "Macaron Box (ARMY Special)",
    price: 950,
    category: "Breads",
    description: "A specially curated box of 6 purple-themed macarons in assorted flavors.",
    imageUrl: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  },
  {
    id: "43",
    name: "Caramel Donut Rings",
    price: 220,
    category: "Breads",
    description: "Soft yeast-raised donuts dipped in a rich, buttery caramel glaze.",
    imageUrl: "https://images.unsplash.com/photo-1527515545081-5db817172677?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  },
  {
    id: "44",
    name: "Vanilla Cloud Cake",
    price: 520,
    category: "Breads",
    description: "Ultra-light vanilla chiffon cake that melts in your mouth like a cloud.",
    imageUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=800",
    isAvailable: true
  }
];

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: initialProducts,
      toggleAvailability: (productId) => set((state) => ({
        products: state.products.map(p => 
          p.id === productId ? { ...p, isAvailable: !p.isAvailable } : p
        )
      })),
      setProducts: (products) => set({ products }),
    }),
    { name: "bts-cafe-products" }
  )
);
