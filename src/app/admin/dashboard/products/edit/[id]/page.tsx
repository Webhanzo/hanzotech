// src/app/admin/dashboard/products/edit/[id]/page.tsx
'use client';

import { z } from 'zod';
import ProductForm from '../../_components/product-form';
import { updateProduct } from '@/lib/firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  name: z.string().min(2, { message: 'الاسم مطلوب' }),
  description: z.string().min(10, { message: 'الوصف القصير مطلوب' }),
  longDescription: z.string().min(20, { message: 'الوصف الطويل مطلوب' }),
  price: z.coerce.number().min(0, { message: 'السعر يجب أن يكون رقمًا موجبًا' }),
  image: z.string().url({ message: 'الرجاء إدخال رابط صورة صالح' }),
  category: z.enum(['Laptops', 'Phones']),
  condition: z.enum(['New', 'Used']),
  featured: z.boolean().default(false),
  featured2: z.boolean().default(false),
});

type ProductFormValues = z.infer<typeof formSchema>;

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const docRef = doc(db, 'products', params.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
      } else {
        toast({
          title: 'المنتج غير موجود',
          variant: 'destructive',
        });
        router.push('/admin/dashboard/products');
      }
      setLoading(false);
    };
    fetchProduct();
  }, [params.id, router, toast]);

  const handleSubmit = async (values: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      await updateProduct(params.id, values);
      toast({
        title: 'تم التحديث بنجاح',
        description: `تم تحديث المنتج "${values.name}" بنجاح.`,
        className: 'bg-accent text-accent-foreground border-0',
      });
      router.push('/admin/dashboard/products');
    } catch (error) {
      toast({
        title: 'حدث خطأ',
        description: 'لم نتمكن من تحديث المنتج. الرجاء المحاولة مرة أخرى.',
        variant: 'destructive',
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
        <div className="p-4 md:p-6 space-y-8">
            <Skeleton className="h-8 w-1/4" />
            <div className="space-y-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    )
  }

  if (!product) {
    return null;
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-6 text-2xl font-bold">
        تعديل المنتج: {product.name}
      </h1>
      <ProductForm
        product={product}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
