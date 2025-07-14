// src/lib/firebase/database.ts
import {
  get,
  getDatabase,
  push,
  ref,
  remove,
  serverTimestamp,
  set,
  update,
} from 'firebase/database';
import type { ContactMessage, Order, Product } from '../types';
import { app } from './init';

const db = getDatabase(app);

// --- Generic Functions ---

export async function getData<T>(path: string): Promise<T | null> {
  try {
    const snapshot = await get(ref(db, path));
    if (snapshot.exists()) {
      return snapshot.val() as T;
    }
    return null;
  } catch (error) {
    console.error(`Error getting data from ${path}:`, error);
    throw new Error(`Failed to fetch data from ${path}.`);
  }
}

// --- Site Data Functions ---

export async function getHeaderData() {
  return getData<{ logo: string }>('header');
}

export async function getFooterData() {
    return getData<{ about: string; facebook: string; instagram: string; logo: string; phone1: string; phone2: string; whatsapp: string; }>('footer');
}
  
export async function getHomeImage() {
    return getData<string>('homeImage');
}
  
export async function getFeaturedImages(key: 'featuredImages' | 'featuredImages2') {
    return getData<string[]>(key);
}
  
export async function getSpecialAd() {
    return getData<{ image: string; link: string; text: string; visible: boolean; }>('specialAds');
}


// --- Product Functions ---

function processProduct(productData: any, id: string): Product {
    const price = Number(productData.price) || 0;
    const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return {
        ...productData,
        id,
        slug,
        price: isNaN(price) ? 0 : price,
        featured: productData.featured ?? false,
        featured2: productData.featured2 ?? false,
    };
}


export async function getProducts(): Promise<Product[]> {
  const productsData = await getData<{ [key: string]: any }>('products');
  if (!productsData) return [];

  return Object.entries(productsData).map(([id, productData]) => processProduct(productData, id));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    const products = await getProducts();
    const product = products.find(p => p.slug === slug);
    return product || null;
}

export async function getProductById(id: string): Promise<Product | null> {
    const productData = await getData<any>(`products/${id}`);
    if (!productData) return null;
    return processProduct(productData, id);
}


export async function addProduct(product: Omit<Product, 'id' | 'slug' | 'timestamp'>) {
    const slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProductRef = push(ref(db, 'products'));
    await set(newProductRef, {
        ...product,
        price: Number(product.price),
        featured: product.featured || false,
        featured2: product.featured2 || false,
        timestamp: serverTimestamp(),
    });
    return newProductRef.key;
}

export async function updateProduct(productId: string, product: Partial<Product>) {
  const productRef = ref(db, `products/${productId}`);
  await update(productRef, {
      ...product,
      price: Number(product.price),
  });
}

export async function deleteProduct(productId: string) {
  const productRef = ref(db, `products/${productId}`);
  await remove(productRef);
}

// --- Message Functions ---

export async function addMessage(message: Omit<ContactMessage, 'id' | 'createdAt'>) {
    const newMessageRef = push(ref(db, 'messages'));
    await set(newMessageRef, {
        ...message,
        timestamp: serverTimestamp(),
    });
}

export async function getMessages(): Promise<ContactMessage[]> {
    const messagesData = await getData<{ [key: string]: any }>('messages');
    if (!messagesData) return [];

    return Object.entries(messagesData).map(([id, msgData]) => ({
        id,
        name: msgData.name,
        phone: msgData.phone,
        message: msgData.message,
        createdAt: new Date(msgData.timestamp),
    }));
}


// --- Order Functions ---

export async function addOrder(order: Omit<Order, 'id' | 'timestamp'>) {
    const newOrderRef = push(ref(db, 'orders'));
    await set(newOrderRef, {
        ...order,
        timestamp: serverTimestamp(),
    });
}


export async function getOrders(): Promise<Order[]> {
    const ordersData = await getData<{ [key: string]: any }>('orders');
    if (!ordersData) return [];

    return Object.entries(ordersData).map(([id, orderData]) => ({
        id,
        fullName: orderData.fullName,
        phoneNumber: orderData.phoneNumber,
        deliveryMethod: orderData.deliveryMethod,
        city: orderData.city,
        landmark: orderData.landmark,
        items: orderData.items,
        timestamp: new Date(orderData.timestamp),
    }));
}
