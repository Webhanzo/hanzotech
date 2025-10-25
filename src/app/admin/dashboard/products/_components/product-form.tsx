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
import { useToast } from '@/hooks/use-toast';
import { useState, useRef } from 'react';
import { uploadImage } from '@/lib/firebase/storage';
import { Upload } from 'lucide-react';
import Image from 'next/image';


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
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        setIsUploading(true);
        try {
            const url = await uploadImage(file, 'products/');
            form.setValue('image', url);
            toast({ title: "تم رفع الصورة بنجاح" });
        } catch (error) {
            toast({ title: "فشل رفع الصورة", variant: "destructive" });
        } finally {
            setIsUploading(false);
        }
    }
  };


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
              <FormLabel>صورة المنتج</FormLabel>
              <div className="flex items-center gap-4">
                  <FormControl>
                      <Input placeholder="https://..." {...field} readOnly />
                  </FormControl>
                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                      <Upload className="me-2 h-4 w-4" />
                      {isUploading ? "جارٍ الرفع..." : "رفع صورة"}
                  </Button>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              </div>
              {field.value && <Image src={field.value} alt="Preview" width={100} height={100} className="mt-2 rounded-md object-contain border p-2" />}
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
        <Button type="submit" disabled={isSubmitting || isUploading}>
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
