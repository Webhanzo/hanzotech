// src/app/admin/dashboard/products/add/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ProductForm from '../_components/product-form';
import { addProduct } from '@/lib/firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

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
