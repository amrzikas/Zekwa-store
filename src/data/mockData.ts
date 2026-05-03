import { Product } from '../types';

export const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Living',
  'Beauty',
  'Sports',
  'Books'
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'NeoPlex Wireless Headphones',
    description: 'High-fidelity audio with active noise cancellation and 40-hour battery life.',
    price: 299.99,
    category: 'Electronics',
    stock: 15,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'],
    rating: 4.8,
    numReviews: 124,
    featured: true
  },
  {
    id: '2',
    name: 'Minimalist Leather Watch',
    description: 'Timeless design with premium Italian leather strap and scratch-resistant sapphire crystal.',
    price: 185.00,
    category: 'Fashion',
    stock: 8,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
    rating: 4.6,
    numReviews: 89,
    variants: [
      { type: 'Material', options: ['Leather', 'Steel', 'Nylon'] },
      { type: 'Color', options: ['Black', 'Brown', 'Silver'] }
    ]
  },
  {
    id: '3',
    name: 'Smart Garden Kit',
    description: 'Grow your own herbs indoors with automated lighting and watering system.',
    price: 129.50,
    category: 'Home & Living',
    stock: 20,
    images: ['https://images.unsplash.com/photo-1585336261022-69c6e27171d1?w=800&q=80'],
    rating: 4.9,
    numReviews: 45,
    variants: [
      { type: 'Size', options: ['Small', 'Medium', 'Large'] }
    ],
    featured: true
  },
  {
    id: '4',
    name: 'Ultra-Light Running Shoes',
    description: 'Engineered for speed and comfort with responsive cushioning and breathable mesh.',
    price: 145.00,
    category: 'Sports',
    stock: 12,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'],
    rating: 4.7,
    numReviews: 210,
    variants: [
      { type: 'Size', options: ['7', '8', '9', '10', '11'] },
      { type: 'Color', options: ['Red', 'Blue', 'Black'] }
    ]
  },
  {
    id: '5',
    name: 'Organic Face Serum',
    description: 'Repair and rejuvenate your skin with this powerful blend of botanical extracts.',
    price: 58.00,
    category: 'Beauty',
    stock: 50,
    images: ['https://images.unsplash.com/photo-1570172619992-257262a32397?w=800&q=80'],
    rating: 4.5,
    numReviews: 67
  },
  {
    id: '6',
    name: 'Art of Minimalism Coffee Table Book',
    description: 'A curated collection of minimalist architecture and design from around the world.',
    price: 45.00,
    category: 'Books',
    stock: 30,
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80'],
    rating: 5.0,
    numReviews: 12
  }
];
