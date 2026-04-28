export type Category = "Coffee" | "Tea" | "Savory" | "Signature" | "Breads";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  imageUrl: string;
  isAvailable: boolean;
}

export interface Address {
  id: string;
  label: string; // e.g., Home, Office
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  phoneNumber?: string;
  role: "customer" | "admin";
  loyaltyPoints: number;
  savedAddresses?: Address[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered" | "cancelled";
  paymentStatus: "unpaid" | "paid";
  createdAt: string;
  deliveryOption: "pickup" | "delivery";
}
