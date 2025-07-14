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
}
