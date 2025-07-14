// src/lib/firebase/firestore.ts
'use server';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  serverTimestamp,
  getDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

import type { ContactMessage, Product, Order, CartItem } from '@/lib/types';
import { db } from '@/lib/firebase';

// Generic data fetcher for single document
export async function getDocument(collectionName: string, docId: string): Promise<any> {
    try {
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
    } catch (e) {
        console.error(`Error fetching document ${collectionName}/${docId}:`, e);
    }
    return null;
}

// Generic data writer for single document
export async function updateDocument(collectionName: string, docId: string, data: any) {
  const docRef = doc(db, collectionName, docId);
  await setDoc(docRef, data, { merge: true });
  revalidatePath('/', 'layout'); // Revalidate all paths
}

// Fetch all site data from the 'site' collection
export async function getSiteData(): Promise<any> {
    const homeData = await getDocument('site', 'home');
    return {
        homeImage: homeData?.homeImage || "https://placehold.co/1920x1080/1d3557/ffffff?text=Hero",
        featuredImages: homeData?.featuredImages || [],
        featuredImages2: homeData?.featuredImages2 || [],
    };
}

// Products
export async function getProducts(): Promise<Product[]> {
  const productsCollection = collection(db, 'products');
  const q = query(productsCollection, orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);
  const products = snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
        slug: doc.data().slug || doc.id,
        price: Number(doc.data().price) || 0,
      } as Product)
  );
  return products;
}

export async function addProduct(
  product: Omit<Product, 'id' | 'slug' | 'timestamp'>
): Promise<void> {
  const slug = product.name.toLowerCase().replace(/\s+/g, '-').slice(0, 50);
  await addDoc(collection(db, 'products'), { ...product, slug, timestamp: serverTimestamp() });
  revalidatePath('/admin/dashboard/products');
  revalidatePath('/products');
  revalidatePath('/');
}

export async function updateProduct(
  id: string,
  product: Omit<Product, 'id' | 'slug' | 'timestamp'>
): Promise<void> {
  const slug = product.name.toLowerCase().replace(/\s+/g, '-').slice(0, 50);
  await setDoc(doc(db, 'products', id), { ...product, slug }, { merge: true });
  revalidatePath('/admin/dashboard/products');
  revalidatePath('/products');
  revalidatePath(`/products/${slug}`);
  revalidatePath('/');
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, 'products', id));
  revalidatePath('/admin/dashboard/products');
  revalidatePath('/products');
  revalidatePath('/');
}

// Messages
export async function addMessage(
  message: Omit<ContactMessage, 'id' | 'createdAt'>
): Promise<void> {
  await addDoc(collection(db, 'messages'), {
    ...message,
    createdAt: serverTimestamp(),
  });
   revalidatePath('/admin/dashboard/messages');
}

export async function getMessages(): Promise<ContactMessage[]> {
  const messagesCollection = collection(db, 'messages');
  const q = query(messagesCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date();
    return {
      id: doc.id,
      ...data,
      createdAt,
    } as ContactMessage;
  });
}

// Orders
export async function addOrder(orderData: {
    fullName: string;
    phoneNumber: string;
    deliveryMethod: 'pickup' | 'delivery';
    city?: string;
    landmark?: string;
    items: CartItem[];
}): Promise<void> {
    await addDoc(collection(db, 'orders'), {
        ...orderData,
        timestamp: serverTimestamp(),
    });
    revalidatePath('/admin/dashboard/orders');
}

export async function getOrders(): Promise<Order[]> {
    const ordersCollection = collection(db, 'orders');
    const q = query(ordersCollection, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      const timestamp = data.timestamp instanceof Timestamp ? data.timestamp.toDate() : new Date();
      return {
        id: doc.id,
        ...data,
        timestamp,
      } as Order;
    });
  }
