// src/app/admin/dashboard/products/edit/[id]/page.tsx
'use client';

import ProductForm from '../../_components/product-form';
import { getProductById, updateProduct } from '@/lib/firebase/database';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const router = useRouter();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!productId) return;
    getProductById(productId)
      .then((data) => {
        if (data) {
          setProduct(data);
        } else {
          toast({ title: 'خطأ', description: 'المنتج غير موجود.', variant: 'destructive' });
          router.push('/admin/dashboard/products');
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [productId, router, toast]);

  const handleSubmit = async (values: Partial<Product>) => {
    setIsSubmitting(true);
    try {
      await updateProduct(productId, values);
      toast({
        title: 'تم التحديث بنجاح',
        description: 'تم تحديث بيانات المنتج.',
        className: 'bg-accent text-accent-foreground border-0',
      });
      router.push('/admin/dashboard/products');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: 'حدث خطأ',
        description: 'لم نتمكن من تحديث المنتج. الرجاء المحاولة مرة أخرى.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <h1 className="mb-6 text-2xl font-bold">تعديل المنتج</h1>
        <div className='space-y-8'>
          <Skeleton className='h-10 w-full'/>
          <Skeleton className='h-24 w-full'/>
          <Skeleton className='h-24 w-full'/>
          <Skeleton className='h-10 w-full'/>
          <Skeleton className='h-10 w-full'/>
          <Skeleton className='h-10 w-1/2'/>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
        <div className="p-4 md:p-6">
            <h1 className="mb-6 text-2xl font-bold">تعديل المنتج</h1>
            <p>المنتج غير موجود.</p>
        </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
       <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">تعديل المنتج</h1>
         <Button variant="outline" onClick={() => router.back()}>
            <ArrowRight className="me-2 h-4 w-4" />
            رجوع
         </Button>
       </div>
      <ProductForm product={product} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}
