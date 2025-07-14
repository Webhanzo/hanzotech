// src/app/admin/dashboard/products/add/page.tsx
'use client';

import ProductForm from '../_components/product-form';
import { addProduct } from '@/lib/firebase/database';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Product } from '@/lib/types';

export default function AddProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: Omit<Product, 'id' | 'slug' | 'timestamp'>) => {
    setIsSubmitting(true);
    try {
      await addProduct(values);
      toast({
        title: 'تمت الإضافة بنجاح',
        description: 'تمت إضافة المنتج إلى قاعدة البيانات.',
        className: 'bg-accent text-accent-foreground border-0',
      });
      router.push('/admin/dashboard/products');
      router.refresh(); // To reflect changes
    } catch (error) {
      console.error(error);
      toast({
        title: 'حدث خطأ',
        description: 'لم نتمكن من إضافة المنتج. الرجاء المحاولة مرة أخرى.',
        variant: 'destructive',
      });
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
