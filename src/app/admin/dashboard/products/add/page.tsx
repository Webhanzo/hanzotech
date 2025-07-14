// src/app/admin/dashboard/products/add/page.tsx
'use client';

import ProductForm from '../_components/product-form';
import { addProduct } from '@/lib/firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import type { Product } from '@/lib/types';

// Omit the fields that are auto-generated or not part of the form
type ProductFormValues = Omit<Product, 'id' | 'slug' | 'timestamp'>;

export default function AddProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      await addProduct(values);
      toast({
        title: 'تمت الإضافة بنجاح',
        description: `تمت إضافة المنتج "${values.name}" بنجاح.`,
        className: 'bg-accent text-accent-foreground border-0',
      });
      router.push('/admin/dashboard/products');
    } catch (error) {
      toast({
        title: 'حدث خطأ',
        description: 'لم نتمكن من إضافة المنتج. الرجاء المحاولة مرة أخرى.',
        variant: 'destructive',
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-6 text-2xl font-bold">إضافة منتج جديد</h1>
      <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
