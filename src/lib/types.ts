export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  image: string;
  category: 'Laptops' | 'Phones';
  condition: 'New' | 'Used';
  featured: boolean;
  featured2: boolean;
  timestamp: any;
};

export type CartItem = Product & {
  quantity: number;
};

export type ContactMessage = {
  id: string;
  name: string;
  phone: string;
  message: string;
  createdAt: Date;
};

export type Order = {
  id: string;
  fullName: string;
  phoneNumber: string;
  deliveryMethod: 'pickup' | 'delivery';
  city?: string;
  landmark?: string;
  items: CartItem[];
  timestamp: Date;
}
