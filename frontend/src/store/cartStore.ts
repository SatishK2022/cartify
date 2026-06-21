import { create } from 'zustand';
import { CartItem, Product, Coupon, Address, Order, Customer, Blog, Review, OrderStatus, PaymentStatus } from '../types';
import { mockProducts, mockBlogs } from '../data/mockData';

interface CartState {
  // Storefront & Client State
  cart: CartItem[];
  wishlist: Product[];
  coupon: Coupon | null;
  shippingAddress: Address | null;
  
  // Reactive Database State (Enables full storefront-to-admin integration)
  products: Product[];
  orders: Order[];
  customers: Customer[];
  blogs: Blog[];
  coupons: Coupon[];
  notifications: Array<{ id: string; title: string; text: string; time: string; read: boolean }>;

  // Client Cart / Wishlist Methods
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  setShippingAddress: (address: Address) => void;
  getCartTotal: () => number;
  getDiscountAmount: () => number;
  getFinalTotal: () => number;

  // DB Mock Operations (For Admin Panel integration)
  addProduct: (product: Omit<Product, 'id' | 'averageRating' | 'reviewCount' | 'reviews' | 'sold' | 'slug'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  createOrder: (orderItems: CartItem[], shippingAddress: Address, total: number) => Order;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  updatePaymentStatus: (id: string, status: PaymentStatus) => void;
  addReview: (productId: string, rating: number, comment: string, userName: string) => void;
  addBlog: (blog: Omit<Blog, 'id' | 'publishedAt' | 'slug'>) => void;
  updateBlog: (id: string, blog: Partial<Blog>) => void;
  deleteBlog: (id: string) => void;
  addCoupon: (coupon: Omit<Coupon, 'id' | 'isActive'>) => void;
  updateCoupon: (id: string, coupon: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  toggleUserBlock: (id: string) => void;
  markNotificationRead: (id: string) => void;
}

const initialCoupons: Coupon[] = [
  { id: 'c-1', code: 'WELCOME10', discountType: 'percentage', discountValue: 10, isActive: true, expiryDate: '2026-12-31' },
  { id: 'c-2', code: 'SAVE50', discountType: 'fixed', discountValue: 50, minOrderAmount: 200, isActive: true, expiryDate: '2026-12-31' },
];

const initialCustomers: Customer[] = [
  { id: 'cust-1', name: 'John Doe', email: 'john@example.com', role: 'USER', isBlocked: false, createdAt: '2026-01-15' },
  { id: 'cust-2', name: 'Sarah Connor', email: 'sarah@skynet.com', role: 'USER', isBlocked: false, createdAt: '2026-03-22' },
  { id: 'cust-3', name: 'Marcus Aurelius', email: 'rome@philosophy.edu', role: 'USER', isBlocked: true, createdAt: '2026-04-01' }
];

const initialOrders: Order[] = [
  {
    id: 'ORD-77382',
    userId: 'usr-johndoe',
    items: [
      { id: 'oi-1', productId: 'prod-3', title: 'WH-1000XM5 ANC Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=150&auto=format&fit=crop', price: 349.00, quantity: 1 }
    ],
    totalAmount: 349.00,
    status: 'SHIPPED',
    paymentStatus: 'SUCCESS',
    shippingAddress: {
      id: 'addr-default-1',
      fullName: 'John Doe',
      phone: '+1 (555) 019-2834',
      addressLine1: '120 Stripe Way',
      city: 'San Francisco',
      state: 'CA',
      pincode: '94103',
      country: 'United States',
      isDefault: true
    },
    createdAt: '2026-06-10T14:32:00.000Z'
  },
  {
    id: 'ORD-98834',
    userId: 'usr-sarah',
    items: [
      { id: 'oi-2', productId: 'prod-2', title: 'Studio Display 27" 5K', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=150&auto=format&fit=crop', price: 1499.00, quantity: 1 }
    ],
    totalAmount: 1499.00,
    status: 'DELIVERED',
    paymentStatus: 'SUCCESS',
    shippingAddress: {
      id: 'addr-default-2',
      fullName: 'Sarah Connor',
      phone: '+1 (555) 993-8822',
      addressLine1: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'IL',
      pincode: '62704',
      country: 'United States',
      isDefault: true
    },
    createdAt: '2026-06-12T09:15:00.000Z'
  }
];

const initialNotifications = [
  { id: 'notif-1', title: 'New Order Placed', text: 'Order ORD-77382 was submitted by John Doe.', time: '4 hours ago', read: false },
  { id: 'notif-2', title: 'Inventory Warning', text: 'OP-1 Field Synthesizer is low in stock (5 left).', time: '1 day ago', read: false },
  { id: 'notif-3', title: 'New Customer Registered', text: 'Sarah Connor created an account.', time: '2 days ago', read: true }
];

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  wishlist: [],
  coupon: null,
  shippingAddress: null,

  // Database lists
  products: mockProducts,
  orders: initialOrders,
  customers: initialCustomers,
  blogs: mockBlogs,
  coupons: initialCoupons,
  notifications: initialNotifications,

  addToCart: (product, quantity = 1) => set((state) => {
    const existing = state.cart.find((item) => item.product.id === product.id);
    if (existing) {
      return {
        cart: state.cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        )
      };
    }
    return {
      cart: [...state.cart, { id: `cart-${Math.random().toString(36).substr(2, 9)}`, product, quantity }]
    };
  }),

  removeFromCart: (itemId) => set((state) => ({
    cart: state.cart.filter((item) => item.id !== itemId)
  })),

  updateQuantity: (itemId, quantity) => set((state) => ({
    cart: state.cart.map((item) =>
      item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
    )
  })),

  clearCart: () => set({ cart: [], coupon: null }),

  toggleWishlist: (product) => set((state) => {
    const exists = state.wishlist.some((item) => item.id === product.id);
    if (exists) {
      return { wishlist: state.wishlist.filter((item) => item.id !== product.id) };
    }
    return { wishlist: [...state.wishlist, product] };
  }),

  isInWishlist: (productId) => {
    return get().wishlist.some((item) => item.id === productId);
  },

  applyCoupon: (code) => {
    const normalized = code.trim().toUpperCase();
    const found = get().coupons.find((c) => c.code === normalized && c.isActive);
    if (found) {
      const subtotal = get().getCartTotal();
      if (found.minOrderAmount && subtotal < found.minOrderAmount) {
        return false;
      }
      set({ coupon: found });
      return true;
    }
    return false;
  },

  removeCoupon: () => set({ coupon: null }),

  setShippingAddress: (address) => set({ shippingAddress: address }),

  getCartTotal: () => {
    return get().cart.reduce((total, item) => {
      const price = item.product.discountPrice || item.product.price;
      return total + price * item.quantity;
    }, 0);
  },

  getDiscountAmount: () => {
    const subtotal = get().getCartTotal();
    const coupon = get().coupon;
    if (!coupon) return 0;
    if (coupon.discountType === 'percentage') {
      return (subtotal * coupon.discountValue) / 100;
    } else {
      return Math.min(coupon.discountValue, subtotal);
    }
  },

  getFinalTotal: () => {
    const subtotal = get().getCartTotal();
    const discount = get().getDiscountAmount();
    const shipping = subtotal > 150 ? 0 : subtotal > 0 ? 15 : 0;
    return subtotal - discount + shipping;
  },

  // DB Mock Operations (For Admin Panel integration)
  addProduct: (product) => set((state) => {
    const id = `prod-${Math.random().toString(36).substr(2, 9)}`;
    const slug = product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProduct: Product = {
      ...product,
      id,
      slug,
      averageRating: 0,
      reviewCount: 0,
      reviews: [],
      sold: 0
    };
    return { products: [newProduct, ...state.products] };
  }),

  updateProduct: (id, updated) => set((state) => ({
    products: state.products.map((p) => (p.id === id ? { ...p, ...updated } : p))
  })),

  deleteProduct: (id) => set((state) => ({
    products: state.products.filter((p) => p.id !== id)
  })),

  createOrder: (orderItems, shippingAddress, total) => {
    const id = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id,
      userId: 'usr-default-1',
      items: orderItems.map((item) => ({
        id: `oi-${Math.random().toString(36).substr(2, 9)}`,
        productId: item.product.id,
        title: item.product.title,
        image: item.product.images[0]?.url,
        price: item.product.discountPrice || item.product.price,
        quantity: item.quantity
      })),
      totalAmount: total,
      status: 'PENDING',
      paymentStatus: 'SUCCESS', // Simulate instant credit approval
      shippingAddress,
      createdAt: new Date().toISOString()
    };

    // Update quantities in inventory and sold items
    const updatedProducts = get().products.map((prod) => {
      const item = orderItems.find((ci) => ci.product.id === prod.id);
      if (item) {
        return {
          ...prod,
          stock: Math.max(0, prod.stock - item.quantity),
          sold: prod.sold + item.quantity
        };
      }
      return prod;
    });

    // Add alert notification
    const newNotif = {
      id: `notif-${Math.random().toString(36).substr(2, 9)}`,
      title: 'New Order Placed',
      text: `Order ${id} submitted by ${shippingAddress.fullName} for $${total.toFixed(2)}.`,
      time: 'Just now',
      read: false
    };

    set((state) => ({
      orders: [newOrder, ...state.orders],
      products: updatedProducts,
      notifications: [newNotif, ...state.notifications]
    }));

    return newOrder;
  },

  updateOrderStatus: (id, status) => set((state) => ({
    orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o))
  })),

  updatePaymentStatus: (id, paymentStatus) => set((state) => ({
    orders: state.orders.map((o) => (o.id === id ? { ...o, paymentStatus } : o))
  })),

  addReview: (productId, rating, comment, userName) => set((state) => {
    const id = `rev-${Math.random().toString(36).substr(2, 9)}`;
    const newReview: Review = {
      id,
      userId: 'usr-default-1',
      userName,
      rating,
      comment,
      createdAt: new Date().toISOString().split('T')[0]
    };
    return {
      products: state.products.map((p) => {
        if (p.id === productId) {
          const updatedReviews = [newReview, ...p.reviews];
          const newAvg = parseFloat((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1));
          return {
            ...p,
            reviews: updatedReviews,
            reviewCount: updatedReviews.length,
            averageRating: newAvg
          };
        }
        return p;
      })
    };
  }),

  addBlog: (blog) => set((state) => {
    const id = `blog-${Math.random().toString(36).substr(2, 9)}`;
    const slug = blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newBlog: Blog = {
      ...blog,
      id,
      slug,
      publishedAt: new Date().toISOString().split('T')[0]
    };
    return { blogs: [newBlog, ...state.blogs] };
  }),

  updateBlog: (id, blog) => set((state) => ({
    blogs: state.blogs.map((b) => (b.id === id ? { ...b, ...blog } : b))
  })),

  deleteBlog: (id) => set((state) => ({
    blogs: state.blogs.filter((b) => b.id !== id)
  })),

  addCoupon: (coupon) => set((state) => {
    const id = `c-${Math.random().toString(36).substr(2, 9)}`;
    const newCoupon: Coupon = {
      ...coupon,
      id,
      isActive: true
    };
    return { coupons: [...state.coupons, newCoupon] };
  }),

  updateCoupon: (id, coupon) => set((state) => ({
    coupons: state.coupons.map((c) => (c.id === id ? { ...c, ...coupon } : c))
  })),

  deleteCoupon: (id) => set((state) => ({
    coupons: state.coupons.filter((c) => c.id !== id)
  })),

  toggleUserBlock: (id) => set((state) => ({
    customers: state.customers.map((c) => (c.id === id ? { ...c, isBlocked: !c.isBlocked } : c))
  })),

  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
  }))
}));
