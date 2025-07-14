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
  getDoc
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
            return docSnap.data();
        }
    } catch (e) {
        console.error(`Error fetching document ${collectionName}/${docId}:`, e);
    }
    return null;
}

// Fetch all site data from the 'site' collection
export async function getSiteData(): Promise<any> {
    const homeData = await getDocument('site', 'home');
    // Ensure we have default values to prevent crashes if data is missing
    return {
        homeImage: homeData?.homeImage || "https://placehold.co/1920x1080/1d3557/ffffff?text=Hero",
        featuredImages: homeData?.featuredImages || [],
        featuredImages2: homeData?.featuredImages2 || [],
    };
}


// Products
export async function getProducts(): Promise<Product[]> {
  const snapshot = await getDocs(collection(db, 'products'));
  const products = snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
        slug: doc.data().slug || doc.id,
        price: Number(doc.data().price) || 0,
      } as Product)
  );
  // Sort by timestamp if it exists, otherwise no specific order
  return products.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
}

export async function addProduct(
  product: Omit<Product, 'id' | 'slug'>
): Promise<void> {
  const slug = product.name.toLowerCase().replace(/\s+/g, '-');
  await addDoc(collection(db, 'products'), { ...product, slug, timestamp: serverTimestamp() });
  revalidatePath('/admin/dashboard/products');
  revalidatePath('/products');
  revalidatePath('/');
}

export async function updateProduct(
  id: string,
  product: Omit<Product, 'id' | 'slug'>
): Promise<void> {
  const slug = product.name.toLowerCase().replace(/\s+/g, '-');
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
  const snapshot = await getDocs(collection(db, 'messages'));
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    // Firebase timestamps need to be converted to Date objects
    const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt || Date.now());
    return {
      id: doc.id,
      ...data,
      createdAt: createdAt,
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
}
