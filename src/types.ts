export interface ProductVariant {
  type: 'Size' | 'Color' | 'Material';
  options: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  rating: number;
  numReviews: number;
  variants?: ProductVariant[];
  featured?: boolean;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'customer' | 'admin';
  photoURL?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariants?: Record<string, string>;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: any;
  shippingAddress: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
}
