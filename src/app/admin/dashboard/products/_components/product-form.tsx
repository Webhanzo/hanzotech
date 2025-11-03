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
import Image from 'next/image';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { uploadToImageKit } from '@/lib/imagekit-uploader';
import { Upload } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'الاسم مطلوب' }),
  brand: z.string().min(2, { message: 'العلامة التجارية مطلوبة' }),
  description: z.string().min(10, { message: 'الوصف القصير مطلوب' }),
  longDescription: z.string().min(20, { message: 'الوصف الطويل مطلوب' }),
  price: z.coerce.number().min(0, { message: 'السعر يجب أن يكون رقمًا موجبًا' }),
  image: z.string().url({ message: 'الرجاء إدخال رابط صورة صالح' }).min(1, { message: 'الصورة مطلوبة' }),
  category: z.enum(['Mobiles', 'Computers & Tablets', 'Televisions & Home Theatres', 'Cameras', 'Home Appliances', 'Headphones & Speakers', 'Networking & Smart Devices', 'Accessories', 'Gaming', 'Wearables']),
  condition: z.enum(['New', 'Used']),
  rating: z.coerce.number().min(0).max(5).optional(),
  featured: z.boolean().default(false),
  offer: z.boolean().default(false),
  mustHave: z.boolean().default(false),
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

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: product
      ? {
          ...product,
          price: product.price || 0,
          rating: product.rating || 0,
          featured: product.featured || false,
          offer: product.offer || false,
          mustHave: product.mustHave || false,
        }
      : {
          name: '',
          brand: '',
          description: '',
          longDescription: '',
          price: 0,
          image: '',
          category: 'Mobiles',
          condition: 'New',
          rating: 0,
          featured: false,
          offer: false,
          mustHave: false,
        },
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadToImageKit(file);
      form.setValue('image', url);
      toast({ title: 'تم رفع الصورة بنجاح!' });
    } catch (error) {
      toast({ title: 'فشل رفع الصورة', description: 'يرجى التأكد من صحة إعدادات ImageKit.', variant: 'destructive' });
    } finally {
      setIsUploading(false);
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
                <Input placeholder="iPhone 17 Pro..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>العلامة التجارية</FormLabel>
              <FormControl>
                <Input placeholder="Apple" {...field} />
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
                <Textarea placeholder="وصف موجز للمنتج يظهر في البطاقة..." {...field} />
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
                  placeholder="وصف تفصيلي للمنتج يظهر في صفحته الخاصة..."
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
            name="image"
            render={({ field }) => (
                <FormItem>
                <FormLabel>صورة المنتج</FormLabel>
                <FormControl>
                    <div>
                        <Input
                            id="product-image-upload"
                            type="file"
                            className="hidden"
                            onChange={handleImageUpload}
                            accept="image/*"
                            disabled={isUploading || isSubmitting}
                        />
                        <label
                            htmlFor="product-image-upload"
                            className="inline-block cursor-pointer rounded-md bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/80"
                        >
                            <div className="flex items-center gap-2">
                                <Upload className="h-4 w-4" />
                                {isUploading ? 'جارٍ الرفع...' : 'اختر صورة'}
                            </div>
                        </label>
                    </div>
                </FormControl>
                {field.value && (
                    <div className="mt-4">
                        <p className="mb-2 text-sm text-muted-foreground">معاينة الصورة:</p>
                        <Image src={field.value} alt="Product Preview" width={100} height={100} className="rounded-md border object-contain p-2" />
                    </div>
                )}
                <FormMessage />
                </FormItem>
            )}
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
                <FormItem>
                <FormLabel>السعر (د.إ)</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="4500" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
                <FormItem>
                <FormLabel>التقييم (0-5)</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="4.5" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
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
                    <SelectItem value="Mobiles">هواتف</SelectItem>
                    <SelectItem value="Computers & Tablets">كمبيوتر وتابلت</SelectItem>
                    <SelectItem value="Televisions & Home Theatres">تلفزيونات ومسارح منزلية</SelectItem>
                    <SelectItem value="Cameras">كاميرات</SelectItem>
                    <SelectItem value="Home Appliances">أجهزة منزلية</SelectItem>
                    <SelectItem value="Headphones & Speakers">سماعات ومكبرات صوت</SelectItem>
                    <SelectItem value="Networking & Smart Devices">أجهزة الشبكات والذكية</SelectItem>
                    <SelectItem value="Accessories">إكسسوارات</SelectItem>
                    <SelectItem value="Gaming">ألعاب</SelectItem>
                    <SelectItem value="Wearables">أجهزة قابلة للارتداء</SelectItem>
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
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>عرض في "الأكثر مبيعاً"؟</FormLabel>
                  <FormDescription>
                    سيظهر هذا المنتج في قسم الأكثر مبيعاً في الصفحة الرئيسية.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="offer"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>عرض في "عروض الأسبوع"؟</FormLabel>
                  <FormDescription>
                    سيظهر هذا المنتج في قسم عروض الأسبوع في الصفحة الرئيسية.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mustHave"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>عرض في "لازم تقتنيها"؟</FormLabel>
                  <FormDescription>
                    سيظهر هذا المنتج في قسم "لازم تقتنيها" في الصفحة الرئيسية.
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
