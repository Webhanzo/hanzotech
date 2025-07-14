// src/lib/firebase/firestore.ts
'use server';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

import type { ContactMessage, Product } from '@/lib/types';
import { db } from '@/lib/firebase';

// Products
export async function getProducts(): Promise<Product[]> {
  const snapshot = await getDocs(collection(db, 'products'));
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Product)
  );
}

export async function addProduct(
  product: Omit<Product, 'id' | 'slug'>
): Promise<void> {
  const slug = product.name.toLowerCase().replace(/\s+/g, '-');
  await addDoc(collection(db, 'products'), { ...product, slug });
  revalidatePath('/admin/dashboard/products');
  revalidatePath('/products');
}

export async function updateProduct(
  id: string,
  product: Omit<Product, 'id' | 'slug'>
): Promise<void> {
  const slug = product.name.toLowerCase().replace(/\s+/g, '-');
  await setDoc(doc(db, 'products', id), { ...product, slug });
  revalidatePath('/admin/dashboard/products');
  revalidatePath('/products');
  revalidatePath(`/products/${slug}`);
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, 'products', id));
  revalidatePath('/admin/dashboard/products');
  revalidatePath('/products');
}

// Messages
export async function addMessage(message: Omit<ContactMessage, 'id' | 'createdAt'>): Promise<void> {
  await addDoc(collection(db, 'messages'), {
    ...message,
    createdAt: new Date(),
  });
}

export async function getMessages(): Promise<ContactMessage[]> {
  const snapshot = await getDocs(collection(db, 'messages'));
  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      } as ContactMessage)
  );
}
