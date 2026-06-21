import { Product, Category, Blog } from '../types';

export const mockCategories: Category[] = [
  { id: 'cat-audio', name: 'Audio', slug: 'audio', productCount: 12 },
  { id: 'cat-computing', name: 'Computing', slug: 'computing', productCount: 8 },
  { id: 'cat-wearables', name: 'Wearables', slug: 'wearables', productCount: 6 },
  { id: 'cat-accessories', name: 'Accessories', slug: 'accessories', productCount: 15 },
];

export const mockBrands = [
  { id: 'brand-apple', name: 'Apple', slug: 'apple', logo: '' },
  { id: 'brand-te', name: 'Teenage Engineering', slug: 'teenage-engineering', logo: 'TE' },
  { id: 'brand-sony', name: 'Sony', slug: 'sony', logo: 'SONY' },
  { id: 'brand-keychron', name: 'Keychron', slug: 'keychron', logo: 'K.' },
  { id: 'brand-nomad', name: 'Nomad', slug: 'nomad', logo: 'NOMAD' },
];

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    title: 'OP-1 Field Synthesizer',
    slug: 'op-1-field',
    description: 'The updated battery-powered synthesiser, sampler and controller. With 100+ new features, including 24-bit stereo audio, 24-hour battery life, and multiple tape styles.',
    price: 1999.00,
    brand: 'Teenage Engineering',
    stock: 5,
    sold: 142,
    averageRating: 4.8,
    reviewCount: 37,
    categoryId: 'cat-audio',
    categoryName: 'Audio',
    featured: true,
    bestSeller: true,
    images: [
      { id: 'img-1-1', url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=600&auto=format&fit=crop', thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=150&auto=format&fit=crop', isPrimary: true },
      { id: 'img-1-2', url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=600&auto=format&fit=crop', thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=150&auto=format&fit=crop', isPrimary: false },
    ],
    specifications: [
      { label: 'Battery Life', value: 'Up to 24 hours' },
      { label: 'Audio Resolution', value: '24-bit / 96 kHz stereo' },
      { label: 'Connectivity', value: 'USB-C, Bluetooth LE, 3.5mm I/O' },
      { label: 'Weight', value: '590g' }
    ],
    reviews: [
      { id: 'rev-1-1', userId: 'usr-johndoe', userName: 'John Doe', rating: 5, comment: 'Absolutely legendary piece of design. Feels premium and the battery life is incredible.', createdAt: '2026-05-12' },
      { id: 'rev-1-2', userId: 'usr-dev', userName: 'Marcus Aurelius', rating: 4, comment: 'Amazing updates over the original. Pricey, but worth it for the build quality alone.', createdAt: '2026-06-01' }
    ]
  },
  {
    id: 'prod-2',
    title: 'Studio Display 27" 5K',
    slug: 'studio-display',
    description: 'An immersive 27-inch 5K Retina display with a 12MP Ultra Wide camera with Center Stage, studio-quality mics, and a six-speaker sound system with Spatial Audio.',
    price: 1599.00,
    discountPrice: 1499.00,
    brand: 'Apple',
    stock: 8,
    sold: 89,
    averageRating: 4.6,
    reviewCount: 22,
    categoryId: 'cat-computing',
    categoryName: 'Computing',
    featured: true,
    images: [
      { id: 'img-2-1', url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600&auto=format&fit=crop', thumbnail: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=150&auto=format&fit=crop', isPrimary: true },
      { id: 'img-2-2', url: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=600&auto=format&fit=crop', thumbnail: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=150&auto=format&fit=crop', isPrimary: false },
    ],
    specifications: [
      { label: 'Panel Type', value: 'IPS LCD with 5K Retina resolution' },
      { label: 'Brightness', value: '600 nits' },
      { label: 'Ports', value: '1x Thunderbolt 3, 3x USB-C' },
      { label: 'Camera', value: '12MP Ultra Wide with 122° field of view' }
    ],
    reviews: [
      { id: 'rev-2-1', userId: 'usr-sarah', userName: 'Sarah Connor', rating: 5, comment: 'The integration with macOS is perfect. Studio quality audio is crisp.', createdAt: '2026-04-18' }
    ]
  },
  {
    id: 'prod-3',
    title: 'WH-1000XM5 ANC Headphones',
    slug: 'sony-wh1000xm5',
    description: 'Industry-leading noise canceling headphones with multiple microphone noise canceling, auto-optimizing noise canceling settings, and exceptional audio clarity.',
    price: 398.00,
    discountPrice: 349.00,
    brand: 'Sony',
    stock: 25,
    sold: 340,
    averageRating: 4.7,
    reviewCount: 112,
    categoryId: 'cat-audio',
    categoryName: 'Audio',
    bestSeller: true,
    images: [
      { id: 'img-3-1', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop', thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=150&auto=format&fit=crop', isPrimary: true },
    ],
    specifications: [
      { label: 'Battery Life', value: 'Up to 30 hours' },
      { label: 'Driver Size', value: '30mm dome type' },
      { label: 'Codecs Supported', value: 'SBC, AAC, LDAC' },
      { label: 'Weight', value: '250g' }
    ],
    reviews: [
      { id: 'rev-3-1', userId: 'usr-audiofile', userName: 'Alex Sound', rating: 5, comment: 'Best noise cancellation on the market. Incredibly lightweight.', createdAt: '2026-05-30' }
    ]
  },
  {
    id: 'prod-4',
    title: 'Keychron Q1 Max Custom Keyboard',
    slug: 'keychron-q1-max',
    description: 'A full metal QMK/VIA wireless custom mechanical keyboard, featuring a double-gasket structure, PBT keycaps, and hot-swappable switches for ultimate typing feedback.',
    price: 219.00,
    brand: 'Keychron',
    stock: 12,
    sold: 58,
    averageRating: 4.9,
    reviewCount: 18,
    categoryId: 'cat-computing',
    categoryName: 'Computing',
    images: [
      { id: 'img-4-1', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600&auto=format&fit=crop', thumbnail: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=150&auto=format&fit=crop', isPrimary: true },
    ],
    specifications: [
      { label: 'Frame Material', value: 'Full CNC machined aluminum' },
      { label: 'Connectivity', value: '2.4 GHz, Bluetooth 5.1, Type-C' },
      { label: 'Backlight', value: 'South-facing RGB' },
      { label: 'Hot-swappable', value: 'Yes, 3-pin & 5-pin mechanical switches' }
    ],
    reviews: []
  },
  {
    id: 'prod-5',
    title: 'Base Station V2 Magnetic Charger',
    slug: 'nomad-base-station',
    description: 'A modern, premium charging hub designed to power all your Apple devices simultaneously. Crafted with premium walnut wood, padded leather surfaces, and dual 15W coils.',
    price: 149.95,
    discountPrice: 129.95,
    brand: 'Nomad',
    stock: 30,
    sold: 220,
    averageRating: 4.5,
    reviewCount: 45,
    categoryId: 'cat-accessories',
    categoryName: 'Accessories',
    bestSeller: true,
    images: [
      { id: 'img-5-1', url: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?q=80&w=600&auto=format&fit=crop', thumbnail: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?q=80&w=150&auto=format&fit=crop', isPrimary: true },
    ],
    specifications: [
      { label: 'Materials', value: 'American Walnut, Padded Leather, Aluminum' },
      { label: 'Output', value: 'Dual 15W wireless chargers, 1x USB-C, 1x USB-A' },
      { label: 'Compatibility', value: 'Qi enabled devices, MagSafe alignment' }
    ],
    reviews: []
  },
  {
    id: 'prod-6',
    title: 'Apple Watch Ultra 2 GPS + Cellular',
    slug: 'apple-watch-ultra-2',
    description: 'The ultimate sports and adventure watch. Featuring a rugged titanium case, up to 72 hours of battery life, and a dual-frequency GPS system.',
    price: 799.00,
    brand: 'Apple',
    stock: 15,
    sold: 110,
    averageRating: 4.8,
    reviewCount: 52,
    categoryId: 'cat-wearables',
    categoryName: 'Wearables',
    featured: true,
    images: [
      { id: 'img-6-1', url: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=600&auto=format&fit=crop', thumbnail: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=150&auto=format&fit=crop', isPrimary: true },
    ],
    specifications: [
      { label: 'Case Material', value: 'Aerospace-grade Titanium' },
      { label: 'Display', value: 'Always-On Retina OLED, up to 3000 nits' },
      { label: 'Water Resistance', value: '100m water resistant, Swimproof' },
      { label: 'Battery Life', value: 'Up to 36 hours (72 hours in low power mode)' }
    ],
    reviews: []
  }
];

export const mockBlogs: Blog[] = [
  {
    id: 'blog-1',
    title: 'The Evolution of Minimalist Synthesizers',
    slug: 'minimalist-synthesizers',
    excerpt: 'How Teenage Engineering and other modular designs redefined our relationship with digital hardware and tactile music creation.',
    content: 'Tactile interfaces are making a comeback. In an era dominated by smooth touchscreens, the physical feedback of a clicky switch, a textured slider, or an analog dial offers more than just satisfaction; it establishes an emotional bridge between user and medium. Systems like the OP-1 represent an uncompromising focus on playful design, showing that constraints drive creativity in sound engineering and product development.',
    coverImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=600&auto=format&fit=crop',
    author: {
      name: 'Julian Casablancas',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=80&h=80&fit=crop'
    },
    readTime: '5 min read',
    publishedAt: '2026-05-10'
  },
  {
    id: 'blog-2',
    title: 'Structuring a Modern Workspace for Deep Work',
    slug: 'workspace-deep-work',
    excerpt: 'Selecting displays, ergonomic peripherals, and acoustic treatments to build a distraction-free home office setup.',
    content: 'Distraction is the enemy of craft. Building a clean, high-performance desk workspace requires careful curation. The display should offer maximum text crispness (5K Retina standard) to reduce eye strain, while charging hubs should keep cables hidden out of view. Ergonomics extend beyond the chair; mechanical keyboards with double-gasket systems cushion your keypresses and keep repetitive movements comfortable.',
    coverImage: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600&auto=format&fit=crop',
    author: {
      name: 'Dieter Rams',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=80&h=80&fit=crop'
    },
    readTime: '7 min read',
    publishedAt: '2026-06-02'
  }
];

export const mockFAQs = [
  {
    question: 'What is your shipping policy and delivery timeline?',
    answer: 'We offer free standard shipping on orders over $150. Orders are typically processed in 1-2 business days, and shipping takes 3-5 business days depending on location.'
  },
  {
    question: 'How do I return a product?',
    answer: 'We provide a 30-day return policy for all unused products in their original packaging. Initiating a return is simple—visit your customer portal or contact our support team.'
  },
  {
    question: 'Do your products include a warranty?',
    answer: 'Yes, all products carry a one-year limited manufacturer warranty covering hardware defects or craftsmanship issues. Extended warranties can be purchased during checkout.'
  },
  {
    question: 'Can I change or cancel my order after it has been placed?',
    answer: 'Once an order is placed, it enters processing immediately. If you need to cancel or update details, contact us within 1 hour of purchase, and we will do our best to accommodate your request.'
  }
];
