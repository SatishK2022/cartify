export interface ProductImage {
  id: string;
  url: string;
  thumbnail: string;
  isPrimary: boolean;
}

export interface Specification {
  label: string;
  value: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  brand: string;
  stock: number;
  sold: number;
  averageRating: number;
  reviewCount: number;
  images: ProductImage[];
  categoryId: string;
  categoryName: string;
  specifications: Specification[];
  reviews: Review[];
  featured?: boolean;
  bestSeller?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  productCount?: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: Address;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  role: 'USER' | 'ADMIN';
  isBlocked: boolean;
  createdAt: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
  };
  readTime: string;
  publishedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  isActive: boolean;
  expiryDate: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  name?: string;
  phone?: string;
  avatar?: string;
}
