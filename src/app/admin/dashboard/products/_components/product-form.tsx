// src/app/admin/dashboard/products/_components/product-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import type { Product } from '@/lib/types';
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
  featured2: z.boolean().default(false),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  product?: Product;
  onSubmit: (values: ProductFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export default function ProductForm({
  product,
  onSubmit,
  isSubmitting,
}: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: product
      ? {
          ...product,
          price: product.price || 0,
        }
      : {
          name: '',
          description: '',
          longDescription: '',
          price: 0,
          image: '',
          category: 'Laptops',
          condition: 'New',
          featured2: false,
        },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم المنتج</FormLabel>
              <FormControl>
                <Input placeholder="لابتوب..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الوصف القصير</FormLabel>
              <FormControl>
                <Textarea placeholder="وصف موجز للمنتج..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="longDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الوصف الطويل</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="وصف تفصيلي للمنتج..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>السعر (د.أ)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="4500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رابط الصورة</FormLabel>
              <FormControl>
                <Input placeholder="https://placehold.co/600x400" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الفئة</FormLabel>
                <Select
                  dir="rtl"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر فئة" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Laptops">لابتوب</SelectItem>
                    <SelectItem value="Phones">هاتف</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الحالة</FormLabel>
                <Select
                  dir="rtl"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر حالة المنتج" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="New">جديد</SelectItem>
                    <SelectItem value="Used">مستعمل</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="featured2"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>مميز في القسم الثاني؟</FormLabel>
                  <FormDescription>
                    سيظهر هذا المنتج في قسم "منتجاتنا المميزة" في الصفحة
                    الرئيسية.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? product
              ? 'جارٍ التحديث...'
              : 'جارٍ الإضافة...'
            : product
            ? 'تحديث المنتج'
            : 'إضافة منتج'}
        </Button>
      </form>
    </Form>
  );
}
